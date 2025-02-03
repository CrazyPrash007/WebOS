"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useClickOutside } from "../hooks/useClickOutside"

interface Notification {
  id: number
  message: string
}

interface NotificationSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      addNotification(`New notification at ${new Date().toLocaleTimeString()}`)
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useClickOutside(sidebarRef, onClose)

  const addNotification = (message: string) => {
    const newNotification = { id: Date.now(), message }
    setNotifications((prev) => [...prev, newNotification])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-full">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-gray-100 dark:bg-gray-700 p-3 mb-3 rounded-lg">
            <p className="text-sm">{notif.message}</p>
            <button
              onClick={() => removeNotification(notif.id)}
              className="mt-2 text-sm text-blue-500 dark:text-blue-400"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

