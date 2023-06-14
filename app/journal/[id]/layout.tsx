"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { GeistProvider, Tree } from "@geist-ui/core"
import { Menu, XCircle } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [showTree, setShowTree] = React.useState(false)
  const [dates, setDates] = React.useState(() => {
    if(typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("dates") ?? "null")
    }
  })

  {/* @ts-ignore */}
  const files = dates.map((name) => {
    const currentDate = new Date(name * 1000)
    // console.log(currentDate)
    const day = currentDate.getDate()
    const month = currentDate.toLocaleString("default", { month: "long" })
    const year = currentDate.getFullYear()
    const dateString = `${month} ${day}, ${year}`
    return {
      type: "file",
      name: dateString,
    }
  })

  const handler = (path:any) => {
    const date = new Date(path)
    const epochMilliseconds = date.getTime()
    const epochSeconds = Math.floor(epochMilliseconds / 1000)
    // console.log(epochSeconds)
    router.push(`/journal/${epochSeconds}`)
  }

  return (
    <div className="flex min-h-[100vh]">
      <GeistProvider themeType="dark">
        <div className="flex flex-col">
          <button
            className="text-foreground justify-start items-start flex md:hidden fixed p-2.5 m-2.5 bg-black rounded-xl"
            onClick={() => setShowTree(!showTree)}
          >
            <Menu />
          </button>
          <div
            className={`tree-container md:!tree-slide-in ${
              showTree ? "tree-slide-in" : "tree-slide-out"
            }`}
          >
            {/* @ts-ignore */}
            <Tree onClick={handler} className="!pl-0" value={files} />
            <button
              className="p-2.5 mt-2 bg-black rounded-xl w-full flex justify-center text-sm"
              onClick={() => {
                localStorage.clear()
                router.push("/")
              }
              }
            >
              <div className="flex gap-2 items-center">
                <XCircle color="red" size={17} />
                <div className="whitespace-pre">Clear All Data</div>
              </div>
            </button>
            <button
              className="text-foreground md:hidden p-2.5 mt-2 bg-black rounded-xl w-full flex justify-center"
              onClick={() => setShowTree(!showTree)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </GeistProvider>
      <main className="dark:bg-black bg-gray-100 w-full">{children}</main>
    </div>
  )
}
