"use client"

import { useState, useRef } from "react"
import { useTheme } from "../contexts/ThemeContext"
import { Clipboard } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { useClickOutside } from "../hooks/useClickOutside"

interface StartMenuProps {
  openWindow: (appName: string) => void
  closeStartMenu: () => void
}

export default function StartMenu({ openWindow, closeStartMenu }: StartMenuProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { theme, toggleTheme } = useTheme()
  const startMenuRef = useRef<HTMLDivElement>(null)
  useClickOutside(startMenuRef, closeStartMenu)

  const apps = ["Text Editor", "Calculator", "File Explorer", "Terminal", "Tic-Tac-Toe"]

  const filteredApps = apps.filter((app) => app.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAppClick = (appName: string) => {
    openWindow(appName)
    closeStartMenu()
  }

  return (
    <div ref={startMenuRef} className="absolute bottom-12 left-0 w-64 bg-gray-800 text-white rounded-t-lg shadow-lg">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 py-1 bg-gray-700 rounded text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredApps.map((app) => (
          <button
            key={app}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
            onClick={() => handleAppClick(app)}
          >
            {app}
          </button>
        ))}
      </div>
      <div className="border-t border-gray-700 p-4 flex justify-between items-center">
        <button
          onClick={() => openWindow("Clipboard")}
          className="text-left px-4 py-2 hover:bg-gray-700 flex items-center"
        >
          <Clipboard className="mr-2" size={18} />
          Clipboard
        </button>
        <ThemeToggle />
      </div>
    </div>
  )
}

