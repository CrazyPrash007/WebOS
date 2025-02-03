import { useState } from "react"

export default function ClipboardManager() {
  const [clipboard, setClipboard] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToClipboard = (text: string) => {
    setClipboard((prev) => [text, ...prev.slice(0, 9)]) // Keep last 10 items
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <button onClick={toggleOpen} className="bg-blue-500 text-white px-4 py-2 rounded">
        {isOpen ? "Close Clipboard" : "Open Clipboard"}
      </button>
      {isOpen && (
        <div className="bg-white shadow-md rounded p-4 mt-2 w-64">
          <h2 className="text-xl font-bold mb-4">Clipboard History</h2>
          <ul>
            {clipboard.map((item, index) => (
              <li key={index} className="mb-2">
                <button onClick={() => copyToClipboard(item)} className="text-blue-500">
                  Copy
                </button>
                <span className="ml-2">{item.substring(0, 30)}...</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

