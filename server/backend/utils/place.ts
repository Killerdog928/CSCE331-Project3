/**
 * Places values from the `values` array into a new array based on the `mask` array.
 * If an element in the `mask` array is truthy, the corresponding element from the `values` array
 * is placed in the new array at the same index. If the element in the `mask` array is falsy,
 * `undefined` is placed in the new array at that index.
 *
 * @param mask - An array of truthy or falsy values that determines where to place elements from the `values` array.
 * @param values - An array of values to be placed into the new array based on the `mask` array.
 * @returns A new array where elements from the `values` array are placed according to the `mask` array,
 *          with `undefined` in positions where the `mask` array has falsy values.
 * @template T - The type of elements in the `values` array.
 */
export function place<T>(mask: any[], values: T[]): (T | undefined)[] {
  let arr = new Array<T | undefined>(mask.length);
  let valuesIdx = 0;

  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) {
      arr[i] = values[valuesIdx++];
    } else {
      arr[i] = undefined;
    }
  }

  return arr;
}
