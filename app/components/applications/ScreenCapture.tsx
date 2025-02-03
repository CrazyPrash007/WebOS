import { useState, useRef, useEffect } from "react"
import { Camera, Video } from "lucide-react"
import html2canvas from "html2canvas"

type Selection = {
  startX: number
  startY: number
  dx: number
  dy: number
  isSelecting: boolean
}

export default function ScreenCapture() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [selection, setSelection] = useState<Selection>({
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    isSelecting: false
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setSelection({
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      isSelecting: true
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selection.isSelecting) return
    
    setSelection(prev => ({
      ...prev,
      dx: e.clientX - prev.startX,
      dy: e.clientY - prev.startY
    }))
  }

  const handleMouseUp = async () => {
    setSelection(prev => ({ ...prev, isSelecting: false }))
  }

  const captureSelectedArea = async () => {
    if (!containerRef.current || selection.dx <= 0 || selection.dy <= 0) return

    const canvas = await html2canvas(containerRef.current, {
      x: selection.startX,
      y: selection.startY,
      width: selection.dx,
      height: selection.dy,
      useCORS: true
    })

    const imageDataUrl = canvas.toDataURL("image/png")
    setCapturedImage(imageDataUrl)

    const link = document.createElement("a")
    link.href = imageDataUrl
    link.download = "selected-area.png"
    link.click()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: {
          width: { ideal: 3840 },
          height: { ideal: 2160 }
        }, 
        audio: true 
      })
      
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)

      const chunks: Blob[] = []
      recorder.ondataavailable = e => chunks.push(e.data)
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "screen-recording.webm"
        link.click()
        setIsRecording(false)
      }

      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Screen recording error:", error)
      alert("Failed to start recording. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div 
      className="relative w-full h-screen bg-background text-foreground"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}
    >
      {/* Selection overlay */}
      {selection.isSelecting && (
        <div
          className="absolute border-2 border-primary bg-primary/20"
          style={{
            left: selection.startX,
            top: selection.startY,
            width: selection.dx,
            height: selection.dy,
          }}
        />
      )}

      {/* Control panel */}
      <div className="fixed top-4 left-4 flex gap-4 z-50">
        <button
          onClick={captureSelectedArea}
          className="bg-primary text-primary-foreground px-4 py-2 rounded flex items-center gap-2"
        >
          <Camera size={18} />
          Capture Area
        </button>
        
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-primary text-primary-foreground px-4 py-2 rounded flex items-center gap-2"
          >
            <Video size={18} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded flex items-center gap-2"
          >
            <Video size={18} />
            Stop Recording
          </button>
        )}
      </div>

      {/* Preview */}
      {capturedImage && (
        <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">Preview:</h3>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="max-w-[300px] h-auto border rounded"
          />
        </div>
      )}
    </div>
  )
}

