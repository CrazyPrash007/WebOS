import { useState } from "react"

function Square({ value, onClick }: { value: string | null; onClick: () => void }) {
  return (
    <button
      className="w-20 h-20 bg-secondary text-secondary-foreground border border-border text-4xl font-bold"
      onClick={onClick}
    >
      {value}
    </button>
  )
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i]) return
    const newSquares = squares.slice()
    newSquares[i] = xIsNext ? "X" : "O"
    setSquares(newSquares)
    setXIsNext(!xIsNext)
  }

  const winner = calculateWinner(squares)
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`

  return (
    <div className="flex flex-col items-center bg-background text-foreground p-4">
      <div className="mb-4 text-xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-1">
        {squares.map((square, i) => (
          <Square key={i} value={square} onClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

