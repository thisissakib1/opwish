"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GameNavigation } from "@/components/game-navigation"
import { BackgroundMusic } from "@/components/background-music"

const emojis = ["🎂", "🎈", "🎁", "🎉", "🎊", "🍰", "🎀", "🌟"]
const gameEmojis = [...emojis, ...emojis] // Duplicate for pairs

export default function MemoryMatchGame() {
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize game
  const initializeGame = () => {
    const shuffled = gameEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffled)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setGameWon(false)
    setTimeLeft(60)
    setGameStarted(true)
  }

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameWon) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameStarted(false)
    }
  }, [timeLeft, gameStarted, gameWon])

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find((card) => card.id === first)
      const secondCard = cards.find((card) => card.id === second)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isMatched: true } : card)),
          )
          setMatches((prev) => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  // Check win condition
  useEffect(() => {
    if (matches === emojis.length && gameStarted) {
      setGameWon(true)
      setGameStarted(false)
    }
  }, [matches, gameStarted])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || !gameStarted) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))
    setFlippedCards((prev) => [...prev, cardId])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      <BackgroundMusic autoPlay />
      <GameNavigation />

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🎂</div>
        <div className="absolute top-20 right-20 text-4xl opacity-30 animate-pulse">🎈</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-25 animate-bounce delay-1000">🎁</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-20 animate-pulse delay-500">🎉</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4">
            🧠 Memory Match Game
          </h1>
          <p className="text-lg text-gray-600 mb-6">Find all the matching pairs of birthday items!</p>

          {!gameStarted && !gameWon && (
            <Button
              onClick={initializeGame}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎮 Start Game
            </Button>
          )}
        </div>

        {gameStarted && (
          <div className="flex justify-center gap-8 mb-6 text-lg font-semibold">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">⏰ Time: {timeLeft}s</div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">🎯 Moves: {moves}</div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
              ✨ Matches: {matches}/{emojis.length}
            </div>
          </div>
        )}

        {gameWon && (
          <div className="text-center mb-8 animate-bounce">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations! You Won! 🎉</h2>
            <p className="text-lg text-gray-600 mb-4">You completed the game in {moves} moves!</p>
            <Button
              onClick={initializeGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-full"
            >
              🔄 Play Again
            </Button>
          </div>
        )}

        {timeLeft === 0 && !gameWon && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-red-600 mb-4">⏰ Time's Up!</h2>
            <p className="text-lg text-gray-600 mb-4">
              You found {matches} out of {emojis.length} pairs!
            </p>
            <Button
              onClick={initializeGame}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-full"
            >
              🔄 Try Again
            </Button>
          </div>
        )}

        {cards.length > 0 && (
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {cards.map((card) => (
              <Card
                key={card.id}
                className={`aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  card.isFlipped || card.isMatched
                    ? "bg-gradient-to-br from-yellow-200 to-orange-200 shadow-lg"
                    : "bg-gradient-to-br from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300"
                } ${card.isMatched ? "ring-4 ring-green-400 animate-pulse" : ""}`}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "❓"}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
