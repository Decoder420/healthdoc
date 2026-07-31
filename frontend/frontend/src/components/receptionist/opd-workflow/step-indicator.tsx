import type { OpdWorkflowStep } from "@/features/opd/types";
import { WORKFLOW_STEPS } from "@/features/opd/types";
import { cn } from "@/lib/utils/cn";

type StepIndicatorProps = {
  currentStep: OpdWorkflowStep;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = WORKFLOW_STEPS.findIndex((step) => step.id === currentStep);

  return (
    <ol className="flex flex-wrap gap-2">
      {WORKFLOW_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
              isCurrent && "border-primary bg-primary text-primary-foreground",
              isComplete && "border-success bg-success-muted text-success",
              !isCurrent && !isComplete && "border-border bg-card text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                isCurrent && "bg-primary-foreground text-primary",
                isComplete && "bg-success text-white",
                !isCurrent && !isComplete && "bg-muted text-muted-foreground",
              )}
            >
              {index + 1}
            </span>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
