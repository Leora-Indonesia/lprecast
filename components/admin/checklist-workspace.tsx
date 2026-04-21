"use client"

import { VendorApprovalChecklistPreview } from "@/components/admin/vendor-approval-checklist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useVendorApprovalReview } from "@/components/admin/vendor-approval-review-context"

  const redFlagChecklist = [
    { id: "no_workshop", label: "Tidak punya workshop jelas" },
    { id: "fake_portfolio", label: "Portofolio palsu" },
    { id: "poor_quality", label: "Kualitas produk buruk" },
    { id: "refuse_system", label: "Tidak mau ikut sistem" },
    { id: "bypass_client", label: "Indikasi ingin bypass client" },
  ]

export function ChecklistWorkspace() {
  const {
    checkedItems,
    redFlagFindings,
    setRedFlag,
    setCheckedItem,
    hasRedFlag,
  } = useVendorApprovalReview()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <Card className="shrink-0 overflow-hidden border-destructive/25 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Red Flag (Auto Reject)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Jika salah satu red flag terdeteksi, hasil wajib <strong>REJECT</strong>
            .
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {redFlagChecklist.map((item) => (
              <div key={item.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`redflag-${item.id}`}
                  checked={redFlagFindings[item.id] || false}
                  onCheckedChange={(c) =>
                    setRedFlag(item.id, c as boolean)
                  }
                />
                <Label
                  htmlFor={`redflag-${item.id}`}
                  className="cursor-pointer text-sm font-normal leading-snug"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          {hasRedFlag && (
            <p className="text-xs text-destructive">
              Red flag terdeteksi. Keputusan selain <strong>Reject</strong> akan
              dinonaktifkan.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="min-h-0 flex flex-1 flex-col overflow-hidden">
        <CardContent className="min-h-0 flex-1 p-0">
          <VendorApprovalChecklistPreview
            checkedItems={checkedItems}
            onCheck={(id, checked) => setCheckedItem(id, checked)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
