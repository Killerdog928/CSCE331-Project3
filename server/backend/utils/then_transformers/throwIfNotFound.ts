/**
 * Throws an error if the provided value is `null`.
 *
 * @template T - The type of the value to be checked.
 * @param {string} name - The name of the entity being queried.
 * @param {any} queryInfo - Information about the query.
 * @param {ErrorOptions} [options] - Optional error options.
 * @returns {(value: T | null) => T} - A function that takes a value and returns it if it's not `null`, otherwise throws an error.
 * @throws {Error} - Throws an error if the value is `null`.
 */
export function throwIfNotFound<T>(
  name: string,
  queryInfo: any,
  options?: ErrorOptions,
): (value: T | null) => T {
  return (value: any | null) => {
    if (value === null) {
      throw new Error(
        `Couldn't find ${name} matching ${JSON.stringify(queryInfo)}`,
        options,
      );
    }

    return value;
  };
}
