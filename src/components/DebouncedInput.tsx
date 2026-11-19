"use client";

import { useEffect, useState } from "react";

type DebouncedInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value: string;
  onCommit: (value: string) => void;
  delay?: number;
};

export default function DebouncedInput({
  value,
  onCommit,
  delay = 300,
  ...props
}: DebouncedInputProps) {
  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }
  useEffect(() => {
    if (text === value) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onCommit(text);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, value, delay, onCommit]);

  return (
    <input
      {...props}
      value={text}
      onChange={(event) => setText(event.target.value)}
    />
  );
}
