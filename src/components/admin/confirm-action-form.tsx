"use client";

import type { ReactNode } from "react";

export function ConfirmActionForm({
  action,
  confirmation,
  children,
  className,
}: {
  action: () => void | Promise<void>;
  confirmation: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        if (!window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}
