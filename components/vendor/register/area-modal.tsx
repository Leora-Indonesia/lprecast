"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DeliveryArea {
  id: number
  name: string
  province: string
}

interface ProvinceData {
  id: number
  name: string
  kabupaten: { id: number; name: string }[]
}

interface AreaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (areas: DeliveryArea[]) => void
  selectedAreas: DeliveryArea[]
}

const PROVINCES_DATA: ProvinceData[] = [
  {
    id: 1,
    name: "Jawa Barat",
    kabupaten: [
      { id: 101, name: "Kota Bandung" },
      { id: 102, name: "Kab. Bogor" },
      { id: 103, name: "Kota Bekasi" },
      { id: 104, name: "Kota Depok" },
      { id: 105, name: "Kab. Bandung" },
      { id: 106, name: "Kab. Garut" },
      { id: 107, name: "Kota Cirebon" },
      { id: 108, name: "Kab. Tasikmalaya" },
      { id: 109, name: "Kota Cimahi" },
    ],
  },
  {
    id: 2,
    name: "DKI Jakarta",
    kabupaten: [
      { id: 201, name: "Jakarta Selatan" },
      { id: 202, name: "Jakarta Pusat" },
      { id: 203, name: "Jakarta Utara" },
      { id: 204, name: "Jakarta Barat" },
      { id: 205, name: "Jakarta Timur" },
    ],
  },
  {
    id: 3,
    name: "Jawa Tengah",
    kabupaten: [
      { id: 301, name: "Kota Semarang" },
      { id: 302, name: "Kota Solo" },
      { id: 303, name: "Kota Yogyakarta" },
      { id: 304, name: "Kab. Magelang" },
      { id: 305, name: "Kab. Pekalongan" },
      { id: 306, name: "Kab. Kudus" },
      { id: 307, name: "Kab. Semarang" },
    ],
  },
  {
    id: 4,
    name: "Jawa Timur",
    kabupaten: [
      { id: 401, name: "Kota Surabaya" },
      { id: 402, name: "Kota Malang" },
      { id: 403, name: "Kab. Sidoarjo" },
      { id: 404, name: "Kota Kediri" },
      { id: 405, name: "Kota Blitar" },
      { id: 406, name: "Kab. Pasuruan" },
      { id: 407, name: "Kab. Probolinggo" },
    ],
  },
  {
    id: 5,
    name: "Banten",
    kabupaten: [
      { id: 501, name: "Kab. Tangerang" },
      { id: 502, name: "Kota Tangerang" },
      { id: 503, name: "Kab. Serang" },
      { id: 504, name: "Kota Cilegon" },
      { id: 505, name: "Kota Tangerang Selatan" },
    ],
  },
]

export function AreaModal({
  open,
  onOpenChange,
  onApply,
  selectedAreas,
}: AreaModalProps) {
  const [tempSelected, setTempSelected] =
    useState<DeliveryArea[]>(selectedAreas)
  const [search, setSearch] = useState("")

  const filteredProvinces = PROVINCES_DATA.map((prov) => {
    if (!search) return prov

    const matchedKab = prov.kabupaten.filter((k) =>
      k.name.toLowerCase().includes(search.toLowerCase())
    )

    if (prov.name.toLowerCase().includes(search.toLowerCase())) {
      return prov
    }

    if (matchedKab.length > 0) {
      return { ...prov, kabupaten: matchedKab }
    }

    return null
  }).filter(Boolean) as ProvinceData[]

  const toggleProvince = (province: ProvinceData) => {
    const allKabIds = province.kabupaten.map((k) => k.id)
    const allSelected = allKabIds.every((id) =>
      tempSelected.some((a) => a.id === id)
    )

    if (allSelected) {
      setTempSelected(tempSelected.filter((a) => !allKabIds.includes(a.id)))
    } else {
      const newAreas = province.kabupaten.map((kab) => ({
        id: kab.id,
        name: kab.name,
        province: province.name,
      }))
      setTempSelected([
        ...tempSelected,
        ...newAreas.filter(
          (newArea) => !tempSelected.some((a) => a.id === newArea.id)
        ),
      ])
    }
  }

  const toggleKabupaten = (
    kab: { id: number; name: string },
    provinceName: string
  ) => {
    const exists = tempSelected.find((a) => a.id === kab.id)
    if (exists) {
      setTempSelected(tempSelected.filter((a) => a.id !== kab.id))
    } else {
      setTempSelected([
        ...tempSelected,
        { id: kab.id, name: kab.name, province: provinceName },
      ])
    }
  }

  const isProvinceSelected = (province: ProvinceData) => {
    const allKabIds = province.kabupaten.map((k) => k.id)
    return (
      allKabIds.length > 0 &&
      allKabIds.every((id) => tempSelected.some((a) => a.id === id))
    )
  }

  const getProvinceSelectedCount = (province: ProvinceData) => {
    return province.kabupaten.filter((kab) =>
      tempSelected.some((a) => a.id === kab.id)
    ).length
  }

  const handleReset = () => {
    setTempSelected([])
  }

  const handleApply = () => {
    onApply(tempSelected)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader className="-m-6 mb-4 bg-indigo-600 p-4 text-white">
          <DialogTitle className="text-lg font-bold text-white">
            <i className="fa-solid fa-map-marker-alt mr-2" />
            Pilih Area Pengiriman
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari wilayah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {filteredProvinces.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                Data tidak ditemukan
              </p>
            ) : (
              filteredProvinces.map((prov) => {
                const isAllSelected = isProvinceSelected(prov)
                const selectedCount = getProvinceSelectedCount(prov)

                return (
                  <div
                    key={prov.id}
                    className="overflow-hidden rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center bg-gray-50 px-3 py-2">
                      <input
                        type="checkbox"
                        id={`prov-${prov.id}`}
                        checked={isAllSelected}
                        onChange={() => toggleProvince(prov)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                      <label
                        htmlFor={`prov-${prov.id}`}
                        className="ml-2 flex-1 cursor-pointer"
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          {prov.name}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          (Pilih Semua)
                        </span>
                      </label>
                      <span className="text-xs text-gray-500">
                        {selectedCount}/{prov.kabupaten.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 bg-white px-4 py-2">
                      {prov.kabupaten.map((kab) => (
                        <label
                          key={kab.id}
                          className="flex cursor-pointer items-center rounded px-2 py-1 transition-colors hover:bg-indigo-50"
                        >
                          <input
                            type="checkbox"
                            checked={tempSelected.some((a) => a.id === kab.id)}
                            onChange={() => toggleKabupaten(kab, prov.name)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {kab.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 border-t pt-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-gray-500">
              {tempSelected.length} dipilih
            </span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleApply}>Terapkan</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
