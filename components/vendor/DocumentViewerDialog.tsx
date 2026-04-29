"use client"

import { ExternalLink, Eye } from "lucide-react"
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
  file_name: string | null
  file_path: string
  document_number: string | null
  verification_status: string | null
  verified_at: string | null
  uploaded_at: string | null
  file_size?: number
  mime_type?: string
}

interface DocumentViewerDialogProps {
  document: VendorLegalDocument
  trigger?: React.ReactNode
}

export function DocumentViewerDialog({
  document,
  trigger,
}: DocumentViewerDialogProps) {
  const fileName = document.file_name || document.document_type
  const fileUrl = document.file_path
  const fileType = document.mime_type?.toLowerCase() || ""
  const lowerFileUrl = fileUrl.toLowerCase()
  const lowerFileName = fileName.toLowerCase()
  const isPdf = fileType.includes("pdf") || lowerFileUrl.endsWith(".pdf") || lowerFileName.endsWith(".pdf")
  const isImage = fileType.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(lowerFileUrl) || /\.(png|jpe?g|webp|gif|svg)$/i.test(lowerFileName)

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
            {fileName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-md border bg-muted">
          {isPdf ? (
            <iframe
              src={fileUrl}
              className="h-[70vh] w-full"
              title={fileName}
            />
          ) : isImage ? (
            <div className="relative h-[70vh] w-full">
              <Image
                src={fileUrl}
                alt={fileName}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Format dokumen tidak bisa dipreview langsung.
              </p>
              <Button asChild>
                <a href={fileUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Buka dokumen
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
