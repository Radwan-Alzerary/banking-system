'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Customer } from '@/types' // If you have a Customer type or interface

interface CustomerAnalysisProps {
  customerId: string
}

// This interface should match the shape returned by your backend
interface Transaction {
  _id: string
  customerId: string
  type: 'deposit' | 'withdraw' | 'exchange'
  amount: number
  fromCurrency: 'dinar' | 'dollar'
  note?: string | null
  date: string
  // ...other fields like createdAt, updatedAt, etc.
}

export function CustomerAnalysis({ customerId }: CustomerAnalysisProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the specific customer's transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`http://localhost:5000/api/transactions/customer/${customerId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch customer transactions')
        }
        const data = await res.json()
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || 'Error loading transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [customerId])

  if (loading) {
    return <div>جاري تحميل التحليل...</div>
  }

  if (error) {
    return <div>خطأ: {error}</div>
  }

  // Now we have the transactions specifically for this customer
  const totalDeposits = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExchanges = transactions
    .filter((t) => t.type === 'exchange')
    .reduce((sum, t) => sum + t.amount, 0)

  // Prepare data for the “Transactions by Type” chart
  const transactionsByType = [
    { name: 'الإيداعات', value: totalDeposits },
    { name: 'السحوبات', value: totalWithdrawals },
    { name: 'التبادلات', value: totalExchanges },
  ]

  // Prepare data for the “Transactions by Currency” chart
  const currencyTotals = transactions.reduce<Record<string, number>>((acc, t) => {
    const currencyKey = t.fromCurrency // "dinar" or "dollar"
    acc[currencyKey] = (acc[currencyKey] || 0) + t.amount
    return acc
  }, {})

  const currencyData = Object.entries(currencyTotals).map(([currency, amount]) => ({
    name: currency === 'dinar' ? 'IQD' : 'USD',
    value: amount,
  }))

  return (
    <div className="space-y-6">
      {/* 1) Transaction Summary Cards */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">إجمالي الإيداعات</dt>
              <dd className="mt-1 text-3xl font-semibold">{totalDeposits.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">إجمالي السحوبات</dt>
              <dd className="mt-1 text-3xl font-semibold">{totalWithdrawals.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">إجمالي التبادلات</dt>
              <dd className="mt-1 text-3xl font-semibold">{totalExchanges.toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 2) Transactions By Type */}
      <Card>
        <CardHeader>
          <CardTitle>المعاملات حسب النوع</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionsByType}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3) Transactions By Currency */}
      <Card>
        <CardHeader>
          <CardTitle>المعاملات حسب العملة</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currencyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
