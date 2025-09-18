"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { BackgroundMusic } from "@/components/background-music"
import { GameNavigation } from "@/components/game-navigation"
import Link from "next/link"

export default function CoupleFightingGame() {
  const [player1Health, setPlayer1Health] = useState(100)
  const [player2Health, setPlayer2Health] = useState(100)
  const [player1Power, setPlayer1Power] = useState(0)
  const [player2Power, setPower2Power] = useState(0)
  const [gameState, setGameState] = useState<"playing" | "player1wins" | "player2wins">("playing")
  const [player1Attacking, setPlayer1Attacking] = useState(false)
  const [player2Attacking, setPlayer2Attacking] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  const player1Attack = () => {
    if (gameState !== "playing") return

    const damage = Math.floor(Math.random() * 20) + 10
    setPlayer2Health((prev) => Math.max(0, prev - damage))
    setPlayer1Power((prev) => Math.min(100, prev + 15))
    setPlayer1Attacking(true)
    playSound()

    setTimeout(() => setPlayer1Attacking(false), 300)
  }

  const player2Attack = () => {
    if (gameState !== "playing") return

    const damage = Math.floor(Math.random() * 20) + 10
    setPlayer1Health((prev) => Math.max(0, prev - damage))
    setPower2Power((prev) => Math.min(100, prev + 15))
    setPlayer2Attacking(true)
    playSound()

    setTimeout(() => setPlayer2Attacking(false), 300)
  }

  const player1SpecialAttack = () => {
    if (gameState !== "playing" || player1Power < 50) return

    const damage = Math.floor(Math.random() * 35) + 25
    setPlayer2Health((prev) => Math.max(0, prev - damage))
    setPlayer1Power(0)
    setPlayer1Attacking(true)
    playSound()

    setTimeout(() => setPlayer1Attacking(false), 500)
  }

  const player2SpecialAttack = () => {
    if (gameState !== "playing" || player2Power < 50) return

    const damage = Math.floor(Math.random() * 35) + 25
    setPlayer1Health((prev) => Math.max(0, prev - damage))
    setPower2Power(0)
    setPlayer2Attacking(true)
    playSound()

    setTimeout(() => setPlayer2Attacking(false), 500)
  }

  const resetGame = () => {
    setPlayer1Health(100)
    setPlayer2Health(100)
    setPlayer1Power(0)
    setPower2Power(0)
    setGameState("playing")
    setPlayer1Attacking(false)
    setPlayer2Attacking(false)
  }

  useEffect(() => {
    if (player1Health <= 0) {
      setGameState("player2wins")
    } else if (player2Health <= 0) {
      setGameState("player1wins")
    }
  }, [player1Health, player2Health])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      <BackgroundMusic />

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-pink-300 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-white/20 backdrop-blur-sm">
        <Link href="/">
          <Button variant="outline" className="bg-white/50 hover:bg-white/70">
            ← Back to Birthday
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          💑 Couple Fighting Game
        </h1>
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          Reset Game
        </Button>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">How to Play</h2>
            <div className="text-gray-700 space-y-2 text-sm">
              <p>🥊 Click "Attack" buttons to fight!</p>
              <p>⚡ Build power to use special attacks</p>
              <p>❤️ Reduce opponent's health to 0 to win</p>
              <p>🎂 It's all about birthday fun!</p>
            </div>
            <Button
              onClick={() => setShowInstructions(false)}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              Let's Fight! 💪
            </Button>
          </div>
        </div>
      )}

      {/* Game Arena */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        {/* Game Result */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="text-6xl mb-4">{gameState === "player1wins" ? "👑" : "🏆"}</div>
              <h2 className="text-3xl font-bold text-purple-600 mb-4">
                {gameState === "player1wins" ? "Player 1 Wins!" : "Player 2 Wins!"}
              </h2>
              <p className="text-gray-600 mb-6">Great birthday battle!</p>
              <Button onClick={resetGame} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                Play Again 🎉
              </Button>
            </div>
          </div>
        )}

        {/* Fighting Arena */}
        <div className="w-full max-w-4xl mx-auto">
          {/* VS Badge */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-2xl font-bold shadow-lg">
              VS
            </div>
          </div>

          {/* Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Player 1 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div
                  className={`text-8xl transition-transform duration-300 ${player1Attacking ? "scale-125 animate-bounce" : ""}`}
                >
                  👨‍💼
                </div>
                {player1Attacking && <div className="absolute -top-4 -right-4 text-2xl animate-ping">💥</div>}
              </div>

              <h3 className="text-xl font-bold text-purple-600 mb-2">Opurbo</h3>

              {/* Health Bar */}
              <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${player1Health}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">Health: {player1Health}/100</p>

              {/* Power Bar */}
              <div className="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${player1Power}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mb-4">Power: {player1Power}/100</p>

              {/* Attack Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={player1Attack}
                  disabled={gameState !== "playing"}
                  className="w-full bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white"
                >
                  🥊 Attack
                </Button>
                <Button
                  onClick={player1SpecialAttack}
                  disabled={gameState !== "playing" || player1Power < 50}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
                >
                  ⚡ Special Attack (50 power)
                </Button>
              </div>
            </div>

            {/* Player 2 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div
                  className={`text-8xl transition-transform duration-300 ${player2Attacking ? "scale-125 animate-bounce" : ""}`}
                >
                  👩‍💼
                </div>
                {player2Attacking && <div className="absolute -top-4 -left-4 text-2xl animate-ping">💥</div>}
              </div>

              <h3 className="text-xl font-bold text-pink-600 mb-2">Promi</h3>

              {/* Health Bar */}
              <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${player2Health}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">Health: {player2Health}/100</p>

              {/* Power Bar */}
              <div className="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${player2Power}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mb-4">Power: {player2Power}/100</p>

              {/* Attack Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={player2Attack}
                  disabled={gameState !== "playing"}
                  className="w-full bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white"
                >
                  🥊 Attack
                </Button>
                <Button
                  onClick={player2SpecialAttack}
                  disabled={gameState !== "playing" || player2Power < 50}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
                >
                  ⚡ Special Attack (50 power)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio */}
      <audio ref={audioRef} preload="auto">
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
      </audio>

      <GameNavigation />
    </div>
  )
}
