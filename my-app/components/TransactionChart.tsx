'use client'

import React, { useEffect, useState } from 'react'
import { startOfDay, endOfDay } from 'date-fns'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

/**
 * Define your transaction interface based on your backend response.
 * Adjust fields if your data shape differs.
 */
interface Transaction {
  _id: string
  type: 'deposit' | 'withdraw' | 'exchange'
  amount: number
  fromCurrency: 'dinar' | 'dollar'
  date: string
  // ...additional fields (e.g., note, createdAt, updatedAt) if needed
}

/**
 * Props for the TransactionChart component
 * @param dateRange - Array of two dates indicating a start and end range
 * @param currency - Selected currency filter ('IQD', 'USD', or 'both')
 */
interface TransactionChartProps {
  dateRange: [Date | undefined, Date | undefined]
  currency: 'IQD' | 'USD' | 'both'
}

export function TransactionChart({ dateRange, currency }: TransactionChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Fetch transactions from your backend API with optional filters for date range and currency.
     * Ensure your backend endpoint supports query parameters:
     *   - startDate
     *   - endDate
     *   - currency
     */
    async function fetchTransactions() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()

        // Append startDate & endDate if selected
        if (dateRange[0]) {
          params.append('startDate', startOfDay(dateRange[0]).toISOString())
        }
        if (dateRange[1]) {
          params.append('endDate', endOfDay(dateRange[1]).toISOString())
        }

        // Append currency filter ('IQD', 'USD', or 'both')
        params.append('currency', currency)

        // Fetch from your backend
        const response = await fetch(`http://localhost:5000/api/analysis/?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch transaction data')
        }

        // Transactions returned from the backend
        const transactions: Transaction[] = await response.json()

        /**
         * Aggregate the transaction data.
         * We'll store daily totals for:
         *   - IQD Deposits
         *   - IQD Withdrawals
         *   - USD Deposits
         *   - USD Withdrawals
         */
        const aggregatedData = transactions.reduce((acc: any[], transaction: Transaction) => {
          // Format date as YYYY-MM-DD to group by day
          const date = new Date(transaction.date).toISOString().split('T')[0]

          // Check if we already have an entry for this date
          let existing = acc.find(item => item.date === date)
          if (!existing) {
            existing = {
              date,
              IQDDeposits: 0,
              IQDWithdrawals: 0,
              USDDeposits: 0,
              USDWithdrawals: 0
            }
            acc.push(existing)
          }

          // Convert 'dinar' to 'IQD' and 'dollar' to 'USD'
          const currencyCode = transaction.fromCurrency === 'dinar' ? 'IQD' : 'USD'

          // Update deposit or withdrawal totals
          if (transaction.type === 'deposit') {
            existing[`${currencyCode}Deposits`] += transaction.amount
          } else if (transaction.type === 'withdraw') {
            existing[`${currencyCode}Withdrawals`] += transaction.amount
          }
          // If you have 'exchange', you can decide how to handle it here.

          return acc
        }, [])

        setChartData(aggregatedData)
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [dateRange, currency])

  if (loading) {
    return <div>Loading chart...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => value.toFixed(2)}
        />
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
