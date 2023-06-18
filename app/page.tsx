"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  Frown,
  Meh,
  PlusCircle,
  Smile,
  Star,
  Trash,
  Trash2,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

var Sentiment = require("sentiment")
var sentiment = new Sentiment()

export default function IndexPage() {
  const [sentences, setSentences] = useState<any>([])
  const [input, setInput] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [promptIndex, setPromptIndex] = useState(0)
  const [reward, setReward] = useState<any>(null)
  const [redeemed, setRedeemed] = useState<any>(null)
  const [words, setWords] = useState(0)
  const [address, setAddress] = useState("")
  const [mood, setMood] = useState<number | null>(null)
  useEffect(() => setWords(Number(localStorage.getItem("wordCount")) ?? "null"))

  const [fullData, setFullData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(`${getDateEpoch()}`)
      let dates = localStorage.getItem("dates")
      let parsedDates

      if (dates) {
        parsedDates = JSON.parse(dates)
        if (!Array.isArray(parsedDates)) {
          parsedDates = []
        }
      } else {
        parsedDates = []
      }

      const epochValue = getDateEpoch()
      if (!parsedDates.includes(epochValue)) {
        parsedDates.push(epochValue)
      }

      localStorage.setItem("dates", JSON.stringify(parsedDates))
      return savedData ? JSON.parse(savedData) : {}
    }
  })
  const [prompts, setPrompts] = useState<string[]>([])
  useEffect(() => {
    if (mood === 0) {
      setPrompts([
        "What is one small thing that provided you comfort or solace today, even in the midst of sadness?",
        "Describe an act of kindness or support that someone showed you during a difficult time.",
        "What is one positive thought or affirmation that helps you stay hopeful despite feeling sad?",
      ])
    } else if (mood === 1) {
      setPrompts([
        "What is one thing that brought a subtle sense of contentment or satisfaction to your day today?",
        "Describe a moment of peace or calmness that you experienced recently, even if everything else seemed average.",
        "What is one small accomplishment or task you completed today that made you feel a sense of accomplishment, however minor?",
      ])
    } else {
      setPrompts([
        "What is one amazing thing that made you smile or filled you with joy today?",
        "Describe a moment of pure happiness or excitement that you experienced recently.",
        "What are three things you feel grateful for in your life right now?",
      ])
    }
  }, [mood])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  function getDateEpoch() {
    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.toLocaleString("default", { month: "long" })
    const year = currentDate.getFullYear()
    const dateString = `${month} ${day}, ${year}`
    const date = new Date(dateString)
    const epochMilliseconds = date.getTime()
    const epochSeconds = Math.floor(epochMilliseconds / 1000)
    return epochSeconds
  }

  useEffect(() => {
    const savedData = localStorage.getItem(`${getDateEpoch()}`)
    const epochSeconds = getDateEpoch()
    // console.log(dateString)
    // localStorage.clear();
    // console.log(localStorage.getItem("dates"))
    // console.log(savedData)
    if (savedData) {
      // console.log(savedData[epochSeconds])
      setFullData(JSON.parse(savedData))
      // setFullData(JSON.parse(savedData[epochSeconds]["newData"][epochSeconds]))
    }
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

  useEffect(() => {
    if (words === undefined || words == null) {
      return
    }
    if (redeemed) return
    if (Number(words) >= 500) {
      setReward(true)
    }
  }, [words])

  useEffect(() => {
    if (localStorage.getItem("Redeemed") === "true") {
      setRedeemed(true)
    }
  }, [])

  const getReward = () => {
    if (!reward) return
    if (redeemed) return
    axios
      .get(`/api/redeem/${address}`)
      .then((response) => {
        // Handle the data received from the API
        console.log(response.data.message)
        alert(response.data.message)
        setRedeemed(true)
        localStorage.setItem("Redeemed", "true")
        setReward(false)
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error)
      })
  }

  useEffect(() => {
    const updatedFullData = {
      ...fullData,
      [prompts[promptIndex]]: sentences,
    }
    setFullData(updatedFullData)
    localStorage.setItem(`${getDateEpoch()}`, JSON.stringify(updatedFullData))
  }, [sentences])

  useEffect(() => {
    if (!fullData[prompts[promptIndex]]) {
      setSentences([])
    } else {
      setSentences(fullData[prompts[promptIndex]])
    }
  }, [promptIndex])

  if (mood === null) {
    return (
      <section className="grid items-center gap-6 pb-8 pt-6 md:py-10 h-full min-h-[85vh]">
        <div className="mx-auto px-3 w-full flex max-w-[980px] flex-col gap-3 overflow-hidden justify-center items-center h-full">
          <div className="text-xl md:text-3xl tracking-tight font-medium">
            How are you feeling?
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMood(0)}
              className="text-red-600 hover:ring-4 hover:ring-red-400 rounded-full p-2"
            >
              <Frown size={100} />
            </button>
            <button
              onClick={() => setMood(1)}
              className="text-yellow-600 hover:ring-4 hover:ring-yellow-400 rounded-full p-2"
            >
              <Meh size={100} />
            </button>
            <button
              onClick={() => setMood(2)}
              className="text-green-600 hover:ring-4 hover:ring-green-400 rounded-full p-2"
            >
              <Smile size={100} />
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto px-3 w-full flex max-w-[980px] flex-col gap-3 overflow-hidden">
        <div className="flex flex-col gap-1.5 border-b dark:border-gray-800 border-gray-200 py-1">
          <div className="flex gap-3 items-center">
            <div className="dark:bg-gray-900 bg-gray-100 bg-opacity-80 rounded-xl w-fit px-2.5 py-1.5 flex gap-1 items-end mb-2">
              <div className="text-3xl font-medium">{words ?? 0}</div>
              <div className="">Words</div>
            </div>

            {reward && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="dark:bg-gray-900 bg-gray-100 bg-opacity-80 rounded-xl w-fit px-2.5 py-1.5 flex gap-2 items-end mb-2">
                    <div className="text-3xl font-medium">
                      <Star color={"yellow"} />
                    </div>
                    <div className="">Reward</div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Congratulations!</DialogTitle>
                    <DialogDescription>
                      You wrote 500 words today! You earned a reward! 
                      <div className="mt-2 mb-3">
                      Please enter your wallet address below to receive your reward.
                      </div>
                      <Input
                        onChange={(e) => setAddress(e.target.value)}
                        id="name"
                        value={address}
                        placeholder="Address..."
                        className="col-span-3"
                      />
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    {address !== "" && (
                      <Button onClick={getReward} type="submit">
                        Redeem
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex gap-1">
            <button
              disabled={promptIndex === 0}
              className={`${
                promptIndex === 0 ? "text-gray-400 opacity-50" : ""
              }`}
              onClick={() => setPromptIndex(promptIndex - 1)}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              disabled={promptIndex === prompts.length - 1}
              className={`${
                promptIndex === prompts.length - 1
                  ? "text-gray-400 opacity-50"
                  : ""
              }`}
              onClick={() => setPromptIndex(promptIndex + 1)}
            >
              <ArrowRight size={17} />
            </button>
            <div className="mx-2 flex gap-1">
              <div className="tracking-tight font-bold text-base md:text-xl">
                {prompts[promptIndex]}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button>
                    <Edit3 size={17} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-90">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Prompts</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the guided prompts that you want to see.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {prompts.map((p, i) => (
                        <div className="flex items-center gap-4" key={i}>
                          <Input
                            type="text"
                            value={p}
                            onChange={(e) => {
                              const newPrompts = [...prompts]
                              newPrompts[i] = e.target.value
                              setPrompts(newPrompts)
                            }}
                            id="width"
                            className="col-span-2 h-8"
                          />
                          <button
                            disabled={prompts.length === 1}
                            className={`${
                              prompts.length === 1
                                ? "text-gray-400 opacity-50"
                                : ""
                            }`}
                            onClick={() => {
                              setPromptIndex((prevIndex) =>
                                prevIndex === 0 ? 0 : prevIndex - 1
                              )
                              setPrompts(
                                prompts.filter(
                                  (_: any, index: number) => index !== i
                                )
                              )
                            }}
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {prompts[prompts.length - 1] !== "" && (
                      <button onClick={() => setPrompts([...prompts, ""])}>
                        <div className="w-full dark:bg-gray-900 bg-gray-100 rounded-lg flex items-center justify-center py-1.5">
                          <PlusCircle size={20} />
                        </div>
                      </button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Input
            type="text"
            placeholder="Write your heart out..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (input === "") return
                setSentences((prev: any) => [
                  { text: input, timestamp: new Date() },
                  ...prev,
                ])
                if (localStorage.getItem("wordCount") === null) {
                  localStorage.setItem(
                    "wordCount",
                    `${input.split(" ").length}`
                  )
                } else {
                  localStorage.setItem(
                    "wordCount",
                    JSON.parse(localStorage.getItem("wordCount") ?? "null") +
                      input.split(" ").length
                  )
                }
                setWords(
                  JSON.parse(localStorage.getItem("wordCount") ?? "null")
                )
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
                <div className="flex items-center gap-2" key={i}>
                  <div className="text-sm">
                    {/* {sentiment.analyze(s.text).score} */}
                    <div
                      className={`h-2 w-2 aspect-square opacity-70 rounded-full ${
                        sentiment.analyze(s.text).score > 0
                          ? "bg-green-500"
                          : sentiment.analyze(s.text).score < 0
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div
                    key={i}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave()}
                    className={`hover:dark:bg-gray-900 hover:bg-gray-100 rounded-md px-3 w-full py-2 gap-1 flex flex-wrap-reverse justify-between ${
                      Math.floor(
                        ((currentTime as any) - Number(new Date(s.timestamp))) /
                          1000
                      ) < 0.25
                        ? ""
                        : "blur-[2px] fade-in"
                    }`}
                  >
                    <span className="whitespace-normal break-words overflow-hidden">
                      {s.text}
                    </span>
                    {hoveredIndex === i && (
                      <span className="text-xs text-gray-400 flex items-center gap-2 justify-center whitespace-pre">
                        {getTimeElapsed(new Date(s.timestamp))}
                        <button
                          className="text-gray-400"
                          onClick={() => handleDelete(i)}
                        >
                          <Trash size={17} />
                        </button>
                        {/* {(new Date(s.timestamp)).toLocaleTimeString()} */}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
