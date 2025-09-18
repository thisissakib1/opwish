"use client"

import { useState } from "react"
import Link from "next/link"
import { BunnyCharacter } from "@/components/bunny-character"
import { ConfettiAnimation } from "@/components/confetti-animation"
import { BackgroundMusic } from "@/components/background-music"
import { Button } from "@/components/ui/button"

export default function BirthdayPage() {
  const [isHeartBroken, setIsHeartBroken] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSurprise, setShowSurprise] = useState(false)

  const handleHeartClick = () => {
    setShowSurprise(true)

    const audio = new Audio("https://www.soundjay.com/misc/sounds/happy-birthday-song.mp3")
    audio.play().catch((e) => console.log("Audio play failed:", e))

    setIsHeartBroken(true)
    setShowConfetti(true)
    setShowCelebration(true)

    // Reset heart after animation
    setTimeout(() => {
      setIsHeartBroken(false)
    }, 3000)

    // Stop confetti
    setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      <BackgroundMusic autoPlay={showSurprise} />

      {/* Background Number 26 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[20rem] font-bold text-pink-100/30 glow-text select-none">26</div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-pink-200/40 rounded-full float-animation"></div>
      <div
        className="absolute top-32 right-20 w-6 h-6 bg-purple-200/40 rounded-full float-animation"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-10 h-10 bg-blue-200/40 rounded-full float-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-40 right-10 w-7 h-7 bg-yellow-200/40 rounded-full float-animation"
        style={{ animationDelay: "0.5s" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {showSurprise && (
          <div className={`mb-12 ${showCelebration ? "bounce-animation" : ""}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 text-balance">
              Happy Birthday
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-6 text-balance">
              Sanjida Habib Promi
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium text-pretty">
              Celebrating 26 Beautiful Years
            </p>
          </div>
        )}

        {!showSurprise && (
          <div className="mb-12">
            <p className="text-2xl md:text-3xl text-muted-foreground font-medium text-pretty animate-pulse">
              Double-click the bunny's heart for a surprise! 💝
            </p>
          </div>
        )}

        {/* Bunny Character */}
        <div className="mb-8">
          <BunnyCharacter onHeartClick={handleHeartClick} isHeartBroken={isHeartBroken} />
        </div>

        {showSurprise && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/games/snack-collector">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                🪙 26-Coin Snack Collector
              </Button>
            </Link>
            <Link href="/games/cute-snacks">
              <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
                🍪 Cute Snacks Game
              </Button>
            </Link>
            <Link href="/games/present-unwrap">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                🎁 Present Unwrapping Game
              </Button>
            </Link>
            <Link href="/games/couple-fighting">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                💑 Couple Fighting Game
              </Button>
            </Link>
            <Link href="/games/memory-match">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                🧠 Memory Match Game
              </Button>
            </Link>
          </div>
        )}

        {/* Celebration Message */}
        {showCelebration && (
          <div className="mt-8 bounce-animation">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-pink-200/50">
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
                🎉 Surprise! 🎉
              </p>
              <p className="text-lg text-foreground/80">Wishing you joy, love, and endless happiness!</p>
            </div>
          </div>
        )}
      </div>

      {/* Confetti Animation */}
      <ConfettiAnimation isActive={showConfetti} />
    </div>
  )
}
