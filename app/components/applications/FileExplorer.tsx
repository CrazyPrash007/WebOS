import { useState } from "react"
import { useFileSystem } from "../../contexts/FileSystemContext"
import { Folder, File, ChevronLeft, ChevronRight } from "lucide-react"

interface FileSystemItem {
  name: string
  children?: FileSystemItem[]
  content?: string
}

interface FileExplorerProps {
  fileSystem: {
    root: FileSystemItem
  }
}

const PathDisplay = ({ path }: { path: string[] }) => (
  <div className="flex items-center bg-secondary text-secondary-foreground p-2 mb-2 overflow-x-auto">
    <Folder size={16} className="mr-2" />
    <span className="font-bold mr-2">Path:</span>
    {path.length === 0 ? (
      <span>Root</span>
    ) : (
      path.map((folder, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-1" />}
          {folder}
        </span>
      ))
    )}
  </div>
)

export default function FileExplorer({ fileSystem }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const { createFile, createFolder, deleteItem, renameItem, updateFileContent } = useFileSystem()
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState("")

  const getCurrentFolder = () => {
    let folder: FileSystemItem = fileSystem.root
    for (const name of currentPath) {
      const nextFolder = folder.children?.find((item) => item.name === name)
      if (nextFolder && nextFolder.children) {
        folder = nextFolder
      } else {
        return folder
      }
    }
    return folder
  }

  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.children) {
      setCurrentPath([...currentPath, item.name])
    } else {
      setEditingFile(item.name)
      setFileContent(item.content || "")
    }
  }

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const handleCreateFile = () => {
    const name = prompt("Enter file name:")
    if (name) {
      createFile(currentPath, name)
    }
  }

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:")
    if (name) {
      createFolder(currentPath, name)
    }
  }

  const handleDelete = (item: FileSystemItem) => {
    deleteItem([...currentPath, item.name])
  }

  const handleRename = (item: FileSystemItem) => {
    const newName = prompt("Enter new name:", item.name)
    if (newName) {
      renameItem([...currentPath, item.name], newName)
    }
  }

  const handleSaveFile = () => {
    if (editingFile) {
      updateFileContent([...currentPath, editingFile], fileContent)
      setEditingFile(null)
    }
  }

  const currentFolder = getCurrentFolder()

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex justify-between mb-2 p-2 bg-secondary">
        <button
          onClick={handleBack}
          disabled={currentPath.length === 0}
          className="px-2 py-1 bg-primary text-primary-foreground rounded flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>
        <div>
          <button onClick={handleCreateFile} className="px-2 py-1 bg-primary text-primary-foreground rounded mr-2">
            New File
          </button>
          <button onClick={handleCreateFolder} className="px-2 py-1 bg-primary text-primary-foreground rounded">
            New Folder
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <PathDisplay path={currentPath} />
        {currentFolder.children?.map((item: FileSystemItem) => (
          <div
            key={item.name}
            className="flex justify-between items-center p-2 hover:bg-accent hover:text-accent-foreground"
          >
            <div onDoubleClick={() => handleDoubleClick(item)} className="flex items-center">
              {item.children ? <Folder size={16} className="mr-2" /> : <File size={16} className="mr-2" />}
              <span>{item.name}</span>
            </div>
            <div>
              <button
                onClick={() => handleRename(item)}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded mr-2"
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="px-2 py-1 bg-destructive text-destructive-foreground rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingFile && (
        <div className="mt-4 p-2 bg-secondary">
          <h3 className="text-lg font-bold mb-2">Editing: {editingFile}</h3>
          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className="w-full h-40 p-2 bg-background text-foreground border border-border rounded"
          />
          <button onClick={handleSaveFile} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded">
            Save
          </button>
        </div>
      )}
    </div>
  )
}

