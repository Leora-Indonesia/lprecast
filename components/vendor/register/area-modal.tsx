"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/types/database.types"

type Province = Database["public"]["Tables"]["master_provinces"]["Row"]
type City = Database["public"]["Tables"]["master_cities"]["Row"]

interface DeliveryArea {
  city_id: string
  city_name: string
  province_id: string
  province_name: string
}

interface ProvinceWithCities extends Province {
  cities: City[]
}

interface AreaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (areas: DeliveryArea[]) => void
  selectedAreas: DeliveryArea[]
}

export function AreaModal({
  open,
  onOpenChange,
  onApply,
  selectedAreas,
}: AreaModalProps) {
  const [provinces, setProvinces] = useState<ProvinceWithCities[]>([])
  const [tempSelected, setTempSelected] = useState<DeliveryArea[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTempSelected(selectedAreas)
      fetchProvinces()
    }
  }, [open, selectedAreas])

  const fetchProvinces = async () => {
    setIsLoading(true)
    try {
      const { data: provincesData, error: provincesError } = await supabase
        .from("master_provinces")
        .select("*, cities:master_cities(*)")
        .order("name")

      if (provincesError) throw provincesError

      const provincesWithCities = (provincesData || []).map(
        (prov: Province & { cities?: City[] }) => ({
          ...prov,
          cities: (prov.cities || []).sort((a: City, b: City) =>
            a.name.localeCompare(b.name)
          ),
        })
      )

      setProvinces(provincesWithCities)
    } catch (error) {
      console.error("Error fetching provinces:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProvinces = provinces
    .map((prov) => {
      if (!search) return prov

      const matchedCities = prov.cities.filter((city) =>
        city.name.toLowerCase().includes(search.toLowerCase())
      )

      if (prov.name.toLowerCase().includes(search.toLowerCase())) {
        return prov
      }

      if (matchedCities.length > 0) {
        return { ...prov, cities: matchedCities }
      }

      return null
    })
    .filter(Boolean) as ProvinceWithCities[]

  const toggleProvince = (province: ProvinceWithCities) => {
    const allCityIds = province.cities.map((c) => c.id)
    const allSelected = allCityIds.every((id) =>
      tempSelected.some((a) => a.city_id === id)
    )

    if (allSelected) {
      setTempSelected(
        tempSelected.filter((a) => !allCityIds.includes(a.city_id))
      )
    } else {
      const newAreas = province.cities.map((city) => ({
        city_id: city.id,
        city_name: city.name,
        province_id: province.id,
        province_name: province.name,
      }))
      setTempSelected([
        ...tempSelected,
        ...newAreas.filter(
          (newArea) => !tempSelected.some((a) => a.city_id === newArea.city_id)
        ),
      ])
    }
    setError(null)
  }

  const toggleCity = (city: City, provinceName: string) => {
    const exists = tempSelected.find((a) => a.city_id === city.id)
    if (exists) {
      setTempSelected(tempSelected.filter((a) => a.city_id !== city.id))
    } else {
      setTempSelected([
        ...tempSelected,
        {
          city_id: city.id,
          city_name: city.name,
          province_id: city.province_id,
          province_name: provinceName,
        },
      ])
    }
    setError(null)
  }

  const isProvinceSelected = (province: ProvinceWithCities) => {
    const allCityIds = province.cities.map((c) => c.id)
    return (
      allCityIds.length > 0 &&
      allCityIds.every((id) => tempSelected.some((a) => a.city_id === id))
    )
  }

  const getProvinceSelectedCount = (province: ProvinceWithCities) => {
    return province.cities.filter((city) =>
      tempSelected.some((a) => a.city_id === city.id)
    ).length
  }

  const handleReset = () => {
    setTempSelected([])
    setError(null)
  }

  const handleApply = () => {
    if (tempSelected.length === 0) {
      setError("Pilih minimal 1 area pengiriman")
      toast.error("Pilih minimal 1 area pengiriman")
      return
    }
    onApply(tempSelected)
    onOpenChange(false)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden border-0">
        <DialogHeader className="-m-6 mb-4 bg-primary px-6 py-4 text-primary-foreground">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-primary-foreground">
            <MapPin className="h-5 w-5" />
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

        <div
          className="overflow-y-auto pr-4"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
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
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <div className="flex items-center bg-muted px-3 py-2">
                        <input
                          type="checkbox"
                          id={`prov-${prov.id}`}
                          checked={isAllSelected}
                          onChange={() => toggleProvince(prov)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
                          {selectedCount}/{prov.cities.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 bg-white px-4 py-2">
                        {prov.cities.map((city) => (
                          <label
                            key={city.id}
                            className="flex cursor-pointer items-center rounded px-2 py-1 transition-colors hover:bg-primary/10"
                          >
                            <input
                              type="checkbox"
                              checked={tempSelected.some(
                                (a) => a.city_id === city.id
                              )}
                              onChange={() => toggleCity(city, prov.name)}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              {city.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

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
