"use client"

import { useEffect, useRef } from "react"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  items: { label: string; action: () => void }[]
}

export default function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50"
      style={{ top: y, left: x }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            item.action()
            onClose()
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

