"use client"

import { Eye } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VendorLegalDocument {
  id: string
  document_type: string
  file_name: string
  file_path: string
  document_number: string | null
  verification_status: string | null
  verified_at: string | null
  uploaded_at: string | null
}

interface DocumentViewerDialogProps {
  document: VendorLegalDocument
  trigger?: React.ReactNode
}

export function DocumentViewerDialog({
  document,
  trigger,
}: DocumentViewerDialogProps) {
  const isPdf = document.file_path.toLowerCase().endsWith(".pdf")

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Eye className="mr-1 h-4 w-4" />
            Lihat
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">
            {document.file_name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-md border bg-muted">
          {isPdf ? (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                document.file_path
              )}&embedded=true`}
              className="h-[70vh] w-full"
              title={document.file_name}
            />
          ) : (
            <div className="relative h-[70vh] w-full">
              <Image
                src={document.file_path}
                alt={document.file_name}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
