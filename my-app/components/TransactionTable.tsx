'use client'

import { useAppContext } from '@/contexts/AppContext'
import { Transaction } from '@/types'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TransactionTableProps {
  searchTerm: string
  filterType?: string
  dateRange: [Date | undefined, Date | undefined]
  currency: 'IQD' | 'USD' | 'both'
}

export function TransactionTable({ searchTerm, filterType, dateRange, currency }: TransactionTableProps) {
  const { transactions, customers } = useAppContext()

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const customer = customers.find(c => c.id === transaction.customerId)
    const customerName = customer?.name || ''
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || filterType === 'all' || transaction.type === filterType
    
    const isInDateRange = dateRange[0] && dateRange[1]
      ? new Date(transaction.date) >= dateRange[0] && new Date(transaction.date) <= dateRange[1]
      : true
    
    const matchesCurrency = currency === 'both' || transaction.fromCurrency.toUpperCase() === currency

    return matchesSearch && matchesType && isInDateRange && matchesCurrency
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>From Currency</TableHead>
          <TableHead>To Currency</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTransactions.map((transaction: Transaction) => {
          const customer = customers.find(c => c.id === transaction.customerId)
          return (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
              <TableCell>{customer ? customer.name : 'Unknown'}</TableCell>
              <TableCell className="capitalize">{transaction.type}</TableCell>
              <TableCell>{transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.fromCurrency.toUpperCase()}</TableCell>
              <TableCell>{transaction.toCurrency ? transaction.toCurrency.toUpperCase() : '-'}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

