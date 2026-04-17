"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider
      value={{
        name: props.name,
        formItemId: `${props.name}-form-item`,
        formDescriptionId: `${props.name}-form-item-description`,
        formMessageId: `${props.name}-form-item-message`,
      }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

interface UseFormFieldReturn {
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const useFormField = (): UseFormFieldReturn => {
  const fieldContext = React.useContext(FormFieldContext)

  if (!fieldContext) {
    throw new Error("useFormField should be used within FormField")
  }

  return fieldContext
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <div
      ref={ref}
      id={formItemId}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={`${formDescriptionId} ${formMessageId}`}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formMessageId, name } = useFormField()

  // Try to get form context errors, fallback if not wrapped in FormProvider
  let error: { message?: string } | undefined
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { formState } = useFormContext()
    error = formState.errors[name] as { message?: string } | undefined
  } catch {
    // FormProvider not available, will use children prop
  }

  const body = children || (error?.message ? String(error.message) : null)

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => {
  return <form ref={ref} className={cn("space-y-6", className)} {...props} />
})
Form.displayName = "Form"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormProvider,
}
