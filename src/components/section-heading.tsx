import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        inverse ? "text-ivory" : "text-navy-950",
      )}
    >
      <Badge className={cn("mb-5", inverse ? "text-gold-light" : "text-gold-dark")}>{eyebrow}</Badge>
      <h2 className="font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-5 max-w-2xl text-base leading-7 sm:text-lg", inverse ? "text-slate-200" : "text-slate-600", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
