"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { adminChecklist, surveyChecklist } from "@/lib/vendor-approval"


interface VendorApprovalChecklistProps {
  checkedItems: Record<string, boolean>
  onCheck: (id: string, checked: boolean) => void
}

export function VendorApprovalChecklistPreview({ checkedItems, onCheck }: VendorApprovalChecklistProps) {
  return (
    <div className="w-full min-w-0 max-w-full">
      <Tabs defaultValue="admin">
        <TabsList className="grid w-full max-w-full grid-cols-2">
          <TabsTrigger value="admin">A. Berkas / Administratif</TabsTrigger>
          <TabsTrigger value="survey">B. Survey Workshop</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-6 w-full max-w-full space-y-4">
          {adminChecklist.map((section) => (
            <section
              key={section.id}
              className="box-border w-full min-w-0 max-w-full space-y-3 overflow-hidden rounded-lg border bg-background p-4"
            >
              <div>
                <h3 className="text-base font-semibold">{section.title}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-start space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={(c) => onCheck(item.id, c as boolean)}
                    />
                    <Label
                      htmlFor={item.id}
                      className="min-w-0 cursor-pointer break-words text-sm font-normal leading-snug"
                    >
                      {item.label}
                      {item.isCritical && (
                        <Badge
                          variant="outline"
                          className="ml-2 border-red-200 bg-red-50 text-[10px] text-red-500"
                        >
                          Wajib
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>

        <TabsContent value="survey" className="mt-6 w-full max-w-full space-y-4">
          {surveyChecklist.map((section) => (
            <section
              key={section.id}
              className="box-border w-full min-w-0 max-w-full space-y-3 overflow-hidden rounded-lg border bg-background p-4"
            >
              <div>
                <h3 className="text-base font-semibold">{section.title}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-start space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={(c) => onCheck(item.id, c as boolean)}
                    />
                    <Label
                      htmlFor={item.id}
                      className="min-w-0 cursor-pointer break-words text-sm font-normal leading-snug"
                    >
                      {item.label}
                      {item.isCritical && (
                        <Badge
                          variant="outline"
                          className="ml-2 border-red-200 bg-red-50 text-[10px] text-red-500"
                        >
                          Kritikal
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
