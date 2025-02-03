"use client"

import { useState } from "react"
import Desktop from "./components/Desktop"
import Taskbar from "./components/Taskbar"
import { FileSystemProvider } from "./contexts/FileSystemContext"
import { WindowsProvider } from "./contexts/WindowsContext"
import { UserProvider } from "./contexts/UserContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import LoginScreen from "./components/LoginScreen"
import NotificationSidebar from "./components/NotificationSidebar"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false)
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const openWindow = (appName: string) => {
    if (!openWindows.includes(appName)) {
      setOpenWindows([...openWindows, appName])
    }
    // If the window was minimized, remove it from minimizedWindows
    if (minimizedWindows.includes(appName)) {
      setMinimizedWindows(minimizedWindows.filter((window) => window !== appName))
    }
  }

  const closeWindow = (appName: string) => {
    setOpenWindows(openWindows.filter((window) => window !== appName))
    // Also remove from minimizedWindows if it was minimized
    setMinimizedWindows(minimizedWindows.filter((window) => window !== appName))
  }

  const toggleNotificationSidebar = () => {
    setIsNotificationSidebarOpen(!isNotificationSidebarOpen)
  }

  const toggleMinimize = (appName: string) => {
    setMinimizedWindows((prev) =>
      prev.includes(appName) ? prev.filter((window) => window !== appName) : [...prev, appName],
    )
  }

  const apps = [
    { name: "Text Editor", icon: "/icons/text-editor.png" },
    { name: "Calculator", icon: "/icons/calculator.png" },
    { name: "File Explorer", icon: "/icons/file-explorer.png" },
    { name: "Terminal", icon: "/icons/terminal.png" },
    { name: "Tic-Tac-Toe", icon: "/icons/tic-tac-toe.png" },
    { name: "Screen Capture", icon: "/icons/screen-capture.png" },
  ]

  return (
    <UserProvider>
      <ThemeProvider>
        <FileSystemProvider>
          <WindowsProvider>
            {isLoggedIn ? (
              <main className="h-screen w-screen overflow-hidden bg-blue-100 dark:bg-gray-800 flex flex-col">
                <Desktop
                  openWindows={openWindows}
                  closeWindow={closeWindow}
                  openWindow={openWindow}
                  toggleNotificationSidebar={toggleNotificationSidebar}
                />
                <Taskbar
                  openWindows={openWindows}
                  openWindow={openWindow}
                  minimizedWindows={minimizedWindows}
                  toggleMinimize={toggleMinimize}
                  apps={apps}
                />
                <NotificationSidebar
                  isOpen={isNotificationSidebarOpen}
                  onClose={() => setIsNotificationSidebarOpen(false)}
                />
              </main>
            ) : (
              <LoginScreen onLogin={handleLogin} />
            )}
          </WindowsProvider>
        </FileSystemProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

