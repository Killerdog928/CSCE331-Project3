"use client";

import { useEffect } from "react";

/**
 * Error component to display an error message and provide a way to reset the error state.
 *
 * @param {Object} props - The props object.
 * @param {Error} props.error - The error object to be displayed.
 * @param {Function} props.reset - The function to reset the error state.
 *
 * @returns {JSX.Element} The rendered error component.
 *
 * @example
 * <Error error={new Error('Something went wrong')} reset={() => {}} />
 */
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
