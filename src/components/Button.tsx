import type React from "react";

export default function Button({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded border border-border px-3 py-1 hover:bg-hover disabled:opacity-50 disabled:hover:bg-transparent ${className ?? ""}`}
    />
  );
}
