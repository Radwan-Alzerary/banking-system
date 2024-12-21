'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightIcon } from 'lucide-react'
import { Combobox } from "@/components/ui/combobox"

interface TransferMoneyProps {
  fromCustomerId: string
}

export function TransferMoney({ fromCustomerId }: TransferMoneyProps) {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<'dinar' | 'dollar'>('dinar')
  const [toCustomerId, setToCustomerId] = useState('')
  const { customers, transferMoney } = useAppContext()

  const fromCustomer = customers.find(c => c.id === fromCustomerId)
  const otherCustomers = customers.filter(c => c.id !== fromCustomerId)

  const handleTransfer = async () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0 || !toCustomerId) return

    await transferMoney(fromCustomerId, toCustomerId, numAmount, currency)
    setAmount('')
    setToCustomerId('')
  }

  if (!fromCustomer) return null

  const customerOptions = otherCustomers.map(customer => ({
    value: customer.id,
    label: customer.name
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>تحويل الأموال</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transfer-amount">المبلغ</Label>
          <Input
            id="transfer-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="أدخل المبلغ"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transfer-currency">العملة</Label>
          <Select value={currency} onValueChange={(value: 'dinar' | 'dollar') => setCurrency(value)}>
            <SelectTrigger id="transfer-currency">
              <SelectValue placeholder="اختر العملة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dinar">دينار</SelectItem>
              <SelectItem value="dollar">دولار</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="transfer-to">تحويل إلى</Label>
          <Combobox
            options={customerOptions}
            value={toCustomerId}
            onChange={setToCustomerId}
            placeholder="اختر المستلم"
          />
        </div>
        <Button onClick={handleTransfer} className="w-full">
          <ArrowRightIcon className="ml-2 h-4 w-4" /> تحويل
        </Button>
      </CardContent>
    </Card>
  )
}
