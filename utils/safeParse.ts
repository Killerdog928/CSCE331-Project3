/**
 * Safely parses a value into a float.
 * @param {string | number} value - The value to parse.
 * @returns {number | undefined} The parsed float or undefined if the input is an empty string.
 */
export const safeParseFloat = (value: string | number) =>
  typeof value === "string"
    ? value.length
      ? parseFloat(value)
      : undefined
    : value;

/**
 * Safely parses a value into an integer.
 * @param {string | number} value - The value to parse.
 * @returns {number | undefined} The parsed integer or undefined if the input is an empty string.
 */
export const safeParseInt = (value: string | number) =>
  typeof value === "string"
    ? value.length
      ? parseInt(value)
      : undefined
    : value;
