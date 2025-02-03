import { useState } from "react"

export default function PrintManager() {
  const [queue, setQueue] = useState<string[]>([])

  const addToQueue = (document: string) => {
    setQueue([...queue, document])
  }

  const print = () => {
    if (queue.length > 0) {
      const [nextDoc, ...rest] = queue
      console.log(`Printing: ${nextDoc}`)
      setQueue(rest)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Print Queue</h2>
      <ul className="mb-4">
        {queue.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
      <button onClick={print} className="bg-blue-500 text-white px-4 py-2 rounded">
        Print Next
      </button>
    </div>
  )
}

