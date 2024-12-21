'use client'

import { useAppContext } from '@/contexts/AppContext'
import { Transaction } from '@/types'
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TransactionChartProps {
  dateRange: [Date | undefined, Date | undefined]
  currency: 'IQD' | 'USD' | 'both'
}

export function TransactionChart({ dateRange, currency }: TransactionChartProps) {
  const { transactions } = useAppContext()

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const isInDateRange = dateRange[0] && dateRange[1]
      ? isWithinInterval(new Date(transaction.date), {
          start: startOfDay(dateRange[0]),
          end: endOfDay(dateRange[1])
        })
      : true
    const isCorrectCurrency = currency === 'both' || transaction.fromCurrency.toUpperCase() === currency
    return isInDateRange && isCorrectCurrency
  })

  const chartData = filteredTransactions.reduce((acc: any[], transaction: Transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0]
    const existingData = acc.find(item => item.date === date)
    if (existingData) {
      if (transaction.type === 'deposit') {
        existingData[`${transaction.fromCurrency.toUpperCase()}Deposits`] += transaction.amount
      } else if (transaction.type === 'withdraw') {
        existingData[`${transaction.fromCurrency.toUpperCase()}Withdrawals`] += transaction.amount
      }
    } else {
      const newData: any = { date }
      if (transaction.type === 'deposit') {
        newData[`${transaction.fromCurrency.toUpperCase()}Deposits`] = transaction.amount
        newData[`${transaction.fromCurrency.toUpperCase()}Withdrawals`] = 0
      } else if (transaction.type === 'withdraw') {
        newData[`${transaction.fromCurrency.toUpperCase()}Deposits`] = 0
        newData[`${transaction.fromCurrency.toUpperCase()}Withdrawals`] = transaction.amount
      }
      acc.push(newData)
    }
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {(currency === 'IQD' || currency === 'both') && (
          <>
            <Bar dataKey="IQDDeposits" fill="#8884d8" name="IQD Deposits" />
            <Bar dataKey="IQDWithdrawals" fill="#82ca9d" name="IQD Withdrawals" />
          </>
        )}
        {(currency === 'USD' || currency === 'both') && (
          <>
            <Bar dataKey="USDDeposits" fill="#ffc658" name="USD Deposits" />
            <Bar dataKey="USDWithdrawals" fill="#ff7300" name="USD Withdrawals" />
          </>
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}

