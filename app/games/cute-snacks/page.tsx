"use client"

import { useState, useEffect } from "react"
import { GameNavigation } from "@/components/game-navigation"
import { Button } from "@/components/ui/button"

interface Pet {
  name: string
  happiness: number
  hunger: number
  energy: number
  cleanliness: number
  age: number
  mood: string
  emoji: string
}

interface Activity {
  id: string
  name: string
  emoji: string
  effect: {
    happiness?: number
    hunger?: number
    energy?: number
    cleanliness?: number
  }
  cost: number
  cooldown: number
}

export default function CutePetCareGame() {
  const [gameActive, setGameActive] = useState(false)
  const [coins, setCoins] = useState(100)
  const [pet, setPet] = useState<Pet>({
    name: "Birthday Buddy",
    happiness: 80,
    hunger: 70,
    energy: 90,
    cleanliness: 85,
    age: 0,
    mood: "happy",
    emoji: "🐱",
  })
  const [activities, setActivities] = useState<Activity[]>([
    { id: "feed", name: "Feed", emoji: "🍎", effect: { hunger: 30, happiness: 10 }, cost: 10, cooldown: 0 },
    { id: "play", name: "Play", emoji: "🎾", effect: { happiness: 25, energy: -15 }, cost: 5, cooldown: 0 },
    { id: "sleep", name: "Sleep", emoji: "😴", effect: { energy: 40, happiness: 5 }, cost: 0, cooldown: 0 },
    { id: "wash", name: "Wash", emoji: "🛁", effect: { cleanliness: 35, happiness: 15 }, cost: 15, cooldown: 0 },
    { id: "treat", name: "Birthday Treat", emoji: "🎂", effect: { happiness: 40, hunger: 20 }, cost: 25, cooldown: 0 },
    { id: "party", name: "Mini Party", emoji: "🎉", effect: { happiness: 50, energy: -10 }, cost: 50, cooldown: 0 },
  ])
  const [gameTime, setGameTime] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([])

  useEffect(() => {
    const avgStat = (pet.happiness + pet.hunger + pet.energy + pet.cleanliness) / 4

    if (avgStat >= 80) {
      setPet((prev) => ({ ...prev, mood: "ecstatic", emoji: "😸" }))
    } else if (avgStat >= 60) {
      setPet((prev) => ({ ...prev, mood: "happy", emoji: "😊" }))
    } else if (avgStat >= 40) {
      setPet((prev) => ({ ...prev, mood: "okay", emoji: "😐" }))
    } else if (avgStat >= 20) {
      setPet((prev) => ({ ...prev, mood: "sad", emoji: "😢" }))
    } else {
      setPet((prev) => ({ ...prev, mood: "very sad", emoji: "😭" }))
    }
  }, [pet.happiness, pet.hunger, pet.energy, pet.cleanliness])

  useEffect(() => {
    if (!gameActive) return

    const gameInterval = setInterval(() => {
      setGameTime((prev) => prev + 1)

      // Gradual stat decay
      setPet((prev) => ({
        ...prev,
        happiness: Math.max(0, prev.happiness - 1),
        hunger: Math.max(0, prev.hunger - 2),
        energy: Math.max(0, prev.energy - 1),
        cleanliness: Math.max(0, prev.cleanliness - 1),
        age: prev.age + 0.1,
      }))

      // Earn coins over time
      if (gameTime % 10 === 0) {
        setCoins((prev) => prev + 5)
      }

      // Activity cooldown reduction
      setActivities((prev) =>
        prev.map((activity) => ({
          ...activity,
          cooldown: Math.max(0, activity.cooldown - 1),
        })),
      )
    }, 1000)

    return () => clearInterval(gameInterval)
  }, [gameActive, gameTime])

  useEffect(() => {
    const newAchievements: string[] = []

    if (pet.happiness >= 100 && !achievements.includes("happiness-master")) {
      newAchievements.push("happiness-master")
    }
    if (gameTime >= 300 && !achievements.includes("time-keeper")) {
      newAchievements.push("time-keeper")
    }
    if (coins >= 500 && !achievements.includes("coin-collector")) {
      newAchievements.push("coin-collector")
    }
    if (pet.age >= 10 && !achievements.includes("pet-parent")) {
      newAchievements.push("pet-parent")
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements])
      createParticles(400, 300, "🏆")
    }
  }, [pet.happiness, gameTime, coins, pet.age, achievements])

  const createParticles = (x: number, y: number, emoji: string) => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * 100 - 50,
      y: y + Math.random() * 100 - 50,
      emoji,
    }))
    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)))
    }, 2000)
  }

  const performActivity = (activity: Activity) => {
    if (activity.cooldown > 0 || coins < activity.cost) return

    setCoins((prev) => prev - activity.cost)

    setPet((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + (activity.effect.happiness || 0)),
      hunger: Math.min(100, prev.hunger + (activity.effect.hunger || 0)),
      energy: Math.min(100, prev.energy + (activity.effect.energy || 0)),
      cleanliness: Math.min(100, prev.cleanliness + (activity.effect.cleanliness || 0)),
    }))

    setActivities((prev) => prev.map((a) => (a.id === activity.id ? { ...a, cooldown: 5 } : a)))

    createParticles(400, 300, activity.emoji)
  }

  const startGame = () => {
    setGameActive(true)
    setGameTime(0)
    setCoins(100)
    setPet({
      name: "Birthday Buddy",
      happiness: 80,
      hunger: 70,
      energy: 90,
      cleanliness: 85,
      age: 0,
      mood: "happy",
      emoji: "🐱",
    })
    setAchievements([])
    setParticles([])
  }

  const getStatColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-yellow-600"
    if (value >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getStatBg = (value: number) => {
    if (value >= 80) return "bg-green-500"
    if (value >= 60) return "bg-yellow-500"
    if (value >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">🪙 {coins}</div>
              <div className="text-sm text-muted-foreground">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ⏰ {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">🏆 {achievements.length}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-[calc(100vh-120px)] overflow-hidden pt-20">
        {!gameActive ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md">
              <div className="text-6xl mb-4">🐱🎂</div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                Pet Care Adventure
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Take care of your adorable birthday pet! Feed, play, and keep them happy to earn achievements!
              </p>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-3"
              >
                Start Caring! 🐾
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            {/* Pet Display */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-6 text-center shadow-xl">
              <div className="text-8xl mb-4 animate-bounce">{pet.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
              <p className="text-lg text-gray-600 mb-4">
                Feeling {pet.mood} • Age: {pet.age.toFixed(1)}
              </p>

              {/* Pet Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { name: "Happiness", value: pet.happiness, emoji: "😊" },
                  { name: "Hunger", value: pet.hunger, emoji: "🍎" },
                  { name: "Energy", value: pet.energy, emoji: "⚡" },
                  { name: "Cleanliness", value: pet.cleanliness, emoji: "✨" },
                ].map((stat) => (
                  <div key={stat.name} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-xl">{stat.emoji}</span>
                      <span className={`font-bold ${getStatColor(stat.value)}`}>{stat.value.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getStatBg(stat.value)}`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {activities.map((activity) => (
                <Button
                  key={activity.id}
                  onClick={() => performActivity(activity)}
                  disabled={activity.cooldown > 0 || coins < activity.cost}
                  className="flex flex-col items-center p-4 h-auto bg-white/80 hover:bg-white/90 text-gray-800 border-2 border-purple-200 hover:border-purple-300 disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">{activity.emoji}</div>
                  <div className="font-semibold">{activity.name}</div>
                  <div className="text-sm text-gray-600">
                    {activity.cost > 0 && `${activity.cost} coins`}
                    {activity.cooldown > 0 && ` (${activity.cooldown}s)`}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-4xl animate-ping pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              animationDuration: "2s",
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      <GameNavigation />
    </div>
  )
}
