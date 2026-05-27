import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORT_STATUSES, getReportStatusIndex } from "@/lib/reports";

const statusDotClasses = (state: "complete" | "current" | "upcoming") => {
  switch (state) {
    case "complete":
      return "bg-success text-success-foreground border-success";
    case "current":
      return "bg-primary text-primary-foreground border-primary";
    case "upcoming":
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const statusTextClasses = (state: "complete" | "current" | "upcoming") => {
  switch (state) {
    case "complete":
      return "text-foreground";
    case "current":
      return "text-foreground";
    case "upcoming":
    default:
      return "text-muted-foreground";
  }
};

export function ReportStatusTimeline({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const currentIndex = Math.max(0, getReportStatusIndex(status));

  return (
    <ol className={cn("relative space-y-4 border-l border-border pl-5", className)}>
      {REPORT_STATUSES.map((step, index) => {
        const state: "complete" | "current" | "upcoming" =
          index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming";

        return (
          <li key={step} className="relative">
            <span
              className={cn(
                "absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full border",
                statusDotClasses(state)
              )}
              aria-hidden
            >
              {state === "complete" ? <Check className="h-3 w-3" /> : <span className="text-[10px] font-semibold">{index + 1}</span>}
            </span>

            <div className={cn("flex flex-col gap-0.5", statusTextClasses(state))}>
              <div className="text-sm font-medium leading-none">{step}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
