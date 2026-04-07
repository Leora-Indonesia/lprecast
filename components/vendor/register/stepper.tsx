"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  subtitle: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-[600px] items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isFuture = index > currentStep

          return (
            <div key={index} className="flex flex-1 items-center">
              <div
                onClick={() => onStepClick?.(index)}
                className={cn(
                  "group flex flex-1 cursor-pointer flex-col items-center",
                  isFuture && "cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className={cn(
                    "step-icon flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
                    isCompleted && "bg-green-500 text-white shadow-green-200",
                    isActive &&
                      "bg-green-500 text-white ring-4 shadow-green-200 ring-green-200",
                    isFuture && "bg-gray-200 text-gray-400",
                    isFuture &&
                      "group-hover:bg-gray-200 group-hover:text-gray-600",
                    !isActive &&
                      !isFuture &&
                      "group-hover:bg-gray-200 group-hover:text-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <span className="text-xl font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <span
                    className={cn(
                      "text-xs font-bold tracking-wider",
                      isCompleted && "text-green-600",
                      isActive && "text-primary",
                      isFuture && "text-gray-400"
                    )}
                  >
                    Step {index + 1}
                  </span>
                  <p
                    className={cn(
                      "mt-1 text-sm font-bold",
                      isCompleted && "text-green-600",
                      isActive && "text-primary",
                      isFuture && "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.subtitle}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-8 w-0.5 transition-colors",
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
