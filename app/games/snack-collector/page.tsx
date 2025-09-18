"use client"

import { useState, useEffect, useCallback } from "react"
import { GameNavigation } from "@/components/game-navigation"
import { Button } from "@/components/ui/button"

interface Snack {
  id: number
  x: number
  y: number
  emoji: string
  points: number
  speed: number
  rotation: number
  rotationSpeed: number
}

interface Coin {
  id: number
  x: number
  y: number
  collected: boolean
}

interface PowerUp {
  id: number
  x: number
  y: number
  type: "double" | "magnet" | "slow"
  emoji: string
}

export default function SnackCollectorGame() {
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [gameCoins, setGameCoins] = useState<Coin[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [playerX, setPlayerX] = useState(50)
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null)
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0)
  const [combo, setCombo] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([])

  const snackTypes = [
    { emoji: "🍪", points: 10 },
    { emoji: "🧁", points: 15 },
    { emoji: "🍰", points: 20 },
    { emoji: "🍩", points: 25 },
    { emoji: "🎂", points: 30 },
    { emoji: "🍭", points: 12 },
    { emoji: "🍬", points: 8 },
    { emoji: "🧸", points: 50 }, // Special birthday bear
  ]

  const powerUpTypes = [
    { type: "double" as const, emoji: "⭐", duration: 10000 },
    { type: "magnet" as const, emoji: "🧲", duration: 8000 },
    { type: "slow" as const, emoji: "⏰", duration: 12000 },
  ]

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCoins(0)
    setTimeLeft(60)
    setSnacks([])
    setGameCoins([])
    setPowerUps([])
    setPlayerX(50)
    setActivePowerUp(null)
    setCombo(0)
    setParticles([])
  }

  const endGame = () => {
    setGameActive(false)
    setActivePowerUp(null)
    setPowerUpTimeLeft(0)
  }

  // Generate 26-themed coins in formation
  const generate26Coins = useCallback(() => {
    const newCoins: Coin[] = []
    let id = 0

    // Create "26" pattern with coins
    const pattern = [
      // "2" pattern
      [2, 1],
      [3, 1],
      [4, 1],
      [4, 2],
      [4, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [2, 4],
      [2, 5],
      [2, 5],
      [3, 5],
      [4, 5],

      // "6" pattern (offset by 6 units)
      [8, 1],
      [9, 1],
      [10, 1],
      [8, 2],
      [8, 3],
      [8, 3],
      [9, 3],
      [10, 3],
      [8, 4],
      [10, 4],
      [8, 5],
      [9, 5],
      [10, 5],
    ]

    pattern.forEach(([x, y]) => {
      newCoins.push({
        id: id++,
        x: x * 8 + 20, // Scale and offset
        y: y * 8 + 20,
        collected: false,
      })
    })

    setGameCoins(newCoins)
  }, [])

  // Spawn snacks
  useEffect(() => {
    if (!gameActive) return

    const spawnSnack = () => {
      const snackType = snackTypes[Math.floor(Math.random() * snackTypes.length)]
      const newSnack: Snack = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        y: -5,
        emoji: snackType.emoji,
        points: snackType.points,
        speed: activePowerUp === "slow" ? 0.5 : Math.random() * 2 + 1,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }
      setSnacks((prev) => [...prev, newSnack])
    }

    const interval = setInterval(spawnSnack, activePowerUp === "slow" ? 800 : 400)
    return () => clearInterval(interval)
  }, [gameActive, activePowerUp])

  // Spawn power-ups
  useEffect(() => {
    if (!gameActive) return

    const spawnPowerUp = () => {
      if (Math.random() < 0.3) {
        const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
        const newPowerUp: PowerUp = {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: -5,
          type: powerUpType.type,
          emoji: powerUpType.emoji,
        }
        setPowerUps((prev) => [...prev, newPowerUp])
      }
    }

    const interval = setInterval(spawnPowerUp, 3000)
    return () => clearInterval(interval)
  }, [gameActive])

  // Generate 26 coins periodically
  useEffect(() => {
    if (!gameActive) return

    const interval = setInterval(() => {
      if (gameCoins.length === 0 || gameCoins.every((coin) => coin.collected)) {
        generate26Coins()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [gameActive, gameCoins, generate26Coins])

  // Game timer
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, timeLeft])

  // Power-up timer
  useEffect(() => {
    if (powerUpTimeLeft <= 0) {
      setActivePowerUp(null)
      return
    }

    const timer = setInterval(() => {
      setPowerUpTimeLeft((prev) => prev - 100)
    }, 100)

    return () => clearInterval(timer)
  }, [powerUpTimeLeft])

  // Move snacks and power-ups
  useEffect(() => {
    if (!gameActive) return

    const moveItems = () => {
      setSnacks((prev) =>
        prev
          .map((snack) => ({
            ...snack,
            y: snack.y + snack.speed,
            rotation: snack.rotation + snack.rotationSpeed,
          }))
          .filter((snack) => snack.y < 105),
      )

      setPowerUps((prev) =>
        prev.map((powerUp) => ({ ...powerUp, y: powerUp.y + 1.5 })).filter((powerUp) => powerUp.y < 105),
      )
    }

    const interval = setInterval(moveItems, 50)
    return () => clearInterval(interval)
  }, [gameActive])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameActive) return
      const rect = document.getElementById("game-area")?.getBoundingClientRect()
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100
        setPlayerX(Math.max(5, Math.min(95, x)))
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [gameActive])

  // Collision detection
  useEffect(() => {
    if (!gameActive) return

    const checkCollisions = () => {
      // Snack collisions
      setSnacks((prev) =>
        prev.filter((snack) => {
          const distance = Math.sqrt(Math.pow(snack.x - playerX, 2) + Math.pow(snack.y - 85, 2))

          if (distance < 8 || (activePowerUp === "magnet" && distance < 15)) {
            let points = snack.points
            if (activePowerUp === "double") points *= 2

            setScore((s) => s + points)
            setCombo((c) => c + 1)

            // Add particle effect
            setParticles((p) => [
              ...p,
              {
                id: Date.now() + Math.random(),
                x: snack.x,
                y: snack.y,
                emoji: snack.emoji,
              },
            ])

            return false
          }
          return true
        }),
      )

      // Power-up collisions
      setPowerUps((prev) =>
        prev.filter((powerUp) => {
          const distance = Math.sqrt(Math.pow(powerUp.x - playerX, 2) + Math.pow(powerUp.y - 85, 2))

          if (distance < 8) {
            setActivePowerUp(powerUp.type)
            setPowerUpTimeLeft(powerUpTypes.find((p) => p.type === powerUp.type)?.duration || 5000)
            return false
          }
          return true
        }),
      )

      // Coin collisions
      setGameCoins((prev) =>
        prev.map((coin) => {
          if (coin.collected) return coin

          const distance = Math.sqrt(Math.pow(coin.x - playerX, 2) + Math.pow(coin.y - 85, 2))

          if (distance < 6) {
            setCoins((c) => c + 1)
            setScore((s) => s + 100) // Bonus points for coins
            return { ...coin, collected: true }
          }
          return coin
        }),
      )
    }

    const interval = setInterval(checkCollisions, 50)
    return () => clearInterval(interval)
  }, [gameActive, playerX, activePowerUp])

  // Clear particles
  useEffect(() => {
    const clearParticles = () => {
      setParticles((prev) =>
        prev.filter((particle) => {
          return Date.now() - particle.id < 1000
        }),
      )
    }

    const interval = setInterval(clearParticles, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Background Number 26 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[15rem] font-bold text-pink-100/20 select-none">26</div>
      </div>

      {/* Game UI */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-lg font-bold text-purple-600">Score: {score}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-lg font-bold text-yellow-600">26 Coins: {coins}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-lg font-bold text-red-600">Time: {timeLeft}s</span>
            </div>
            {combo > 0 && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-4 py-2">
                <span className="text-lg font-bold">Combo: {combo}</span>
              </div>
            )}
          </div>

          {activePowerUp && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-4 py-2">
              <span className="text-lg font-bold">
                {powerUpTypes.find((p) => p.type === activePowerUp)?.emoji} {activePowerUp.toUpperCase()} (
                {Math.ceil(powerUpTimeLeft / 1000)}s)
              </span>
            </div>
          )}
        </div>
      </div>

      <div id="game-area" className="relative h-[calc(100vh-120px)] overflow-hidden">
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                🍪 26-Coin Snack Collector 🍪
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Collect falling snacks and special 26-shaped coins!
                <br />
                Move your mouse to control the collector basket
              </p>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xl px-8 py-3"
              >
                Start Collecting! 🎂
              </Button>
            </div>
          </div>
        )}

        {gameActive && (
          <>
            {/* Player */}
            <div
              className="absolute bottom-4 w-16 h-16 text-4xl flex items-center justify-center transform -translate-x-1/2 transition-all duration-100"
              style={{ left: `${playerX}%` }}
            >
              🧺
            </div>

            {/* Snacks */}
            {snacks.map((snack) => (
              <div
                key={snack.id}
                className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
                style={{
                  left: `${snack.x}%`,
                  top: `${snack.y}%`,
                  transform: `translate(-50%, -50%) rotate(${snack.rotation}deg)`,
                }}
              >
                {snack.emoji}
              </div>
            ))}

            {/* Power-ups */}
            {powerUps.map((powerUp) => (
              <div
                key={powerUp.id}
                className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{ left: `${powerUp.x}%`, top: `${powerUp.y}%` }}
              >
                {powerUp.emoji}
              </div>
            ))}

            {/* 26-shaped coins */}
            {gameCoins.map((coin) => (
              <div
                key={coin.id}
                className={`absolute text-2xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  coin.collected ? "opacity-0 scale-150" : "animate-bounce"
                }`}
                style={{ left: `${coin.x}%`, top: `${coin.y}%` }}
              >
                🪙
              </div>
            ))}

            {/* Particles */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute text-2xl transform -translate-x-1/2 -translate-y-1/2 animate-ping"
                style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              >
                {particle.emoji}
              </div>
            ))}

            {/* Game Over */}
            {timeLeft === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                    🎉 Game Over! 🎉
                  </h3>
                  <p className="text-xl text-muted-foreground mb-2">Final Score: {score}</p>
                  <p className="text-xl text-muted-foreground mb-6">26 Coins Collected: {coins}</p>
                  <Button
                    onClick={startGame}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    Play Again! 🎂
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <GameNavigation />
    </div>
  )
}
