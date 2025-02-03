"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Window {
  id: string
  title: string
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

interface WindowsContextType {
  windows: Window[]
  addWindow: (title: string) => void
  removeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
}

const WindowsContext = createContext<WindowsContextType | undefined>(undefined)

export function WindowsProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([])
  const [nextZIndex, setNextZIndex] = useState(1)

  const addWindow = (title: string) => {
    const newWindow: Window = {
      id: Date.now().toString(),
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    }
    setWindows([...windows, newWindow])
    setNextZIndex(nextZIndex + 1)
  }

  const removeWindow = (id: string) => {
    setWindows(windows.filter((window) => window.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setWindows(windows.map((window) => (window.id === id ? { ...window, isMinimized: !window.isMinimized } : window)))
  }

  const maximizeWindow = (id: string) => {
    setWindows(windows.map((window) => (window.id === id ? { ...window, isMaximized: !window.isMaximized } : window)))
  }

  const focusWindow = (id: string) => {
    setWindows(windows.map((window) => (window.id === id ? { ...window, zIndex: nextZIndex } : window)))
    setNextZIndex(nextZIndex + 1)
  }

  return (
    <WindowsContext.Provider
      value={{
        windows,
        addWindow,
        removeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
      }}
    >
      {children}
    </WindowsContext.Provider>
  )
}

export function useWindows() {
  const context = useContext(WindowsContext)
  if (context === undefined) {
    throw new Error("useWindows must be used within a WindowsProvider")
  }
  return context
}

