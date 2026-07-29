import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/15 bg-current/8 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em]",
        className,
      )}
      {...props}
    />
  );
}
