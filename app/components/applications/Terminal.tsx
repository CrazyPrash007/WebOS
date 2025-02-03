import { useState } from "react"
import { useFileSystem } from "../../contexts/FileSystemContext"

interface TerminalProps {
  openWindow: (appName: string) => void
}

export default function Terminal({ openWindow }: TerminalProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([
    "Welcome to the WebOS Terminal!",
    "Type 'help' for a list of available commands.",
  ])
  const { fileSystem } = useFileSystem()

  const handleCommand = (command: string) => {
    const parts = command.split(" ")
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (cmd) {
      case "help":
        setOutput([
          ...output,
          "> " + command,
          "Available commands:",
          "  help - Show this help message",
          "  ls - List files and directories",
          "  date - Show current date and time",
          "  open [app] - Open an application (e.g., open texteditor)",
          "  clear - Clear the terminal",
        ])
        break
      case "ls":
        setOutput([...output, "> " + command, ...fileSystem.root.children.map((item) => item.name)])
        break
      case "date":
        setOutput([...output, "> " + command, new Date().toString()])
        break
      case "open":
        if (args.length > 0) {
          const appName = args[0].charAt(0).toUpperCase() + args[0].slice(1)
          openWindow(appName)
          setOutput([...output, "> " + command, `Opening ${appName}...`])
        } else {
          setOutput([...output, "> " + command, "Error: Please specify an application to open"])
        }
        break
      case "clear":
        setOutput([])
        break
      default:
        setOutput([...output, "> " + command, `Command not found: ${cmd}`])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCommand(input)
    setInput("")
  }

  return (
    <div className="bg-black text-green-500 p-4 h-full font-mono">
      <div className="mb-4 overflow-y-auto h-[calc(100%-2rem)]">
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <span className="mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-black text-green-500 w-full outline-none"
          autoFocus
        />
      </form>
    </div>
  )
}

