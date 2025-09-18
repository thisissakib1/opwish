"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function GameNavigation() {
  const pathname = usePathname()

  const games = [
    { href: "/games/snack-collector", label: "🪙 26-Coins", active: pathname === "/games/snack-collector" },
    { href: "/games/cute-snacks", label: "🍪 Snacks", active: pathname === "/games/cute-snacks" },
    { href: "/games/present-unwrap", label: "🎁 Presents", active: pathname === "/games/present-unwrap" },
    { href: "/games/couple-fighting", label: "💑 Couple Fight", active: pathname === "/games/couple-fighting" },
    { href: "/games/memory-match", label: "🧠 Memory", active: pathname === "/games/memory-match" },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full bg-white/80 hover:bg-white/90">
            🏠 Home
          </Button>
        </Link>
        {games.map((game) => (
          <Link key={game.href} href={game.href}>
            <Button
              variant={game.active ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${
                game.active
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "bg-white/80 hover:bg-white/90"
              }`}
            >
              {game.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
