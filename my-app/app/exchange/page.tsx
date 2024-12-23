'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ExchangePage() {
  const [dinarToDollar, setDinarToDollar] = useState<string>('0.33')
  const [dollarToDinar, setDollarToDinar] = useState<string>('3.0')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/exchange-rate')
        if (!response.ok) {
          throw new Error('فشل في جلب أسعار الصرف')
        }
        const data = await response.json()
        setDinarToDollar(data.dinarToDollar.toString())
        setDollarToDinar(data.dollarToDinar.toString())
      } catch (err) {
        setError('فشل في تحميل أسعار الصرف')
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRate()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/exchange-rate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dinarToDollar: parseFloat(dinarToDollar),
          dollarToDinar: parseFloat(dollarToDinar),
        }),
      })
      if (!response.ok) {
        throw new Error('فشل في تحديث أسعار الصرف')
      }
      const data = await response.json()
      setDinarToDollar(data.dinarToDollar.toString())
      setDollarToDinar(data.dollarToDinar.toString())
    } catch (err) {
      setError('فشل في تحديث أسعار الصرف')
    }
  }

  if (loading) return <div>جاري تحميل الصفحة...</div>
  if (error) return <div>خطأ: {error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">أسعار الصرف</h1>
      <Card>
        <CardHeader>
          <CardTitle>تحديث أسعار الصرف</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dinarToDollar">سعر الدينار مقابل الدولار</Label>
              <Input
                id="dinarToDollar"
                type="number"
                value={dinarToDollar}
                onChange={(e) => setDinarToDollar(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dollarToDinar">سعر الدولار مقابل الدينار</Label>
              <Input
                id="dollarToDinar"
                type="number"
                value={dollarToDinar}
                onChange={(e) => setDollarToDinar(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <Button type="submit">تحديث أسعار الصرف</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
