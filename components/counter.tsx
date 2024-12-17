"use client";

import { Button } from "@nextui-org/button";
import { useState } from "react";

/**
 * Counter component that displays a button with the current count.
 * When the button is pressed, the count is incremented by 1.
 *
 * @component
 * @example
 * return (
 *   <Counter />
 * )
 */
export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Button radius="full" onPress={() => setCount(count + 1)}>
      Count is {count}
    </Button>
  );
};
