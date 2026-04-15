"use client"

import { useState, useEffect, useRef } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import {
  Plus,
  Trash2,
  X,
  Package,
  Pencil,
  Info,
  MapPin,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ProductModal } from "./product-modal"
import { AreaModal } from "./area-modal"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import type {
  VendorRegistrationFormData,
  ProductFormData,
} from "@/lib/validations/vendor-registration"
import type { Database } from "@/types/database.types"

type Province = Database["public"]["Tables"]["master_provinces"]["Row"]
type City = Database["public"]["Tables"]["master_cities"]["Row"]

const POPULAR_BANKS = [
  "Bank Central Asia (BCA)",
  "Bank Mandiri",
  "Bank Rakyat Indonesia (BRI)",
  "Bank Negara Indonesia (BNI)",
  "Bank Tabungan Negara (BTN)",
  "Bank CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Bank Sinarmas",
  "Bank Bukopin",
  "Bank Muamalat Indonesia",
  "Bank Maybank Indonesia",
  "Bank OCBC NISP",
  "Bank Panin",
  "Bank BTPN",
]

const OTHER_BANKS = [
  "Bank Indonesia",
  "Bank Artha Graha Internasional",
  "Bank Mayapada",
  "Bank Jago",
  "Bank Allo Indonesia",
  "Bank Victoria International",
  "Bank Maspion Indonesia",
  "Bank Nationalnobu",
  "Bank CTBC Indonesia",
  "Bank IBK Indonesia",
  "Bank INA Perdana",
  "Bank JTrust Indonesia",
  "Bank Krom Indonesia",
  "Bank Multiarta Sentosa",
  "Bank Seabank Indonesia",
  "Bank Digital BCA",
  "LINE Bank Indonesia",
  "Bank UOB Indonesia",
  "Bank HSBC Indonesia",
  "Bank Shinhan Indonesia",
  "Bank MUFG Indonesia",
  "Bank Mizuho Indonesia",
  "Bank Sumitomo Mitsui Indonesia",
  "Bank Deutsche",
  "Bank Standard Chartered Indonesia",
  "Bank of China Indonesia",
  "Bank of America",
  "JP Morgan Chase Bank",
  "Bank Syariah Indonesia (BSI)",
  "Bank Aceh Syariah",
  "Bank Aladin Syariah",
  "Bank Mega Syariah",
  "Bank BCA Syariah",
  "Bank BTPN Syariah",
  "Bank Panin Dubai Syariah",
  "Bank Victoria Syariah",
  "Bank Nano Syariah",
  "Bank Jabar Banten Syariah (BJB Syariah)",
  "Bank DKI",
  "Bank BJB",
  "Bank Jateng",
  "Bank Jatim",
  "Bank BPD DIY",
  "Bank BPD Bali",
  "Bank Bengkulu",
  "Bank Jambi",
  "Bank Lampung",
  "Bank Riau Kepri",
  "Bank Sumsel Babel",
  "Bank Sumut",
  "Bank Kalimantan Barat",
  "Bank Kalimantan Selatan",
  "Bank Kalimantan Tengah",
  "Bank Kalimantan Timur",
  "Bank Maluku",
  "Bank Maluku Utara",
  "Bank Nusa Tenggara Barat",
  "Bank Nusa Tenggara Timur",
  "Bank Papua",
  "Bank Sulawesi Selatan",
  "Bank Sulawesi Tengah",
  "Bank Sulawesi Tenggara",
  "Bank Sulawesi Utara",
  "Bank Sulteng",
  "Bank Sultra",
  "Bank Banten",
]

const ALL_BANKS = [...POPULAR_BANKS, ...OTHER_BANKS].map((bank) => ({
  label: bank,
  value: bank,
}))

export interface OperationalFormProps {
  form: UseFormReturn<VendorRegistrationFormData>
  onForceSave?: () => void
}

interface DeliveryArea {
  city_id: string
  city_name: string
  province_id: string
  province_name: string
}

export function OperationalForm({ form, onForceSave }: OperationalFormProps) {
  const {
    register,
    watch,
    formState: { errors },
    control,
    setValue,
  } = form

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
    update: updateProduct,
  } = useFieldArray({
    name: "operational.products",
    control,
  })

  const {
    fields: areaFields,
    append: appendArea,
    remove: removeArea,
  } = useFieldArray({
    name: "operational.delivery_areas",
    control,
  })

  const {
    fields: costFields,
    append: appendCost,
    remove: removeCost,
  } = useFieldArray({
    name: "operational.additional_costs",
    control,
  })

  const [showMap, setShowMap] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
    null
  )
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [bankPopoverOpen, setBankPopoverOpen] = useState(false)
  const [provincePopoverOpen, setProvincePopoverOpen] = useState(false)
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)

  const selectedProvinsiId = watch("operational.factory_address.provinsi_id")
  const selectedKabupatenId = watch("operational.factory_address.kabupaten_id")
  const alamatDetail = watch("operational.factory_address.alamat_detail")
  const kodePos = watch("operational.factory_address.kode_pos")

  const selectedProvince = provinces.find((p) => p.id === selectedProvinsiId)
  const selectedCity = cities.find((c) => c.id === selectedKabupatenId)

  const prevProvinsiIdRef = useRef<string | null>(null)

  useEffect(() => {
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (!selectedProvinsiId) return

    if (
      prevProvinsiIdRef.current &&
      prevProvinsiIdRef.current !== selectedProvinsiId
    ) {
      setValue("operational.factory_address.kabupaten_id", "", {
        shouldValidate: true,
      })
      setValue("operational.factory_address.kabupaten_name", "", {
        shouldValidate: true,
      })
    }

    prevProvinsiIdRef.current = selectedProvinsiId
    fetchCities(selectedProvinsiId)
  }, [selectedProvinsiId, setValue])

  const fetchProvinces = async () => {
    setIsLoadingLocations(true)
    try {
      const { data, error } = await supabase
        .from("master_provinces")
        .select("*")
        .order("name")

      if (error) throw error
      setProvinces(data || [])
    } catch (error) {
      console.error("Error fetching provinces:", error)
    } finally {
      setIsLoadingLocations(false)
    }
  }

  const fetchCities = async (provinceId: string) => {
    setIsLoadingLocations(true)
    try {
      const { data, error } = await supabase
        .from("master_cities")
        .select("*")
        .eq("province_id", provinceId)
        .order("name")

      if (error) {
        console.error("Error fetching cities:", error)
        setCities([])
        return
      }
      setCities(data || [])
    } catch (error) {
      console.error("Error fetching cities:", error)
      setCities([])
    } finally {
      setIsLoadingLocations(false)
    }
  }

  const handleSelectCity = (cityId: string) => {
    setValue("operational.factory_address.kabupaten_id", cityId, {
      shouldValidate: true,
    })
    const selectedCityData = cities.find((c) => c.id === cityId)
    if (selectedCityData) {
      setValue(
        "operational.factory_address.kabupaten_name",
        selectedCityData.name,
        {
          shouldValidate: true,
        }
      )
    }
  }

  const buildFullAddress = () => {
    const parts = [
      alamatDetail,
      selectedCity?.name,
      selectedProvince?.name,
      kodePos,
    ].filter(Boolean)
    return parts.join(", ")
  }

  const handleAddProduct = () => {
    setEditingProductIndex(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (index: number) => {
    setEditingProductIndex(index)
    setShowProductModal(true)
  }

  const handleSaveProduct = (product: ProductFormData) => {
    if (editingProductIndex !== null) {
      updateProduct(editingProductIndex, product)
    } else {
      appendProduct(product)
    }
    setEditingProductIndex(null)
    setShowProductModal(false)
    setTimeout(() => {
      onForceSave?.()
    }, 50)
  }

  const handleDeleteProduct = (index: number) => {
    removeProduct(index)
    setTimeout(() => {
      onForceSave?.()
    }, 50)
  }

  const handleApplyAreas = (areas: DeliveryArea[]) => {
    areas.forEach((area) => {
      appendArea(area)
    })
    setTimeout(() => {
      onForceSave?.()
    }, 50)
  }

  const handleRemoveArea = (index: number) => {
    removeArea(index)
    setTimeout(() => {
      onForceSave?.()
    }, 50)
  }

  const handleAddCostRow = () => {
    appendCost({ description: "", amount: 0, unit: "unit" })
    setTimeout(() => {
      onForceSave?.()
    }, 50)
  }

  const handleRemoveCost = (index: number) => {
    removeCost(index)
    setTimeout(() => {
      onForceSave?.()
    }, 50)
  }

  const getEditingProduct = (): ProductFormData | undefined => {
    if (editingProductIndex !== null && productFields[editingProductIndex]) {
      return productFields[editingProductIndex] as unknown as ProductFormData
    }
    return undefined
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Informasi Operasional & Produk
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-b border-gray-100 pb-8 md:grid-cols-2">
        <div>
          <Label htmlFor="bank_nama" className="form-label">
            Nama Bank<span className="required-star">*</span>
          </Label>
          <Popover open={bankPopoverOpen} onOpenChange={setBankPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "form-input w-full justify-between font-normal",
                  !form.getValues("operational.bank.bank_nama") &&
                    "text-muted-foreground",
                  errors.operational?.bank?.bank_nama && "border-destructive"
                )}
              >
                {form.getValues("operational.bank.bank_nama")
                  ? ALL_BANKS.find(
                      (bank) =>
                        bank.value ===
                        form.getValues("operational.bank.bank_nama")
                    )?.label
                  : "Cari bank..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandInput placeholder="Cari bank..." autoFocus={false} />
                <CommandList>
                  <CommandEmpty>Tidak ada bank yang ditemukan.</CommandEmpty>
                  <CommandGroup heading="Bank Populer">
                    {POPULAR_BANKS.map((bank) => (
                      <CommandItem
                        key={bank}
                        value={bank}
                        onSelect={() => {
                          form.setValue("operational.bank.bank_nama", bank, {
                            shouldValidate: true,
                          })
                          setBankPopoverOpen(false)
                        }}
                        onClick={() => {
                          form.setValue("operational.bank.bank_nama", bank, {
                            shouldValidate: true,
                          })
                          setBankPopoverOpen(false)
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.getValues("operational.bank.bank_nama") ===
                              bank
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {bank}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Bank Lainnya">
                    {OTHER_BANKS.map((bank) => (
                      <CommandItem
                        key={bank}
                        value={bank}
                        onSelect={() => {
                          form.setValue("operational.bank.bank_nama", bank, {
                            shouldValidate: true,
                          })
                          setBankPopoverOpen(false)
                        }}
                        onClick={() => {
                          form.setValue("operational.bank.bank_nama", bank, {
                            shouldValidate: true,
                          })
                          setBankPopoverOpen(false)
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.getValues("operational.bank.bank_nama") ===
                              bank
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {bank}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.operational?.bank?.bank_nama && (
            <p className="mt-1 text-xs text-destructive">
              {errors.operational.bank.bank_nama.message as string}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="bank_nomor" className="form-label">
            Nomor Rekening<span className="required-star">*</span>
          </Label>
          <Input
            id="bank_nomor"
            placeholder="10-16 digit angka"
            {...register("operational.bank.bank_nomor")}
            className={cn(
              "form-input",
              errors.operational?.bank?.bank_nomor && "border-destructive"
            )}
          />
          {errors.operational?.bank?.bank_nomor && (
            <p className="mt-1 text-xs text-destructive">
              {errors.operational.bank.bank_nomor.message as string}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Masukkan nomor rekening 10-16 digit tanpa spasi atau tanda baca
          </p>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="bank_atas_nama" className="form-label">
            Nama Pemilik Rekening (Sesuai Buku Bank)
            <span className="required-star">*</span>
          </Label>
          <Input
            id="bank_atas_nama"
            placeholder="PT. Maju Jaya"
            {...register("operational.bank.bank_atas_nama")}
            className={cn(
              "form-input",
              errors.operational?.bank?.bank_atas_nama && "border-destructive"
            )}
          />
          {errors.operational?.bank?.bank_atas_nama && (
            <p className="mt-1 text-xs text-destructive">
              {errors.operational.bank.bank_atas_nama.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6">
        <Label className="form-label mb-4 block">
          Alamat Pabrik / Workshop Utama<span className="required-star">*</span>
        </Label>

        <div className="space-y-4">
          <div>
            <Label htmlFor="alamat_detail" className="text-sm text-gray-600">
              Alamat Detail<span className="required-star">*</span>
            </Label>
            <Textarea
              id="alamat_detail"
              placeholder="Jl. Industri No. 123, Kawasan Industri Jababeka, Cikarang"
              className={cn(
                "form-input mt-1 h-20 resize-none",
                errors.operational?.factory_address?.alamat_detail &&
                  "border-destructive"
              )}
              {...register("operational.factory_address.alamat_detail")}
            />
            {errors.operational?.factory_address?.alamat_detail && (
              <p className="mt-1 text-xs text-destructive">
                {
                  errors.operational.factory_address.alamat_detail
                    .message as string
                }
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Contoh: Jl. Industri No. 123, Kawasan Industri Jababeka, Cikarang
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm text-gray-600">
                Provinsi<span className="required-star">*</span>
              </Label>
              <Popover
                open={provincePopoverOpen}
                onOpenChange={setProvincePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "form-input w-full justify-between font-normal",
                      !selectedProvince && "text-muted-foreground",
                      errors.operational?.factory_address?.provinsi_id &&
                        "border-destructive"
                    )}
                    disabled={isLoadingLocations}
                  >
                    {selectedProvince
                      ? selectedProvince.name
                      : "Cari Provinsi..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandInput
                      placeholder="Cari Provinsi..."
                      autoFocus={false}
                    />
                    <CommandList>
                      <CommandEmpty>Provinsi tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {provinces.map((prov) => (
                          <CommandItem
                            key={prov.id}
                            value={prov.name}
                            onSelect={() => {
                              setValue(
                                "operational.factory_address.provinsi_id",
                                prov.id,
                                { shouldValidate: true }
                              )
                              setValue(
                                "operational.factory_address.provinsi_name",
                                prov.name,
                                { shouldValidate: true }
                              )
                              setProvincePopoverOpen(false)
                            }}
                            onClick={() => {
                              setValue(
                                "operational.factory_address.provinsi_id",
                                prov.id,
                                { shouldValidate: true }
                              )
                              setValue(
                                "operational.factory_address.provinsi_name",
                                prov.name,
                                { shouldValidate: true }
                              )
                              setProvincePopoverOpen(false)
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProvinsiId === prov.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {prov.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {isLoadingLocations && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Memuat daftar provinsi...
                </p>
              )}
              {errors.operational?.factory_address?.provinsi_id && (
                <p className="mt-1 text-xs text-destructive">
                  {
                    errors.operational.factory_address.provinsi_id
                      .message as string
                  }
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm text-gray-600">
                Kabupaten/Kota<span className="required-star">*</span>
              </Label>
              <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "form-input w-full justify-between font-normal",
                      !selectedCity && "text-muted-foreground",
                      errors.operational?.factory_address?.kabupaten_id &&
                        "border-destructive"
                    )}
                    disabled={!selectedProvinsiId}
                  >
                    {selectedCity
                      ? selectedCity.name
                      : !selectedProvinsiId
                        ? "Pilih Provinsi dulu"
                        : "Cari Kabupaten/Kota..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandInput
                      placeholder="Cari Kabupaten/Kota..."
                      autoFocus={false}
                    />
                    <CommandList>
                      <CommandEmpty>
                        Kabupaten/Kota tidak ditemukan.
                      </CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={city.name}
                            onSelect={() => {
                              handleSelectCity(city.id)
                              setCityPopoverOpen(false)
                            }}
                            onClick={() => {
                              handleSelectCity(city.id)
                              setCityPopoverOpen(false)
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedKabupatenId === city.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {city.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.operational?.factory_address?.kabupaten_id && (
                <p className="mt-1 text-xs text-destructive">
                  {
                    errors.operational.factory_address.kabupaten_id
                      .message as string
                  }
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="kecamatan" className="text-sm text-gray-600">
                Kecamatan<span className="required-star">*</span>
              </Label>
              <Input
                id="kecamatan"
                placeholder="Cikarang Selatan"
                className={cn(
                  "form-input mt-1",
                  errors.operational?.factory_address?.kecamatan &&
                    "border-destructive"
                )}
                {...register("operational.factory_address.kecamatan")}
              />
              {errors.operational?.factory_address?.kecamatan && (
                <p className="mt-1 text-xs text-destructive">
                  {
                    errors.operational.factory_address.kecamatan
                      .message as string
                  }
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="kode_pos" className="text-sm text-gray-600">
                Kode Pos<span className="required-star">*</span>
              </Label>
              <Input
                id="kode_pos"
                placeholder="17530"
                maxLength={5}
                className={cn(
                  "form-input mt-1",
                  errors.operational?.factory_address?.kode_pos &&
                    "border-destructive"
                )}
                {...register("operational.factory_address.kode_pos")}
              />
              {errors.operational?.factory_address?.kode_pos && (
                <p className="mt-1 text-xs text-destructive">
                  {
                    errors.operational.factory_address.kode_pos
                      .message as string
                  }
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin className="mr-2 h-4 w-4" />
              {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
            </Button>
          </div>
          {showMap && (
            <div className="mt-3 h-80 w-full overflow-hidden rounded-lg border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                  buildFullAddress() || alamatDetail || ""
                )}&zoom=15`}
              />
            </div>
          )}
        </div>
      </div>

      <div id="products-section" className="border-t border-gray-100 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Harga Produk
            </h3>
            <p className="text-sm text-gray-500">Kelola produk dan harga</p>
          </div>
          <Button type="button" size="sm" onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-600">
              <tr>
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-4 py-3 text-left">Nama Item</th>
                <th className="px-4 py-3 text-center">Satuan</th>
                <th className="px-4 py-3 text-right">Harga (Rp)</th>
                <th className="px-4 py-3 text-center">Lead Time</th>
                <th className="px-4 py-3 text-center">MOQ</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {productFields.length === 0 ? (
                <tr className="border-b border-gray-100">
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="h-10 w-10 text-gray-300" />
                      <p className="mt-2 text-gray-500">
                        Belum ada produk ditambahkan
                      </p>
                      <p className="text-xs text-gray-400">
                        Klik &quot;Tambah Produk&quot; untuk memulai
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                productFields.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3 text-center font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-left font-medium text-gray-800">
                      {(product as unknown as ProductFormData).name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                        {(product as unknown as ProductFormData).satuan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {formatCurrency(
                        (product as unknown as ProductFormData).price
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(product as unknown as ProductFormData).lead_time_days
                        ? `${(product as unknown as ProductFormData).lead_time_days} hari`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {(product as unknown as ProductFormData).moq || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(index)}
                        className="mr-2 text-primary hover:text-primary/80"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {errors.operational?.products && (
          <p className="mt-2 text-xs text-destructive">
            {errors.operational.products.message as string}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          <Info className="mr-1 inline h-3 w-3" />
          Klik &quot;Edit&quot; untuk tambah informasi spesifikasi, lead time,
          MOQ, dan informasi tambahan lainnya
        </p>
      </div>

      <div
        id="delivery-areas-section"
        className="border-t border-gray-100 pt-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Area Pengiriman
            </h3>
            <p className="text-sm text-gray-500">Wilayah yang dapat dilayani</p>
          </div>
          {areaFields.length > 0 && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {areaFields.length} area dipilih
            </span>
          )}
        </div>

        {areaFields.length === 0 ? (
          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 font-medium text-gray-900">
              Belum ada area pengiriman
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tambahkan area yang dapat Anda layani
            </p>
            <Button
              type="button"
              onClick={() => setShowAreaModal(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Area
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Area yang dipilih ({areaFields.length})
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAreaModal(true)}
              >
                <Plus className="mr-1 h-3 w-3" />
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {areaFields.map((area, index) => (
                <div
                  key={area.id}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                >
                  <MapPin className="h-4 w-4" />
                  <span>
                    {(area as unknown as DeliveryArea).city_name},{" "}
                    {(area as unknown as DeliveryArea).province_name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(index)}
                    className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.operational?.delivery_areas && (
          <p className="mt-3 text-sm text-destructive">
            {errors.operational.delivery_areas.message as string}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Biaya & Inklusi
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Komponen biaya dan inklusi dalam penawaran
        </p>

        <div className="mb-8">
          <Label className="form-label mb-3">Checklist Inklusi Biaya</Label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                checked={
                  watch("operational.cost_inclusions.mobilisasi") === true
                }
                onCheckedChange={(checked) =>
                  setValue(
                    "operational.cost_inclusions.mobilisasi",
                    checked === true
                  )
                }
              />
              Mobilisasi & demobilisasi tukang
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                checked={
                  watch("operational.cost_inclusions.penginapan") === true
                }
                onCheckedChange={(checked) =>
                  setValue(
                    "operational.cost_inclusions.penginapan",
                    checked === true
                  )
                }
              />
              Penginapan tukang
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                checked={
                  watch("operational.cost_inclusions.pengiriman") === true
                }
                onCheckedChange={(checked) =>
                  setValue(
                    "operational.cost_inclusions.pengiriman",
                    checked === true
                  )
                }
              />
              Biaya pengiriman
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                checked={watch("operational.cost_inclusions.langsir") === true}
                onCheckedChange={(checked) =>
                  setValue(
                    "operational.cost_inclusions.langsir",
                    checked === true
                  )
                }
              />
              Biaya langsir/bongkar muat
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                checked={
                  watch("operational.cost_inclusions.instalasi") === true
                }
                onCheckedChange={(checked) =>
                  setValue(
                    "operational.cost_inclusions.instalasi",
                    checked === true
                  )
                }
              />
              Instalasi/pemasangan
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <Checkbox
                checked={watch("operational.cost_inclusions.ppn") === true}
                onCheckedChange={(checked) =>
                  setValue("operational.cost_inclusions.ppn", checked === true)
                }
              />
              PPN 11%
            </label>
          </div>
        </div>

        <div>
          <Label className="form-label mb-3">Biaya Tambahan Lain</Label>
          {costFields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500">Belum ada biaya tambahan</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Keterangan</th>
                    <th className="w-36 px-3 py-2 text-right">Nilai (Rp)</th>
                    <th className="w-28 px-3 py-2 text-center">Satuan</th>
                    <th className="w-12 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {costFields.map((cost, index) => (
                    <tr
                      key={cost.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <td className="px-3 py-2">
                        <Input
                          placeholder="Biaya Listrik"
                          {...register(
                            `operational.additional_costs.${index}.description`
                          )}
                          className="h-9 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          placeholder="0"
                          {...register(
                            `operational.additional_costs.${index}.amount`,
                            { valueAsNumber: true }
                          )}
                          className="h-9 text-right text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="unit"
                          {...register(
                            `operational.additional_costs.${index}.unit`
                          )}
                          className="h-9 text-center text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCost(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCostRow}
            className="mt-3 text-sm font-medium"
          >
            <Plus className="mr-1 h-4 w-4" />
            Tambah Biaya
          </Button>
        </div>
      </div>

      <ProductModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        onSave={handleSaveProduct}
        editingProduct={getEditingProduct()}
      />

      <AreaModal
        open={showAreaModal}
        onOpenChange={setShowAreaModal}
        onApply={handleApplyAreas}
        selectedAreas={areaFields as unknown as DeliveryArea[]}
      />
    </div>
  )
}
