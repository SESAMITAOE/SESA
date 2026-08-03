import { Info } from "lucide-react";

export function ContentNotice({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="mb-7 flex items-start gap-3 rounded-2xl border border-gold/25 bg-[#fffaf1] px-5 py-4 text-sm leading-6 text-navy-950"
      role="status"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-gold-dark" />
      <p>{message}</p>
    </div>
  );
}
