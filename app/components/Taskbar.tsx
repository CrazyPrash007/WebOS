"use client"

import { useState } from "react"
import StartMenu from "./StartMenu"
import { Battery, Wifi, Bluetooth, Volume2, Search } from "lucide-react"
import Calendar from "./Calendar"

interface TaskbarProps {
  openWindows: string[]
  openWindow: (appName: string) => void
  minimizedWindows: string[]
  toggleMinimize: (appName: string) => void
  apps: { name: string; icon: string }[]
}

export default function Taskbar({ openWindows, openWindow, minimizedWindows, toggleMinimize, apps }: TaskbarProps) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isWifiOn, setIsWifiOn] = useState(true)
  const [isBluetoothOn, setIsBluetoothOn] = useState(true)
  const [volume, setVolume] = useState(50)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchTerm = (e.target as HTMLFormElement).search.value.toLowerCase()
    const matchingApp = apps.find((app) => app.name.toLowerCase().includes(searchTerm))
    if (matchingApp) {
      openWindow(matchingApp.name)
    }
  }

  const handleWindowClick = (window: string) => {
    if (minimizedWindows.includes(window)) {
      toggleMinimize(window)
    } else {
      openWindow(window)
    }
  }

  return (
    <div className="bg-gray-800 text-white h-12 flex items-center px-2 relative z-50">
      <div className="relative">
        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded" onClick={toggleStartMenu}>
          Start
        </button>
        {isStartMenuOpen && <StartMenu openWindow={openWindow} closeStartMenu={() => setIsStartMenuOpen(false)} />}
      </div>
      <form onSubmit={handleSearch} className="ml-4 flex-grow">
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="w-full px-4 py-1 pr-8 rounded bg-gray-700 text-white"
          />
          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Search size={18} />
          </button>
        </div>
      </form>
      <div className="flex-grow flex items-center justify-center space-x-2">
        {openWindows.map((window) => (
          <button
            key={window}
            className={`bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded ${
              minimizedWindows.includes(window) ? "opacity-50" : ""
            }`}
            onClick={() => handleWindowClick(window)}
          >
            {window}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Battery size={18} />
        <button onClick={() => setIsWifiOn(!isWifiOn)}>
          <Wifi size={18} className={isWifiOn ? "text-white" : "text-gray-500"} />
        </button>
        <button onClick={() => setIsBluetoothOn(!isBluetoothOn)}>
          <Bluetooth size={18} className={isBluetoothOn ? "text-white" : "text-gray-500"} />
        </button>
        <div className="flex items-center">
          <Volume2 size={18} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number.parseInt(e.target.value))}
            className="ml-1 w-16"
          />
        </div>
        <div className="text-sm relative">
          <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="focus:outline-none">
            <div>{new Date().toLocaleTimeString()}</div>
            <div>{new Date().toLocaleDateString()}</div>
          </button>
          {isCalendarOpen && (
            <div className="absolute bottom-full right-0 mb-2">
              <Calendar onClose={() => setIsCalendarOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

