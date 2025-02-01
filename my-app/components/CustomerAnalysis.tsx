'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

interface CustomerAnalysisProps {
  customerId: string
}

interface Transaction {
  _id: string
  customerId: string
  type: 'deposit' | 'withdraw' | 'exchange'
  amount: number
  fromCurrency: 'dinar' | 'dollar'
  note?: string | null
  date: string
}

type TimeFilter = 'all' | 'today' | 'thisMonth' | 'custom'
type CurrencyFilter = 'all' | 'dinar' | 'dollar'

export function CustomerAnalysis({ customerId }: CustomerAnalysisProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New filter state variables:
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('all')

  // Fetch all transactions for the customer
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(
          `http://localhost:5000/api/transactions/customer/${customerId}`
        )
        if (!res.ok) {
          throw new Error('فشل في جلب معاملات العميل')
        }
        const data = await res.json()
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || 'خطأ في تحميل المعاملات')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [customerId])

  // Filter transactions based on the selected time range and currency
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    const now = new Date()

    // Time filtering
    if (timeFilter === 'today') {
      if (
        transactionDate.getFullYear() !== now.getFullYear() ||
        transactionDate.getMonth() !== now.getMonth() ||
        transactionDate.getDate() !== now.getDate()
      ) {
        return false
      }
    } else if (timeFilter === 'thisMonth') {
      if (
        transactionDate.getFullYear() !== now.getFullYear() ||
        transactionDate.getMonth() !== now.getMonth()
      ) {
        return false
      }
    } else if (timeFilter === 'custom') {
      if (customStartDate && customEndDate) {
        const startDate = new Date(customStartDate)
        const endDate = new Date(customEndDate)
        // Include transactions on the boundary dates as well
        if (transactionDate < startDate || transactionDate > endDate) {
          return false
        }
      }
    }
    // Currency filtering
    if (currencyFilter !== 'all' && t.fromCurrency !== currencyFilter) {
      return false
    }
    return true
  })

  // Separate totals for deposits by currency
  const totalDepositsDinar = filteredTransactions
    .filter((t) => t.type === 'deposit' && t.fromCurrency === 'dinar')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDepositsDollar = filteredTransactions
    .filter((t) => t.type === 'deposit' && t.fromCurrency === 'dollar')
    .reduce((sum, t) => sum + t.amount, 0)

  // Separate totals for withdrawals by currency
  const totalWithdrawalsDinar = filteredTransactions
    .filter((t) => t.type === 'withdraw' && t.fromCurrency === 'dinar')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawalsDollar = filteredTransactions
    .filter((t) => t.type === 'withdraw' && t.fromCurrency === 'dollar')
    .reduce((sum, t) => sum + t.amount, 0)

  // Separate totals for exchanges by currency
  const totalExchangesDinar = filteredTransactions
    .filter((t) => t.type === 'exchange' && t.fromCurrency === 'dinar')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExchangesDollar = filteredTransactions
    .filter((t) => t.type === 'exchange' && t.fromCurrency === 'dollar')
    .reduce((sum, t) => sum + t.amount, 0)

  // Prepare data for the “Transactions by Type” chart
  const transactionsByType = [
    { name: 'الإيداعات', value: totalDepositsDinar + totalDepositsDollar },
    { name: 'السحوبات', value: totalWithdrawalsDinar + totalWithdrawalsDollar },
    { name: 'التبادلات', value: totalExchangesDinar + totalExchangesDollar },
  ]

  // Prepare data for the “Transactions by Currency” chart
  const currencyTotals = filteredTransactions.reduce<Record<string, number>>(
    (acc, t) => {
      const key = t.fromCurrency
      acc[key] = (acc[key] || 0) + t.amount
      return acc
    },
    {}
  )

  const currencyData = Object.entries(currencyTotals).map(([currency, amount]) => ({
    name: currency === 'dinar' ? 'IQD' : 'USD',
    value: amount,
  }))

  if (loading) {
    return <div>جاري تحميل التحليل...</div>
  }

  if (error) {
    return <div>خطأ: {error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-100 rounded">
        <div className="flex items-center space-x-2">
          <label className="font-medium">اختر الفترة:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="border rounded px-2 py-1"
          >
            <option value="all">كل الوقت</option>
            <option value="today">اليوم</option>
            <option value="thisMonth">هذا الشهر</option>
            <option value="custom">تاريخ محدد</option>
          </select>
          {timeFilter === 'custom' && (
            <>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <label className="font-medium">اختر العملة:</label>
          <select
            value={currencyFilter}
            onChange={(e) =>
              setCurrencyFilter(e.target.value as CurrencyFilter)
            }
            className="border rounded px-2 py-1"
          >
            <option value="all">الكل</option>
            <option value="dinar">دينار</option>
            <option value="dollar">دولار</option>
          </select>
        </div>
      </div>

      {/* 1) Transaction Summary Cards */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Deposits */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                إجمالي الإيداعات
              </dt>
              <dd className="mt-1 text-xl font-semibold">
                دينار: {totalDepositsDinar.toLocaleString()}
              </dd>
              <dd className="mt-1 text-xl font-semibold">
                دولار: {totalDepositsDollar.toLocaleString()}
              </dd>
            </div>
            {/* Withdrawals */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                إجمالي السحوبات
              </dt>
              <dd className="mt-1 text-xl font-semibold">
                دينار: {totalWithdrawalsDinar.toLocaleString()}
              </dd>
              <dd className="mt-1 text-xl font-semibold">
                دولار: {totalWithdrawalsDollar.toLocaleString()}
              </dd>
            </div>
            {/* Exchanges */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                إجمالي التبادلات
              </dt>
              <dd className="mt-1 text-xl font-semibold">
                دينار: {totalExchangesDinar.toLocaleString()}
              </dd>
              <dd className="mt-1 text-xl font-semibold">
                دولار: {totalExchangesDollar.toLocaleString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 2) Transactions By Type Chart */}
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

      {/* 3) Transactions By Currency Chart */}
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
