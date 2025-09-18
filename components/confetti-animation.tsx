"use client"

import { useEffect, useState } from "react"

interface ConfettiAnimationProps {
  isActive: boolean
}

export function ConfettiAnimation({ isActive }: ConfettiAnimationProps) {
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{
      id: number
      color: string
      left: number
      delay: number
      size: number
    }>
  >([])

  useEffect(() => {
    if (isActive) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: [
          "bg-pink-400",
          "bg-purple-400",
          "bg-blue-400",
          "bg-green-400",
          "bg-yellow-400",
          "bg-red-400",
          "bg-indigo-400",
          "bg-orange-400",
        ][Math.floor(Math.random() * 8)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 8 + 4,
      }))
      setConfettiPieces(pieces)

      // Clear confetti after animation
      const timer = setTimeout(() => {
        setConfettiPieces([])
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!isActive || confettiPieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute confetti ${piece.color} rounded-sm opacity-80`}
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
