'use client'

import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface CustomerAnalysisProps {
  customerId: string
}

export function CustomerAnalysis({ customerId }: CustomerAnalysisProps) {
  const { transactions, customers } = useAppContext()

  const customer = customers.find(c => c.id === customerId)
  if (!customer) return null

  const customerTransactions = transactions.filter(t => t.customerId === customerId)

  const totalDeposits = customerTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = customerTransactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExchanges = customerTransactions
    .filter(t => t.type === 'exchange')
    .reduce((sum, t) => sum + t.amount, 0)

  const transactionsByType = [
    { name: 'الإيداعات', value: totalDeposits },
    { name: 'السحوبات', value: totalWithdrawals },
    { name: 'التبادلات', value: totalExchanges },
  ]

  const transactionsByCurrency = customerTransactions.reduce((acc, t) => {
    acc[t.fromCurrency] = (acc[t.fromCurrency] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const currencyData = Object.entries(transactionsByCurrency).map(([currency, amount]) => ({
    name: currency.toUpperCase(),
    value: amount,
  }))

  return (
    <div className="space-y-6">
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
