'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/lib/supabase/types'

interface NotificationBellProps {
  userId: string
}

/**
 * Zeigt eine Glocke mit Badge für ungelesene Notifications.
 * Öffnet ein Dropdown mit den letzten 5 Notifications.
 * Markiert Notifications beim Klick als gelesen.
 */
export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => n.read_at === null).length

  // Notifications laden beim Mount
  useEffect(() => {
    async function ladNotifications() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = createClient() as any

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error && data) {
        setNotifications(data as Notification[])
      }

      setLoading(false)
    }

    void ladNotifications()
  }, [userId])

  // Dropdown schließen bei Klick außerhalb
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Notification als gelesen markieren
  async function markiereAlsGelesen(notificationId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any
    const now = new Date().toISOString()

    await supabase
      .from('notifications')
      .update({ read_at: now })
      .eq('id', notificationId)

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read_at: now } : n
      )
    )
  }

  // Alle als gelesen markieren
  async function alleAlsGelesenMarkieren() {
    const unread = notifications.filter((n) => n.read_at === null)
    for (const n of unread) {
      await markiereAlsGelesen(n.id)
    }
  }

  function formatZeit(dateStr: string): string {
    const date = new Date(dateStr)
    const jetzt = new Date()
    const diffMs = jetzt.getTime() - date.getTime()
    const diffMinuten = Math.floor(diffMs / (1000 * 60))
    const diffStunden = Math.floor(diffMs / (1000 * 60 * 60))
    const diffTage = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinuten < 60) return `vor ${diffMinuten} Min.`
    if (diffStunden < 24) return `vor ${diffStunden} Std.`
    return `vor ${diffTage} Tag${diffTage !== 1 ? 'en' : ''}`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Glocken-Button */}
      <button
        onClick={() => {
          setOpen((prev) => !prev)
          if (!open && unreadCount > 0) {
            void alleAlsGelesenMarkieren()
          }
        }}
        className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
        aria-label={`Benachrichtigungen${unreadCount > 0 ? ` (${unreadCount} ungelesen)` : ''}`}
      >
        {/* Glocken-Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Ungelesen-Badge */}
        {!loading && unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-sm text-gray-900">Benachrichtigungen</p>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Wird geladen…
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Keine Benachrichtigungen
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    onClick={() => void markiereAlsGelesen(notification.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                      notification.read_at === null ? 'bg-primary-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {notification.title}
                      </p>
                      {notification.read_at === null && (
                        <span className="shrink-0 mt-1 h-2 w-2 rounded-full bg-primary-600" />
                      )}
                    </div>
                    {notification.body && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatZeit(notification.created_at)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
