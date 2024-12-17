/**
 * Returns a function that throws an error if the provided condition is met.
 *
 * @template T - The type of the value to be checked.
 * @param condition - A function that takes a value of type T and returns a boolean indicating whether the condition is met.
 * @param message - The error message to be thrown if the condition is met.
 * @param options - Optional error options to be passed to the Error constructor.
 * @returns A function that takes a value of type T and returns the value if the condition is not met, otherwise throws an error.
 */
export function throwIf<T>(
  condition: (value: T) => boolean,
  message: string,
  options?: ErrorOptions,
): (value: T) => T {
  return (value: T) => {
    if (condition(value)) {
      throw new Error(message, options);
    }

    return value;
  };
}
