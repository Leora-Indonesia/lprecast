"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/lib/types/vendor"

interface NotificationBellProps {
  userId: string
  initialNotifications?: Notification[]
  initialUnreadCount?: number
}

export function NotificationBell({
  userId: _userId,
  initialNotifications = [],
  initialUnreadCount = 0,
}: NotificationBellProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?limit=10`)
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
        if (!text || text.trim().startsWith("<")) {
          setNotifications([])
          setUnreadCount(0)
          return
        }
        const data = JSON.parse(text)
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    if (open) {
      fetchNotifications()
    }
  }, [open])

  const handleMarkAllAsRead = async () => {
    setIsLoading(true)
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
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationLink = (notification: Notification): string => {
    if (notification.reference_type === "vendor_registration") {
      return `/admin/vendors/${notification.reference_id}`
    }
    if (notification.reference_type === "tender") {
      return `/admin/tenders/${notification.reference_id}`
    }
    if (notification.reference_type === "payment_request") {
      return `/admin/payments/${notification.reference_id}`
    }
    return "/admin"
  }

  const getCategoryColor = (category: string): string => {
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notifikasi</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Tandai semua dibaca
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Tidak ada notifikasi
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification)}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 transition hover:bg-muted/50 ${
                    !notification.is_read ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
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
                                {
                                  addSuffix: true,
                                  locale: id,
                                }
                              )
                            : ""}
                        </span>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2">
          <Link
            href="/admin/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-sm text-primary hover:underline"
          >
            Lihat semua notifikasi
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
