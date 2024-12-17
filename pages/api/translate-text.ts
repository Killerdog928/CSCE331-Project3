import * as dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

interface TranslateTextProps {
  text: string;
  targetLanguage: string;
}

/**
 * Translates the given text to the specified target language using the Google Translate API.
 *
 * @param {TranslateTextProps} props - The properties for the translation.
 * @param {string} props.text - The text to be translated.
 * @param {string} props.targetLanguage - The target language code (e.g., 'en' for English, 'es' for Spanish).
 * @returns {Promise<string>} A promise that resolves to the translated text.
 * @throws {Error} Throws an error if the translation API request fails.
 */
export async function translateText({
  text,
  targetLanguage,
}: TranslateTextProps): Promise<string> {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=AIzaSyAagpeWlShObQbGT3R3bGqjdw7hcW_xprU`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Translation API failed.");
    }

    const data = await response.json();

    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Translation failed.");
  }
}
