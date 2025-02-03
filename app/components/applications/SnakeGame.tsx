import { useState, useEffect, useCallback } from "react"

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const INITIAL_DIRECTION = { x: 1, y: 0 }

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)

  const moveSnake = useCallback(() => {
    if (gameOver) return

    const newSnake = [...snake]
    const head = { ...newSnake[0] }

    head.x += direction.x
    head.y += direction.y

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true)
      return
    }

    if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true)
      return
    }

    newSnake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      })
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food, gameOver])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    const gameLoop = setInterval(moveSnake, 100)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      clearInterval(gameLoop)
    }
  }, [moveSnake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground">
      <div className="mb-4">Score: {snake.length - 1}</div>
      <div
        className="grid bg-gray-200 dark:bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: "1px",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y)
          const isFood = food.x === x && food.y === y

          return (
            <div
              key={index}
              className={`w-5 h-5 ${isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-gray-100 dark:bg-gray-700"}`}
            />
          )
        })}
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-red-500 mb-2">Game Over!</p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

