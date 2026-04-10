import { useEffect, useState, useRef, useCallback } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"

interface UseFormPersistenceOptions<T extends FieldValues> {
  key: string
  form: UseFormReturn<T>
  onDataLoaded?: () => void
  onSave?: () => void
}

function removeFileObjects<T extends FieldValues>(data: T): T {
  try {
    const cleaned = JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (value instanceof File) {
          return undefined
        }
        return value
      })
    )
    return cleaned as T
  } catch {
    return data
  }
}

function getSavedData(
  key: string
): { data: Record<string, unknown>; savedAt: string } | null {
  if (typeof window === "undefined") return null
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    localStorage.removeItem(key)
  }
  return null
}

export function useFormPersistence<T extends FieldValues>({
  key,
  form,
  onDataLoaded,
  onSave,
}: UseFormPersistenceOptions<T>) {
  const [hasSavedData, setHasSavedData] = useState(false)
  const [savedTimestamp, setSavedTimestamp] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isLoadedRef = useRef(false)

  const saveToLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return

    try {
      const data = form.getValues()
      const cleanedData = removeFileObjects(data)
      const timestamp = new Date().toISOString()

      localStorage.setItem(
        key,
        JSON.stringify({
          data: cleanedData,
          savedAt: timestamp,
        })
      )

      setHasSavedData(true)
      setSavedTimestamp(timestamp)
      onSave?.()
    } catch (error) {
      console.error("Failed to save form data:", error)
    }
  }, [form, key, onSave])

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = getSavedData(key)
    if (saved) {
      requestAnimationFrame(() => {
        setHasSavedData(true)
        setSavedTimestamp(saved.savedAt)
      })
    }
  }, [key])

  useEffect(() => {
    if (typeof window === "undefined") return

    const subscription = form.watch(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveToLocalStorage()
      }, 1000)
    })

    return () => {
      subscription.unsubscribe()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [form, key, saveToLocalStorage])

  const loadSavedData = useCallback(() => {
    if (typeof window === "undefined") return
    if (isLoadedRef.current) return

    const saved = getSavedData(key)
    if (saved) {
      isLoadedRef.current = true

      form.reset(saved.data as T, {
        keepDefaultValues: false,
        keepDirty: false,
        keepErrors: false,
        keepTouched: false,
        keepIsSubmitted: false,
        keepSubmitCount: false,
        keepIsValidating: false,
        keepIsValid: false,
      })

      onDataLoaded?.()
    }
  }, [form, key, onDataLoaded])

  const clearSavedData = useCallback(() => {
    if (typeof window === "undefined") return

    localStorage.removeItem(key)
    setHasSavedData(false)
    setSavedTimestamp(null)
    isLoadedRef.current = false
  }, [key])

  const forceSave = useCallback(() => {
    saveToLocalStorage()
  }, [saveToLocalStorage])

  return {
    hasSavedData,
    savedTimestamp,
    loadSavedData,
    clearSavedData,
    forceSave,
    isLoaded: true,
    isSaving: false,
  }
}
