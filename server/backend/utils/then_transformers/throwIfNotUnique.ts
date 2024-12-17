/**
 * Throws an error if the provided array of values is not unique.
 *
 * @template T - The type of the values in the array.
 * @param {string} name - The name of the entity being checked for uniqueness.
 * @param {any} queryInfo - Information about the query used to find the values.
 * @param {ErrorOptions} [options] - Optional error options to pass to the Error constructor.
 * @returns {(values: T[]) => T} - A function that takes an array of values and returns the first value if it is unique.
 * @throws {Error} - Throws an error if no values are found or if multiple values are found.
 */
export function throwIfNotUnique<T>(
  name: string,
  queryInfo: any,
  options?: ErrorOptions,
): (values: T[]) => T {
  return (values: T[]) => {
    if (values.length === 0) {
      throw new Error(
        `Couldn't find ${name} matching ${JSON.stringify(queryInfo)}`,
        options,
      );
    } else if (values.length > 1) {
      throw new Error(
        `Found multiple ${name} matching ${JSON.stringify(queryInfo)}`,
        options,
      );
    }

    return values[0];
  };
}
