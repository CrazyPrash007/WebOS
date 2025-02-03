import { useState, useEffect, useCallback } from "react"

interface Notification {
  id: number
  message: string
}

export default function NotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string) => {
    const newNotification = { id: Date.now(), message }
    setNotifications((prev) => [...prev, newNotification])
  }, [])

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      addNotification(`New notification at ${new Date().toLocaleTimeString()}`)
    }, 60000) // Add a new notification every 60 seconds instead of 10

    return () => clearInterval(timer)
  }, [addNotification])

  return (
    <div className="fixed top-4 right-4 w-64 z-50">
      {notifications.map((notif) => (
        <div key={notif.id} className="bg-white shadow-md rounded p-4 mb-4">
          <p>{notif.message}</p>
          <button onClick={() => removeNotification(notif.id)} className="mt-2 text-sm text-blue-500">
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

