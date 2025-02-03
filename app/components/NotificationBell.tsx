import { Bell } from "lucide-react"

interface NotificationBellProps {
  onClick: () => void
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
  return (
    <button onClick={onClick} className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg">
      <Bell size={24} />
    </button>
  )
}

