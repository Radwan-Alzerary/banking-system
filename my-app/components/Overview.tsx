'use client'

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function Overview() {
  const [data, setData] = useState<{ name: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMonthlyTotals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/monthly-totals')
        if (!response.ok) {
          throw new Error('Failed to fetch monthly totals')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchMonthlyTotals()
  }, [])

  if (loading) return <div>جاري تحميل البيانات...</div>
  if (error) return <div>خطأ: {error}</div>

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
