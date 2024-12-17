import fs from "fs";
import path from "path";

import formidable, { File } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI, { toFile } from "openai";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle multipart
  },
};
interface Item {
  id: number;
  name: string;
  calories: number;
  additionalPrice: number;
}

interface Sellable {
  Items: Item[];
  Sellable: { name: string }; // Sellable Type (e.g., Plate, Bowl, etc.)
}

interface OrderStructure {
  customerName: string;
  totalPrice: number;
  Employee: { id: number };
  SoldSellables: Sellable[];
}

const openai = new OpenAI();
const transcriptionDir = path.resolve("public", "transcriptions");
const speechDir = path.resolve("public", "speech");

if (!fs.existsSync(transcriptionDir))
  fs.mkdirSync(transcriptionDir, { recursive: true });
if (!fs.existsSync(speechDir)) fs.mkdirSync(speechDir, { recursive: true });

/**
 * API handler for processing audio transcription and converting it into a structured JSON order.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 *
 * @returns A JSON response containing the transcription, GPT-enhanced text, and a URL to the saved transcription file.
 *
 * @remarks
 * - This handler only accepts POST requests. If the request method is not POST, it returns a 405 Method Not Allowed error.
 * - The handler uses the `formidable` library to parse the incoming form data and extract the audio file.
 * - The audio file is processed using OpenAI's Whisper model for transcription.
 * - The transcribed text is then processed using OpenAI's GPT model to convert it into a structured JSON order.
 * - The structured JSON order is further validated and enhanced by fetching additional item details from an API.
 * - The final order structure is saved to a file, and the response includes a URL to this file.
 *
 * @throws {Error} If there is an error parsing the form data, processing the audio, or handling the GPT response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = formidable({
    multiples: false,
    uploadDir: path.resolve("/tmp"), // Ensure this directory exists
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);

      return res.status(400).json({ error: "Failed to parse form data" });
    }

    const audioFiles = files.audio as File[] | undefined;
    const audioFile = audioFiles ? audioFiles[0] : undefined;

    if (!audioFile) {
      console.error("No audio file provided in the request.");

      return res.status(400).json({ error: "No audio file provided" });
    }

    const filePath = audioFile.filepath;

    if (!filePath) {
      console.error("File path is undefined");

      return res.status(500).json({ error: "Invalid file path" });
    }

    try {
      // Transcription using Whisper
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: await toFile(
          fs.readFileSync(filePath),
          audioFile.originalFilename || "audio.webm",
        ),
        model: "whisper-1",
      });

      const transcriptionText = transcriptionResponse.text;
      // Process transcription through GPT
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
            You will be given a Panda Express order, like "I'd like a plate with orange chicken and chow mein." Your task is to convert this into a structured JSON object, honoring the user's order and including what they requested. Here's the structure you should follow:
{
  customerName: "Customer Name",
  totalPrice: 10,
  Employee: { id: 1 },
  SoldSellables: [
    {
      Items: [
        {
          id: -1
          name: item.name, // Name of the item
          calories: 0, // Caloric value of the item
          additionalPrice: 0, // Additional price for the item
        },
      ],
      Sellable: { name: "Sellable Type" }, // Type of order (e.g., Plate, Bowl, etc.)
    },
  ],
};

You will process an order based on these rules:

1. **Sellable Types**: The restaurant offers the following options:
   - Bowl (2 sides, 1 entree)
   - Plate (2 sides, 2 entrees)
   - Bigger Plate (2 sides, 3 entrees)
   - Appetizer (1 appetizer)
   - Drink (1 drink)

2. If a customer says, say "I'd like a plate with chow mein and orange chicken," give them two orange chicken items and two chow mein items, according to the Sellable Type. Do the same for other Sellable Types.

3. **Output**: Return a structured JavaScript object matching the pattern above.

4. Use the format strictly as specified and include the user-provided item names in the \`"Items"\` array.

Please include NO OTHER content other than the requested JSON object. Put placeholder values for id, calories, and additionalPrice since we haven't yet called the API. This output will DIRECTLY be fed into a program for processing, so any other text will break things.
`,
          },
          {
            role: "user",
            content: transcriptionText,
          },
        ],
      });
      const gptEnhancedText = gptResponse.choices[0]?.message?.content || "";

      try {
        // Step 1: Clean the GPT response from the first call
        const cleanedGptResponse = gptEnhancedText
          .replace(/```json/g, "") // Remove JSON code block markers
          .replace(/```javascript/g, "") // Remove JavaScript code block markers
          .replace(/```/g, "") // Remove other code block markers
          .replace(/^const\s+\w+\s*=\s*/, "") // Remove variable declaration
          .replace(/;\s*$/, "") // Remove trailing semicolon
          .trim(); // Trim whitespace

        // Step 2: Feed cleaned response into GPT for strict JSON conversion
        const secondGptResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a strict JSON formatter. Take the following JavaScript-like object and convert it into valid JSON. The JSON must conform to this structure:

{
  "customerName": "string",
  "totalPrice": number,
  "Employee": { "id": number },
  "SoldSellables": [
    {
      "Items": [
        { "id": number, "name": "string", "calories": number, "additionalPrice": number }
      ],
      "Sellable": { "name": "string" }
    }
  ]
}

Do not include any text other than the JSON object.`,
            },
            { role: "user", content: cleanedGptResponse },
          ],
        });

        // Step 3: Clean the second GPT response
        const secondGptResponseText =
          secondGptResponse.choices[0]?.message?.content || "";
        const finalCleanedResponse = secondGptResponseText
          .replace(/```json/g, "")
          .replace(/```javascript/g, "")
          .replace(/```/g, "")
          .replace(/^const\s+\w+\s*=\s*/, "")
          .trim();

        // Step 4: Parse the final cleaned response into JSON
        let parsedOrder: OrderStructure;

        try {
          parsedOrder = JSON.parse(finalCleanedResponse);
        } catch (parseError) {
          throw new Error(`Failed to parse JSON: ${finalCleanedResponse}`);
        }

        // Validate parsed order structure
        if (!parsedOrder || !Array.isArray(parsedOrder.SoldSellables)) {
          throw new Error(
            "Invalid parsed order structure: Missing SoldSellables.",
          );
        }
        const baseUrl = process.env.BASE_URL || "http://localhost:3000";

        // Fetch details for each item
        for (const sellable of parsedOrder.SoldSellables) {
          for (const item of sellable.Items) {
            const apiUrl = `${baseUrl}/api/closest-item?name=${encodeURIComponent(item.name)}`;
            const response = await fetch(apiUrl);
            const fetchedItem: Item = await response.json();

            if (fetchedItem && fetchedItem.id) {
              // Update item with actual details
              item.id = fetchedItem.id;
              item.calories = fetchedItem.calories;
              item.additionalPrice = fetchedItem.additionalPrice;
            } else {
              // Use placeholder values if the item was not found
              item.id = -1;
              item.calories = 0;
              item.additionalPrice = 0;
            }
          }
        }

        // Calculate total price
        parsedOrder.totalPrice = parsedOrder.SoldSellables.reduce(
          (total: number, sellable: Sellable) => {
            return (
              total +
              sellable.Items.reduce((subtotal: number, item: Item) => {
                return subtotal + item.additionalPrice;
              }, 0)
            );
          },
          0,
        );

        // Save transcription and enhanced order
        const transcriptionFilename = `transcription-${Date.now()}.txt`;
        const transcriptionPath = path.join(
          transcriptionDir,
          transcriptionFilename,
        );

        fs.writeFileSync(
          transcriptionPath,
          `Original Transcription: ${transcriptionText}\nGPT Response: ${JSON.stringify(parsedOrder, null, 2)}`,
        );

        res.status(200).json({
          transcription: transcriptionText,
          gptEnhancedText,
          transcriptionUrl: `/transcriptions/${transcriptionFilename}`,
        });
      } catch (error) {
        console.error("Error processing GPT response:", error);
        res.status(500).json({ error: "Failed to process GPT response" });
      }
    } catch (error) {
      console.error("Error processing audio:", error);

      return res.status(500).json({ error: "Failed to process audio" });
    }
  });
}
