/**
 * Decodes HTML entities in a string.
 * @param {string} text - The text containing HTML entities.
 * @returns {string} The decoded text.
 */
export function decodeHtmlEntity(text: string) {
  const parser = new DOMParser();
  const decodedString =
    parser.parseFromString(text, "text/html").body.textContent || "";

  return decodedString;
}
