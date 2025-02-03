import { useState } from "react"

export default function ScreenCapture() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const captureScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const video = document.createElement("video")
      video.srcObject = stream

      // Wait until the video metadata (dimensions) is loaded before playing it
      video.onloadedmetadata = async () => {
        video.play()

        // Wait for the video to be ready to play
        setTimeout(() => {
          const canvas = document.createElement("canvas")
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext("2d")

          if (ctx) {
            ctx.drawImage(video, 0, 0)

            const imageDataUrl = canvas.toDataURL("image/png")
            setCapturedImage(imageDataUrl)

            // Stop the stream after capturing
            stream.getTracks().forEach((track) => track.stop())
          }
        }, 100) // Small delay to ensure video is ready to render
      }

    } catch (error) {
      console.error("Error capturing screen:", error)
    }
  }

  return (
    <div className="p-4 bg-background text-foreground">
      <button onClick={captureScreen} className="bg-primary text-primary-foreground px-4 py-2 rounded mb-4">
        Capture Screen
      </button>
      {capturedImage && (
        <div>
          <h3 className="text-lg font-bold mb-2">Captured Image:</h3>
          <img src={capturedImage || "/placeholder.svg"} alt="Screen Capture" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  )
}

