'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "يناير", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "فبراير", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "مارس", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "أبريل", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "مايو", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "يونيو", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "يوليو", total: Math.floor(Math.random() * 5000) + 1000 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {payload[0].payload.name}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ${payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

