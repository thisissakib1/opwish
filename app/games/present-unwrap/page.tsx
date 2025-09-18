"use client"

import { useState } from "react"
import Link from "next/link"
import { BackgroundMusic } from "@/components/background-music"
import { Button } from "@/components/ui/button"
import { GameNavigation } from "@/components/game-navigation"

interface Present {
  id: string
  x: number
  y: number
  isUnwrapped: boolean
  surprise: string
  color: string
}

export default function PresentUnwrapGame() {
  const [presents, setPresents] = useState<Present[]>([])
  const [score, setScore] = useState(0)
  const [unwrappedCount, setUnwrappedCount] = useState(0)

  const presentColors = ["🟥", "🟦", "🟩", "🟨", "🟪", "🟧"]
  const surprises = ["🎂", "🍰", "🧸", "🎈", "🌟", "💎", "🦄", "🌈", "🎵", "💖", "🎪", "🎭"]

  const generatePresents = () => {
    const newPresents: Present[] = []
    for (let i = 0; i < 12; i++) {
      newPresents.push({
        id: i.toString(),
        x: (i % 4) * 25 + 12.5, // 4 columns
        y: Math.floor(i / 4) * 30 + 20, // 3 rows
        isUnwrapped: false,
        surprise: surprises[Math.floor(Math.random() * surprises.length)],
        color: presentColors[Math.floor(Math.random() * presentColors.length)],
      })
    }
    setPresents(newPresents)
    setScore(0)
    setUnwrappedCount(0)
  }

  const unwrapPresent = (presentId: string) => {
    setPresents((prev) =>
      prev.map((present) => (present.id === presentId ? { ...present, isUnwrapped: true } : present)),
    )
    setScore((prev) => prev + 20)
    setUnwrappedCount((prev) => prev + 1)

    // Play unwrap sound
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )
    audio.play().catch(() => {})
  }

  const resetGame = () => {
    setPresents([])
    setScore(0)
    setUnwrappedCount(0)
  }

  const allUnwrapped = presents.length > 0 && unwrappedCount === presents.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 relative overflow-hidden">
      <BackgroundMusic autoPlay />
      <GameNavigation />

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
              ← Back to Birthday
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              🎁 Present Unwrapping Game
            </h1>
            <div className="flex gap-4 mt-2 justify-center">
              <p className="text-lg text-muted-foreground">Score: {score}</p>
              <p className="text-lg text-muted-foreground">
                Unwrapped: {unwrappedCount}/{presents.length}
              </p>
            </div>
          </div>
          <Button onClick={resetGame} variant="outline" className="bg-white/80 backdrop-blur-sm">
            Reset
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col items-center px-4">
        {presents.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Unwrap Some Presents?</h2>
            <p className="text-muted-foreground mb-6">
              Click on each present to unwrap it and discover the surprise inside!
            </p>
            <Button
              onClick={generatePresents}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-3"
            >
              Generate Presents
            </Button>
          </div>
        )}

        {/* Presents Grid */}
        {presents.length > 0 && (
          <div className="relative w-full max-w-4xl h-96 mb-8">
            {presents.map((present) => (
              <div
                key={present.id}
                onClick={() => !present.isUnwrapped && unwrapPresent(present.id)}
                className={`absolute cursor-pointer transform transition-all duration-500 ${
                  present.isUnwrapped ? "scale-110" : "hover:scale-105"
                }`}
                style={{
                  left: `${present.x}%`,
                  top: `${present.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {present.isUnwrapped ? (
                  <div className="text-6xl animate-bounce">{present.surprise}</div>
                ) : (
                  <div className="relative">
                    <div className="text-6xl">🎁</div>
                    <div
                      className="absolute inset-0 text-6xl opacity-80"
                      style={{ filter: `hue-rotate(${Math.random() * 360}deg)` }}
                    >
                      {present.color}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Completion Message */}
        {allUnwrapped && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center animate-bounce">
            <h2 className="text-3xl font-bold mb-4">🎉 All Presents Unwrapped! 🎉</h2>
            <p className="text-xl mb-4">Final Score: {score} points</p>
            <p className="text-muted-foreground mb-6">
              You discovered all the wonderful surprises! Happy Birthday Sanjida!
            </p>
            <Button
              onClick={generatePresents}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white mr-4"
            >
              Play Again
            </Button>
            <Link href="/">
              <Button variant="outline">Back to Birthday</Button>
            </Link>
          </div>
        )}

        {/* Instructions */}
        {presents.length > 0 && !allUnwrapped && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Click on the wrapped presents to unwrap them and discover the surprises inside!
            </p>
            <p className="text-sm text-muted-foreground mt-2">Each present gives you 20 points!</p>
          </div>
        )}
      </div>
    </div>
  )
}
