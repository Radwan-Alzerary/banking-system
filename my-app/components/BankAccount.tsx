'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

interface BankAccountProps {
  currency: 'dinar' | 'dollar'
  balance: number
  customerId: string
}

export function BankAccount({ currency, balance, customerId }: BankAccountProps) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const { addTransaction } = useAppContext()

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    await addTransaction({
      customerId,
      type,
      amount: numAmount,
      fromCurrency: currency,
      note: note.trim() || undefined,
    })

    setAmount('')
    setNote('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currency === 'dinar' ? 'حساب الدينار' : 'حساب الدولار'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">
          {currency === 'dinar' ? 'د' : '$'}{balance.toFixed(2)}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${currency}-amount`}>المبلغ</Label>
          <Input
            id={`${currency}-amount`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`أدخل المبلغ بال${currency === 'dinar' ? 'دينار' : 'دولار'}`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${currency}-note`}>ملاحظة (اختياري)</Label>
          <Textarea
            id={`${currency}-note`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أضف ملاحظة للمعاملة"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleTransaction('deposit')} className="flex-1">
            <ArrowDownIcon className="ml-2 h-4 w-4" /> إيداع
          </Button>
          <Button onClick={() => handleTransaction('withdraw')} variant="outline" className="flex-1">
            <ArrowUpIcon className="ml-2 h-4 w-4" /> سحب
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
