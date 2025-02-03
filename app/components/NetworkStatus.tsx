import { useState, useEffect } from "react"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const toggleStatus = () => {
      setIsOnline((prev) => !prev)
    }

    const interval = setInterval(toggleStatus, 30000) // Toggle every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`fixed top-4 right-4 p-2 rounded text-sm ${isOnline ? "bg-green-500" : "bg-red-500"}`}>
      {isOnline ? "Online" : "Offline"}
    </div>
  )
}

