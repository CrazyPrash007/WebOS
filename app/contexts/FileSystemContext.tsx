"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import CryptoJS from "crypto-js"

interface File {
  name: string
  content: string
}

interface Folder {
  name: string
  children: (File | Folder)[]
}

interface FileSystem {
  root: Folder
}

interface FileSystemContextType {
  fileSystem: FileSystem
  createFile: (path: string[], name: string) => void
  createFolder: (path: string[], name: string) => void
  deleteItem: (path: string[]) => void
  renameItem: (path: string[], newName: string) => void
  updateFileContent: (path: string[], content: string) => void
  setFileSystemEncryption: (key: string | null) => void
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [fileSystem, setFileSystem] = useState<FileSystem>({
    root: {
      name: "root",
      children: [],
    },
  })

  const [encryptionKey, setEncryptionKey] = useState<string | null>(null)

  const encrypt = (data: string) => {
    if (!encryptionKey) return data
    return CryptoJS.AES.encrypt(data, encryptionKey).toString()
  }

  const decrypt = (data: string) => {
    if (!encryptionKey) return data
    const bytes = CryptoJS.AES.decrypt(data, encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  const setFileSystemEncryption = (key: string | null) => {
    setEncryptionKey(key)
    // Re-encrypt or decrypt all files with the new key
    setFileSystem((prevFileSystem) => {
      const encryptOrDecryptFolder = (folder: Folder): Folder => {
        return {
          ...folder,
          children: folder.children.map((item) => {
            if ("content" in item) {
              return {
                ...item,
                content: key ? encrypt(decrypt(item.content)) : decrypt(item.content),
              }
            }
            return encryptOrDecryptFolder(item as Folder)
          }),
        }
      }
      return {
        root: encryptOrDecryptFolder(prevFileSystem.root),
      }
    })
  }

  const createFile = (path: string[], name: string) => {
    setFileSystem((prev) => {
      const newFileSystem = { ...prev }
      let currentFolder = newFileSystem.root
      for (const folderName of path) {
        const nextFolder = currentFolder.children.find(
          (item): item is Folder => "children" in item && item.name === folderName,
        )
        if (!nextFolder) {
          // If the folder doesn't exist, create it
          const newFolder: Folder = { name: folderName, children: [] }
          currentFolder.children.push(newFolder)
          currentFolder = newFolder
        } else {
          currentFolder = nextFolder
        }
      }
      currentFolder.children.push({ name, content: "" })
      return newFileSystem
    })
  }

  const createFolder = (path: string[], name: string) => {
    setFileSystem((prev) => {
      const newFileSystem = { ...prev }
      let currentFolder = newFileSystem.root
      for (const folderName of path) {
        const nextFolder = currentFolder.children.find(
          (item): item is Folder => "children" in item && item.name === folderName,
        )
        if (!nextFolder) {
          // If the folder doesn't exist, create it
          const newFolder: Folder = { name: folderName, children: [] }
          currentFolder.children.push(newFolder)
          currentFolder = newFolder
        } else {
          currentFolder = nextFolder
        }
      }
      currentFolder.children.push({ name, children: [] })
      return newFileSystem
    })
  }

  const deleteItem = (path: string[]) => {
    setFileSystem((prev) => {
      const newFileSystem = { ...prev }
      let currentFolder = newFileSystem.root
      for (let i = 0; i < path.length - 1; i++) {
        const nextFolder = currentFolder.children.find(
          (item): item is Folder => "children" in item && item.name === path[i],
        )
        if (!nextFolder) {
          // If we can't find the folder, return the current state
          return prev
        }
        currentFolder = nextFolder
      }
      const indexToRemove = currentFolder.children.findIndex((item) => item.name === path[path.length - 1])
      if (indexToRemove !== -1) {
        currentFolder.children.splice(indexToRemove, 1)
      }
      return newFileSystem
    })
  }

  const renameItem = (path: string[], newName: string) => {
    setFileSystem((prev) => {
      const newFileSystem = { ...prev }
      let currentFolder = newFileSystem.root
      for (let i = 0; i < path.length - 1; i++) {
        const nextFolder = currentFolder.children.find(
          (item): item is Folder => "children" in item && item.name === path[i],
        )
        if (!nextFolder) {
          // If we can't find the folder, return the current state
          return prev
        }
        currentFolder = nextFolder
      }
      const itemToRename = currentFolder.children.find((item) => item.name === path[path.length - 1])
      if (itemToRename) {
        itemToRename.name = newName
      }
      return newFileSystem
    })
  }

  const updateFileContent = (path: string[], content: string) => {
    setFileSystem((prev) => {
      const newFileSystem = { ...prev }
      let currentFolder = newFileSystem.root
      for (let i = 0; i < path.length - 1; i++) {
        const nextFolder = currentFolder.children.find(
          (item): item is Folder => "children" in item && item.name === path[i],
        )
        if (!nextFolder) {
          // If we can't find the folder, return the current state
          return prev
        }
        currentFolder = nextFolder
      }
      const file = currentFolder.children.find(
        (item): item is File => "content" in item && item.name === path[path.length - 1],
      ) as File
      if (file) {
        file.content = encrypt(content)
      }
      return newFileSystem
    })
  }

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        createFile,
        createFolder,
        deleteItem,
        renameItem,
        updateFileContent,
        setFileSystemEncryption,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}

