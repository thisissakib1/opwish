"use client"

import { useState } from "react"

interface BunnyCharacterProps {
  onHeartClick: () => void
  isHeartBroken: boolean
}

export function BunnyCharacter({ onHeartClick, isHeartBroken }: BunnyCharacterProps) {
  const [isFloating, setIsFloating] = useState(true)

  return (
    <div className="relative flex items-center justify-center">
      {/* Bunny Character */}
      <div className={`relative ${isFloating ? "float-animation" : ""}`}>
        {/* Bunny Body */}
        <div className="relative">
          {/* Main Body */}
          <div className="w-32 h-40 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full relative shadow-lg">
            {/* Bunny Ears */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-6 h-16 bg-gradient-to-t from-pink-200 to-pink-100 rounded-full transform -rotate-12 shadow-md">
                <div className="w-3 h-12 bg-gradient-to-t from-pink-300 to-pink-200 rounded-full mx-auto mt-2"></div>
              </div>
              <div className="w-6 h-16 bg-gradient-to-t from-pink-200 to-pink-100 rounded-full transform rotate-12 shadow-md">
                <div className="w-3 h-12 bg-gradient-to-t from-pink-300 to-pink-200 rounded-full mx-auto mt-2"></div>
              </div>
            </div>

            {/* Bunny Face */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              {/* Eyes */}
              <div className="flex gap-4 mb-2">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>

              {/* Nose */}
              <div className="w-2 h-2 bg-pink-400 rounded-full mx-auto mb-1"></div>

              {/* Mouth */}
              <div className="flex justify-center">
                <div className="w-1 h-2 bg-gray-600 rounded-full"></div>
              </div>

              {/* Whiskers */}
              <div className="absolute top-2 -left-8 w-6 h-0.5 bg-gray-600 rounded-full transform -rotate-12"></div>
              <div className="absolute top-4 -left-8 w-6 h-0.5 bg-gray-600 rounded-full transform rotate-12"></div>
              <div className="absolute top-2 -right-8 w-6 h-0.5 bg-gray-600 rounded-full transform rotate-12"></div>
              <div className="absolute top-4 -right-8 w-6 h-0.5 bg-gray-600 rounded-full transform -rotate-12"></div>
            </div>

            {/* Interactive Heart */}
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
              onDoubleClick={onHeartClick}
            >
              {!isHeartBroken ? (
                <div className="relative group">
                  <div className="w-12 h-12 bg-red-500 transform rotate-45 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold transform -rotate-45">
                    💖
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 heart-break">
                  <div className="w-6 h-8 bg-red-400 transform rotate-45 rounded-lg shadow-md">
                    <div className="absolute -top-2 -left-2 w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                  <div className="w-6 h-8 bg-red-400 transform rotate-45 rounded-lg shadow-md">
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Bunny Arms */}
            <div className="absolute top-16 -left-4 w-8 h-16 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full transform -rotate-12 shadow-md"></div>
            <div className="absolute top-16 -right-4 w-8 h-16 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full transform rotate-12 shadow-md"></div>
          </div>

          {/* Bunny Feet */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <div className="w-8 h-6 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full shadow-md"></div>
            <div className="w-8 h-6 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full shadow-md"></div>
          </div>
        </div>
      </div>

      {/* Instruction Text */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground font-medium">Double-click the heart! 💝</p>
      </div>
    </div>
  )
}
