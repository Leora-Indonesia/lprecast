"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/lib/types/vendor"

const categories = [
  { value: "all", label: "Semua" },
  { value: "vendor", label: "Vendor" },
  { value: "tender", label: "Tender" },
  { value: "payment", label: "Pembayaran" },
  { value: "document", label: "Dokumen" },
]

const PAGE_SIZE = 10

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [total, setTotal] = useState(0)
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [markingAllRead, setMarkingAllRead] = useState(false)

  const fetchNotifications = useCallback(
    async (reset = false) => {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      try {
        const offset = reset ? 0 : notifications.length
        const params = new URLSearchParams({
          limit: PAGE_SIZE.toString(),
          offset: offset.toString(),
        })
        if (activeCategory !== "all") {
          params.set("category", activeCategory)
        }

        const response = await fetch(`/api/notifications?${params}`)

        if (response.status === 401) {
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()
        if (!text) {
          if (reset) {
            setNotifications([])
          }
          setTotal(0)
          return
        }

        if (text.trim().startsWith("<")) {
          throw new Error("Received HTML instead of JSON")
        }

        const data = JSON.parse(text)
        if (reset) {
          setNotifications(data.notifications ?? [])
        } else {
          setNotifications((prev) => [...prev, ...(data.notifications ?? [])])
        }
        setTotal(data.total ?? 0)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [activeCategory, notifications.length]
  )

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setNotifications([])
      try {
        const params = new URLSearchParams({
          limit: PAGE_SIZE.toString(),
          offset: "0",
        })
        if (activeCategory !== "all") {
          params.set("category", activeCategory)
        }
        const response = await fetch(`/api/notifications?${params}`)

        if (response.status === 401) {
          window.location.href = "/login"
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()
        if (!text) {
          setNotifications([])
          setTotal(0)
          return
        }

        const data = JSON.parse(text)
        setNotifications(data.notifications ?? [])
        setTotal(data.total ?? 0)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setNotifications([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCategory])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setNotifications([])
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
      })
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? {
                  ...n,
                  is_read: true,
                  read_at: new Date().toISOString() as unknown as null,
                }
              : n
          )
        )
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    setMarkingAllRead(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
      })
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString() as unknown as null,
          }))
        )
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    } finally {
      setMarkingAllRead(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vendor":
        return "bg-green-100 text-green-800"
      case "tender":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-yellow-100 text-yellow-800"
      case "document":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationLink = (notification: Notification) => {
    if (notification.reference_type === "vendor_registration") {
      return `/admin/vendors/${notification.reference_id}`
    }
    if (notification.reference_type === "tender") {
      return `/admin/tenders/${notification.reference_id}`
    }
    if (notification.reference_type === "payment_request") {
      return `/admin/payments/${notification.reference_id}`
    }
    return "/admin/notifications"
  }

  const hasMore = notifications.length < total

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markingAllRead}
          >
            {markingAllRead ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="mr-2 h-4 w-4" />
            )}
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Tidak ada notifikasi</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeCategory === "all"
                  ? "Anda belum memiliki notifikasi apapun."
                  : `Belum ada notifikasi untuk kategori "${categories.find((c) => c.value === activeCategory)?.label}".`}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`py-4 first:pt-0 last:pb-0 ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    <Link
                      href={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification.id)
                        }
                      }}
                      className="block rounded-lg p-3 transition hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.is_read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getCategoryColor(notification.category)}`}
                            >
                              {notification.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notification.created_at
                                ? formatDistanceToNow(
                                    new Date(notification.created_at),
                                    { addSuffix: true, locale: id }
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNotifications(false)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Muat lebih banyak
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
