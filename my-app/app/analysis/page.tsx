'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/DateRangePicker"
import { CurrencyFilter } from "@/components/CurrencyFilter"
import { TransactionChart } from "@/components/TransactionChart"
import { TransactionTable } from "@/components/TransactionTable"

export default function AnalysisPage() {
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [currency, setCurrency] = useState<'IQD' | 'USD' | 'both'>('both')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction Analysis</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <DateRangePicker onChange={setDateRange} />
        <CurrencyFilter value={currency} onChange={setCurrency} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionChart dateRange={dateRange} currency={currency} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable 
            dateRange={dateRange} 
            currency={currency} 
            searchTerm={searchTerm}
            filterType={filterType}
          />
        </CardContent>
      </Card>
    </div>
  )
}

