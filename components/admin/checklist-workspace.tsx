"use client"

import { useState } from "react"
import { VendorApprovalChecklistPreview } from "@/components/admin/vendor-approval-checklist"

interface ChecklistWorkspaceProps {
  userId: string
}

export function ChecklistWorkspace({ userId }: ChecklistWorkspaceProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }))
  }

  return (
    <VendorApprovalChecklistPreview
      checkedItems={checkedItems}
      onCheck={handleCheck}
    />
  )
}
