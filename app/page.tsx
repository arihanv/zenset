"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash, Trash2 } from "lucide-react"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function IndexPage() {
  const [sentences, setSentences] = useState<any>([])
  const [input, setInput] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredIndex, setHoveredIndex] = useState(-1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getTimeElapsed = (timestamp: any) => {
    const elapsed = Math.floor(((currentTime as any) - timestamp) / 1000)
    if (elapsed < 0) return "0s ago"

    if (elapsed < 60) {
      return `${elapsed}s ago`
    } else if (elapsed < 3600) {
      const minutes = Math.floor(elapsed / 60)
      return `${minutes}m ago`
    } else {
      const hours = Math.floor(elapsed / 3600)
      return `${hours}hr ago`
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(-1)
  }

  const handleDelete = (index: number) => {
    setSentences((prev: any) => prev.filter((_: any, i: number) => i !== index))
    setHoveredIndex(-1)
  }

  return (
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto px-3 w-full flex max-w-[980px] flex-col gap-3 overflow-hidden">
        <div className="flex flex-col gap-1 border-b dark:border-gray-800 border-gray-200 py-1">
          <div className="tracking-tight font-bold text-xl">Prompt</div>
          <Input
            type="email"
            placeholder="Write your heart out..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSentences((prev: any) => [
                  { text: input, timestamp: new Date() },
                  ...prev,
                ])
                setInput("")
              }
            }}
            className="border-0 focus-visible:ring-0 hover:dark:bg-gray-900 hover:bg-gray-100 transition ease-in-out delay-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          {sentences.length !== 0 && (
            <>
              {sentences.map((s: any, i: number) => (
                <div
                  key={i}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave()}
                  className={`hover:dark:bg-gray-900 hover:bg-gray-100 rounded-md px-3 w-full py-2 gap-1 flex flex-wrap-reverse justify-between ${
                    Math.floor(((currentTime as any) - s.timestamp) / 1000) <
                    0.25
                      ? ""
                      : "blur-[2px] fade-in"
                  }`}
                >
                  <span className="whitespace-normal break-words overflow-hidden">
                    {s.text}
                  </span>
                  {hoveredIndex === i && (
                    <span className="text-xs text-gray-400 flex items-center gap-2 justify-center whitespace-pre">
                      {getTimeElapsed(s.timestamp)}
                      <button
                        className="text-gray-400"
                        onClick={() => handleDelete(i)}
                      >
                        <Trash size={17} />
                      </button>
                      {/* {s.timestamp.toLocaleTimeString()} */}
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
