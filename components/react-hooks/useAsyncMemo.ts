import React from "react";

export interface AsyncMemoResult<T> {
  value: T;
  loading: boolean;
}

/**
 * Custom React hook that asynchronously computes a memoized value.
 *
 * @template T - The type of the memoized value.
 * @param {() => Promise<T>} memoFn - A function that returns a promise resolving to the memoized value.
 * @param {T} defaultValue - The default value to use while the memoized value is being computed.
 * @param {any[]} [deps=[]] - An optional array of dependencies that, when changed, will trigger the memoFn to be called again.
 * @returns {AsyncMemoResult<T>} An object containing the memoized value and a loading state.
 */
export const useAsyncMemo = <T>(
  memoFn: () => Promise<T>,
  defaultValue: T,
  deps: any[] = [],
): AsyncMemoResult<T> => {
  const [value, setValue] = React.useState<T>(defaultValue);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    memoFn()
      .then(setValue)
      .finally(() => setLoading(false));
  }, deps);

  return { value, loading };
};
