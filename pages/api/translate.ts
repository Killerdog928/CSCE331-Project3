// Import the correct Translate API
import { Translate } from "@google-cloud/translate/build/src/v2"; // Use v2 API directly
import { NextApiRequest, NextApiResponse } from "next";

// Define the type for the menu item
type MenuItem = {
  name: string;
  description: string;
  route: string;
  image: string;
};

// Configure Google Cloud Translation API
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY, // Use an environment variable to store your API key
});

/**
 * API handler for translating menu items to a specified target language.
 *
 * @param req - The HTTP request object, expected to be a POST request with a JSON body containing `targetLanguage` and `content`.
 * @param res - The HTTP response object used to send back the translated content or error messages.
 *
 * The request body should have the following structure:
 *
 * ```json
 * {
 *   "targetLanguage": "string",
 *   "content": [
 *     {
 *       "name": "string",
 *       "description": "string"
 *     }
 *   ]
 * }
 * ```
 *
 * The handler performs the following steps:
 * 1. Checks if the request method is POST. If not, responds with a 405 status code.
 * 2. Validates the presence of `targetLanguage` and `content` in the request body. If missing, responds with a 400 status code.
 * 3. Prepares an array of strings to be translated by extracting `name` and `description` from each menu item.
 * 4. Uses the Google Translate API to translate the strings into the target language.
 * 5. Reconstructs the translated content into the original structure and responds with a 200 status code and the translated content.
 * 6. Handles any errors during the translation process and responds with a 500 status code.
 *
 * @returns {void}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });

    return;
  }

  const {
    targetLanguage,
    content,
  }: { targetLanguage: string; content: MenuItem[] } = req.body;

  // Check if the request is valid
  if (!targetLanguage || !content) {
    res.status(400).json({ error: "Missing targetLanguage or content" });

    return;
  }

  try {
    // Google Translate requires an array of strings for bulk translation
    const stringsToTranslate = content
      .map((item) => [item.name, item.description]) // Map over the items
      .flat(); // Flatten the array

    // Translate all strings
    const [translations] = await translate.translate(
      stringsToTranslate,
      targetLanguage,
    );

    // Extract translations back into the original structure
    let index = 0;
    const translatedContent = content.map((item) => ({
      ...item,
      name: translations[index++], // Translate name
      description: translations[index++], // Translate description
    }));

    res.status(200).json({ translation: translatedContent });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
}
