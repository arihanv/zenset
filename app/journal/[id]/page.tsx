"use client"

import React, { useEffect } from "react"

export default function IndexPage({
  params,
}: {
  params: {
    id: number
  }
}) {
  const [dateEpoch, setDateEpoch] = React.useState(getDateEpoch())
  const [data, setData] = React.useState<any>()
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
    if (JSON.parse(localStorage.getItem(`${params.id}`) ?? "null") === null) {
      setData(JSON.parse(localStorage.getItem(`${getDateEpoch()}`) ?? "null"))
    } else {
      setData(JSON.parse(localStorage.getItem(`${params.id}`) ?? "null"))
    }
  }, [])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold border-b-2 w-full pb-2">
          {params.id.toString() === "today" ||
          params.id.toString() === getDateEpoch().toString()
            ? "Today's Journal"
            : new Date(params.id * 1000).toLocaleString("default", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
        </h1>
        {data && Object.entries(data).length > 0 && (
          <>
            {Object.entries(data).map(([question, texts]) => (
              <>
                {/* @ts-ignore */}
                {texts.length !== 0 && (
                  <div className="hover:bg-gray-200 hover:dark:bg-gray-800 p-2.5 hover:rounded-xl w-full border-b">
                    <div key={question} className="mb-7">
                      <h3 className="font-semibold tracking-tight text-2xl mb-1">
                        {question}
                      </h3>
                      <ul>
                        {/* @ts-ignore */}
                        {texts.map((text, index) => text.text).join(". ")}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            ))}
          </>
        )}
      </div>
    </section>
  )
}
