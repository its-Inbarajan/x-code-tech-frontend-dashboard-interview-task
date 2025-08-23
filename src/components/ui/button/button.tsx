import { cn } from "@/lib/utils";
import React from "react";

export const Button = ({
  children,
  className,
  type,
  ...prop
}: React.ComponentProps<"button">) => {
  return (
    <button
      type={type}
      className={cn("w-full block py-2 px-4 rounded-md text-sm", className)}
      {...prop}
    >
      {children}
    </button>
  );
};
