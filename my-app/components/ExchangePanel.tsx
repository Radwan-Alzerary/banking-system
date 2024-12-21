'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

interface ExchangePanelProps {
  dinarBalance: number
  dollarBalance: number
  customerId: string
}

export function ExchangePanel({ dinarBalance, dollarBalance, customerId }: ExchangePanelProps) {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState<'dinar' | 'dollar'>('dinar')
  const [note, setNote] = useState('')
  const { exchangeRate, addTransaction } = useAppContext()

  const handleExchange = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    const toCurrency = fromCurrency === 'dinar' ? 'dollar' : 'dinar'
    const rate = fromCurrency === 'dinar' ? exchangeRate.dinarToDollar : exchangeRate.dollarToDinar

    addTransaction({
      customerId,
      type: 'exchange',
      amount: numAmount,
      fromCurrency,
      toCurrency,
      note: note.trim() || undefined,
    })

    setAmount('')
    setNote('')
  }

  const toCurrency = fromCurrency === 'dinar' ? 'dollar' : 'dinar'
  const rate = fromCurrency === 'dinar' ? exchangeRate.dinarToDollar : exchangeRate.dollarToDinar
  const convertedAmount = parseFloat(amount) * rate

  return (
    <Card>
      <CardHeader>
        <CardTitle>تحويل العملة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="exchange-amount">المبلغ</Label>
            <Input
              id="exchange-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="from-currency">من</Label>
            <Select value={fromCurrency} onValueChange={(value: 'dinar' | 'dollar') => setFromCurrency(value)}>
              <SelectTrigger id="from-currency">
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinar">دينار</SelectItem>
                <SelectItem value="dollar">دولار</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ArrowLeftRight className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <Label>إلى</Label>
          <div className="text-2xl font-bold">
            {toCurrency === 'dinar' ? 'د' : '$'}{convertedAmount.toFixed(2)} {toCurrency === 'dinar' ? 'دينار' : 'دولار'}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exchange-note">ملاحظة (اختياري)</Label>
          <Textarea
            id="exchange-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أضف ملاحظة للمعاملة"
          />
        </div>
        <Button onClick={handleExchange} className="w-full">
          تحويل
        </Button>
        <div className="text-sm text-muted-foreground">
          سعر الصرف: 1 {fromCurrency === 'dinar' ? 'دينار' : 'دولار'} = {rate.toFixed(2)} {toCurrency === 'dinar' ? 'دينار' : 'دولار'}
        </div>
      </CardContent>
    </Card>
  )
}

