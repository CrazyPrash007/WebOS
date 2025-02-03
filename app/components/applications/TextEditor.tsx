import { useState } from "react"
import { useFileSystem } from "../../contexts/FileSystemContext"

export default function TextEditor() {
  const [content, setContent] = useState("")
  const [fileName, setFileName] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const { createFile, updateFileContent, fileSystem } = useFileSystem()

  const handleSave = () => {
    if (fileName) {
      const fullPath = [...currentPath, fileName]
      updateFileContent(fullPath, content)
      alert(`File saved: ${fullPath.join("/")}`)
    } else {
      const newFileName = prompt("Enter a file name:")
      if (newFileName) {
        const fullPath = [...currentPath, newFileName]
        createFile(currentPath, newFileName)
        updateFileContent(fullPath, content)
        setFileName(newFileName)
        alert(`File created and saved: ${fullPath.join("/")}`)
      }
    }
  }

  const handleFolderSelect = () => {
    const folders = getFolders(fileSystem.root)
    const selectedFolder = prompt(`Select a folder to save in (or leave empty for root):\n${folders.join("\n")}`)
    if (selectedFolder !== null) {
      setCurrentPath(selectedFolder ? selectedFolder.split("/").filter(Boolean) : [])
    }
  }

  const getFolders = (folder: any, path: string[] = []): string[] => {
    let folders: string[] = [path.join("/") || "root"]
    folder.children.forEach((child: any) => {
      if (child.children) {
        folders = folders.concat(getFolders(child, [...path, child.name]))
      }
    })
    return folders
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex justify-between items-center p-2 bg-secondary">
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Untitled"
          className="bg-background text-foreground px-2 py-1 rounded"
        />
        <div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded mr-2" onClick={handleFolderSelect}>
            Select Folder
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500 px-2">
        Current path: {currentPath.length > 0 ? `/${currentPath.join("/")}` : "Root"}
      </div>
      <textarea
        className="flex-grow p-2 resize-none bg-background text-foreground border border-border"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  )
}

