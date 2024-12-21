'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ExchangePage() {
  const { exchangeRate, setExchangeRate } = useAppContext()
  const [dinarToDollar, setDinarToDollar] = useState(exchangeRate.dinarToDollar.toString())
  const [dollarToDinar, setDollarToDinar] = useState(exchangeRate.dollarToDinar.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setExchangeRate({
      dinarToDollar: parseFloat(dinarToDollar),
      dollarToDinar: parseFloat(dollarToDinar),
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Exchange Rates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dinarToDollar">Dinar to Dollar</Label>
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
              <Label htmlFor="dollarToDinar">Dollar to Dinar</Label>
              <Input
                id="dollarToDinar"
                type="number"
                value={dollarToDinar}
                onChange={(e) => setDollarToDinar(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <Button type="submit">Update Exchange Rates</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

