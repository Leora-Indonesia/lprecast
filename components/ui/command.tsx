"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

const CommandDialog = ({
  children,
  ...props
}: React.ComponentProps<typeof Command>) => {
  return (
    <Command
      {...props}
      className={cn(
        "[&_[cmdk-item]].cursor-pointer [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-1.5 [&_[cmdk-item]]:text-sm [&_[cmdk-item]]:outline-none",
        props.className
      )}
    >
      {children}
    </Command>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof Command.Input>,
  React.ComponentProps<typeof Command.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <Command.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = Command.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof Command.List>,
  React.ComponentProps<typeof Command.List>
>(({ className, ...props }, ref) => (
  <Command.List
    ref={ref}
    className={cn("max-h-[300px] overflow-x-hidden overflow-y-auto", className)}
    {...props}
  />
))
CommandList.displayName = Command.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof Command.Empty>,
  React.ComponentProps<typeof Command.Empty>
>((props, ref) => (
  <Command.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
))
CommandEmpty.displayName = Command.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof Command.Group>,
  React.ComponentProps<typeof Command.Group>
>(({ className, ...props }, ref) => (
  <Command.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = Command.Group.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentProps<typeof Command.Item>
>(({ className, ...props }, ref) => (
  <Command.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:bg-accent aria-selected:text-accent-foreground",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = Command.Item.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof Command.Separator>,
  React.ComponentProps<typeof Command.Separator>
>(({ className, ...props }, ref) => (
  <Command.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = Command.Separator.displayName

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}
