"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteVendorButtonProps {
  userId: string
  companyName: string
  deleteAction: (userId: string) => Promise<{ success: boolean; error?: string }>
}

export function DeleteVendorButton({ userId, companyName, deleteAction }: DeleteVendorButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAction(userId)
      if (result.success) {
        router.push("/admin/vendors")
      } else {
        setError(result.error || "Terjadi kesalahan")
        setIsOpen(false)
      }
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Vendor</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus vendor{" "}
            <span className="font-semibold">{companyName}</span>?
            <br />
            <span className="text-destructive">Tindakan ini tidak dapat dibatalkan.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}