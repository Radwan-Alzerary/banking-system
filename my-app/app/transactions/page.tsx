'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionTable } from "@/components/TransactionTable"
import { DateRangePicker } from "@/components/DateRangePicker"
import { CurrencyFilter } from "@/components/CurrencyFilter"

export default function TransactionHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string | undefined>()
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [currency, setCurrency] = useState<'IQD' | 'USD' | 'both'>('both')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-[200px]">
              <Label htmlFor="type">نوع العملية</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="deposit">ايداع</SelectItem>
                  <SelectItem value="withdraw">سحب</SelectItem>
                  <SelectItem value="exchange">تحويل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <DateRangePicker onChange={setDateRange} />
            <CurrencyFilter value={currency} onChange={setCurrency} />
          </div>
        </CardContent>
      </Card>
      <TransactionTable 
        searchTerm={searchTerm} 
        filterType={filterType} 
        dateRange={dateRange}
        currency={currency}
      />
    </div>
  )
}

