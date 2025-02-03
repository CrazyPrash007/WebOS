"use client"

import React, { useState, useRef, useEffect, type ReactNode } from "react"
import { Rnd } from "react-rnd"
import { Maximize2, Minimize2, X } from "lucide-react"

interface WindowProps {
  title: string
  children: ReactNode
  isActive: boolean
  onClose: () => void
  onClick: () => void
  onFocus: () => void
  zIndex: number
}

const Window: React.FC<WindowProps> = React.memo(
  ({ title, children, isActive, onClose, onClick, onFocus, zIndex }: WindowProps) => {
    const [isMaximized, setIsMaximized] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [size, setSize] = useState({ width: 600, height: 400 })
    const [position, setPosition] = useState({ x: 20, y: 20 })
    const windowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
          onClick()
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [onClick])

    const handleMaximize = () => {
      setIsMaximized(!isMaximized)
      if (!isMaximized) {
        setPosition({ x: 0, y: 0 })
        setSize({ width: window.innerWidth, height: window.innerHeight - 48 }) // 48px for taskbar
      } else {
        setPosition({ x: 20, y: 20 })
        setSize({ width: 600, height: 400 })
      }
    }

    const handleMinimize = () => {
      setIsMinimized(true)
      onClick() // Deactivate the window
    }

    if (isMinimized) {
      return null
    }

    return (
      <Rnd
        size={{
          width: isMaximized ? window.innerWidth : size.width,
          height: isMaximized ? window.innerHeight - 48 : size.height,
        }}
        position={isMaximized ? { x: 0, y: 0 } : position}
        onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
        onResize={(e, direction, ref, delta, position) => {
          setSize({
            width: Number.parseInt(ref.style.width),
            height: Number.parseInt(ref.style.height),
          })
          setPosition(position)
        }}
        onMouseDown={() => onFocus()}
        disableDragging={isMaximized}
        enableResizing={!isMaximized}
        className={`bg-background text-foreground shadow-lg rounded-lg overflow-hidden`}
        style={{ zIndex }}
      >
        <div ref={windowRef} className="w-full h-full">
          <div className="window-header bg-secondary text-secondary-foreground px-4 py-2 flex justify-between items-center cursor-move">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="space-x-2">
              <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded" onClick={handleMinimize}>
                <Minimize2 size={16} />
              </button>
              <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded" onClick={handleMaximize}>
                <Maximize2 size={16} />
              </button>
              <button className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded" onClick={onClose}>
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-auto window-content" style={{ height: "calc(100% - 40px)" }}>
            {children}
          </div>
        </div>
      </Rnd>
    )
  },
)

Window.displayName = "Window"

export default Window

