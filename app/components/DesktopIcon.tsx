"use client"

import { useState, useRef, useCallback, type MouseEvent } from "react"

interface DesktopIconProps {
  name: string
  icon: string
  onClick: () => void
  position: { x: number; y: number }
}

export default function DesktopIcon({ name, icon, onClick, position }: DesktopIconProps) {
  const [currentPosition, setCurrentPosition] = useState(position)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent | MouseEvent) => {
    if (!isDragging.current) return
    setCurrentPosition(prev => ({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }))
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    window.removeEventListener("mousemove", handleMouseMove as EventListener)
    window.removeEventListener("mouseup", handleMouseUp as EventListener)
  }, [handleMouseMove])

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true
    dragStart.current = { x: e.clientX - currentPosition.x, y: e.clientY - currentPosition.y }

    window.addEventListener("mousemove", handleMouseMove as EventListener)
    window.addEventListener("mouseup", handleMouseUp as EventListener)
  }

  const handleDoubleClick = () => {
    onClick()
  }

  return (
    <div
      className="absolute cursor-move select-none"
      style={{ left: `${currentPosition.x}px`, top: `${currentPosition.y}px` }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex flex-col items-center w-20">
        <img src={icon || "/placeholder.svg"} alt={name} className="w-12 h-12 mb-1" />
        <span className="text-sm text-center break-words text-white">{name}</span>
      </div>
    </div>
  )
}

