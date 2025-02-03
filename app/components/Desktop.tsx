"use client"

import { useState, useCallback, useEffect } from "react"
import { DndContext } from "@dnd-kit/core"
import Window from "./Window"
import DesktopIcon from "./DesktopIcon"
import ContextMenu from "./ContextMenu"
import { useFileSystem } from "../contexts/FileSystemContext"
import TextEditor from "./applications/TextEditor"
import Calculator from "./applications/Calculator"
import FileExplorer from "./applications/FileExplorer"
import Terminal from "./applications/Terminal"
import TicTacToe from "./applications/TicTacToe"
import ScreenCapture from "./applications/ScreenCapture"
import NotificationBell from "./NotificationBell"
import SnakeGame from "./applications/SnakeGame"

interface DesktopProps {
  openWindows: string[]
  closeWindow: (appName: string) => void
  openWindow: (appName: string) => void
  toggleNotificationSidebar: () => void
  minimizedWindows: string[]
  toggleMinimize: (appName: string) => void
}

export default function Desktop({
  openWindows,
  closeWindow,
  openWindow,
  toggleNotificationSidebar,
  minimizedWindows,
  toggleMinimize,
}: DesktopProps) {
  const { fileSystem, createFile, createFolder } = useFileSystem()
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    items: { label: string; action: () => void }[]
  } | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string>("/default-background.jpg")
  const [highestZIndex, setHighestZIndex] = useState(1)
  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number; y: number } }>({})

  useEffect(() => {
    if (activeWindow) {
      setHighestZIndex((prev) => prev + 1)
    }
  }, [activeWindow])

  const handleWindowClick = (appName: string) => {
    setActiveWindow(appName)
    if (minimizedWindows && minimizedWindows.includes(appName)) {
      toggleMinimize(appName)
    }
  }

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            label: "New Folder",
            action: () => {
              const folderName = prompt("Enter folder name:")
              if (folderName) createFolder([], folderName)
            },
          },
          {
            label: "New File",
            action: () => {
              const fileName = prompt("Enter file name:")
              if (fileName) createFile([], fileName)
            },
          },
          {
            label: "Change Background",
            action: () => {
              const newBackground = prompt("Enter URL of new background image:")
              if (newBackground) setBackgroundImage(newBackground)
            },
          },
          { label: "Refresh", action: () => console.log("Refresh desktop") },
        ],
      })
    },
    [createFile, createFolder],
  )

  const handleIconPositionChange = (name: string, position: { x: number; y: number }) => {
    setIconPositions((prev) => ({ ...prev, [name]: position }))
  }

  const apps = [
    { name: "Text Editor", icon: "https://img.icons8.com/color/48/000000/source-code.png" },
    { name: "Calculator", icon: "https://img.icons8.com/color/48/000000/calculator.png" },
    {
      name: "File Explorer",
      icon: "https://e7.pngegg.com/pngimages/546/607/png-clipart-computer-icons-file-explorer-internet-explorer-internet-explorer-blue-angle-thumbnail.png",
    },
    { name: "Terminal", icon: "https://img.icons8.com/color/48/000000/console.png" },
    { name: "Tic-Tac-Toe", icon: "https://images.seeklogo.com/logo-png/45/2/tic-tac-toe-logo-png_seeklogo-456127.png" },
    { name: "Screen Capture", icon: "https://img.icons8.com/color/48/000000/screenshot.png" },
    { name: "Snake Game", icon: "https://img.icons8.com/color/48/000000/snake.png" },
  ]

  return (
    <DndContext>
      <div
        className="flex-grow relative"
        onContextMenu={handleContextMenu}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-4 left-4 space-y-4 flex flex-col items-start">
          {apps.map((app, index) => (
            <DesktopIcon
              key={app.name}
              name={app.name}
              icon={app.icon}
              onClick={() => openWindow(app.name)}
              position={iconPositions[app.name] || { x: 0, y: index * 80 }}
              onPositionChange={handleIconPositionChange}
            />
          ))}
        </div>
        {openWindows.map((window) => (
          <Window
            key={window}
            title={window}
            isActive={activeWindow === window}
            onClose={() => closeWindow(window)}
            onClick={() => handleWindowClick(window)}
            onFocus={() => setActiveWindow(window)}
            zIndex={activeWindow === window ? highestZIndex : undefined}
          >
            {(!minimizedWindows || !minimizedWindows.includes(window)) && (
              <>
                {window === "Text Editor" && <TextEditor />}
                {window === "Calculator" && <Calculator />}
                {window === "File Explorer" && <FileExplorer fileSystem={fileSystem} />}
                {window === "Terminal" && <Terminal openWindow={openWindow} />}
                {window === "Tic-Tac-Toe" && <TicTacToe />}
                {window === "Screen Capture" && <ScreenCapture />}
                {window === "Snake Game" && <SnakeGame />}
              </>
            )}
          </Window>
        ))}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.items}
            onClose={() => setContextMenu(null)}
          />
        )}
        <div className="absolute bottom-12 right-4">
          <NotificationBell onClick={toggleNotificationSidebar} />
        </div>
      </div>
    </DndContext>
  )
}

