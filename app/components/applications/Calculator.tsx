import { useState } from "react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")

  const handleClick = (value: string) => {
    setDisplay((prev) => (prev === "0" ? value : prev + value))
  }

  const handleClear = () => {
    setDisplay("0")
  }

  const handleCalculate = () => {
    try {
      setDisplay(eval(display).toString())
    } catch (error) {
      setDisplay("Error")
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-background text-foreground">
      <button onClick={handleClear} className="col-span-3 bg-destructive text-destructive-foreground p-2 rounded">
        C
      </button>
      <button onClick={() => handleClick("/")} className="bg-secondary text-secondary-foreground p-2 rounded">
        /
      </button>
      {[7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+"].map((item) => (
        <button
          key={item}
          onClick={() => handleClick(item.toString())}
          className="bg-secondary text-secondary-foreground p-2 rounded"
        >
          {item}
        </button>
      ))}
      <button
        onClick={() => handleClick("0")}
        className="col-span-2 bg-secondary text-secondary-foreground p-2 rounded"
      >
        0
      </button>
      <button onClick={() => handleClick(".")} className="bg-secondary text-secondary-foreground p-2 rounded">
        .
      </button>
      <button onClick={handleCalculate} className="bg-primary text-primary-foreground p-2 rounded">
        =
      </button>
      <div className="col-span-4 bg-card text-card-foreground p-2 text-right text-xl">{display}</div>
    </div>
  )
}

