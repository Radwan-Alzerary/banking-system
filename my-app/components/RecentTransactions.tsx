'use client'

import { useAppContext } from '@/contexts/AppContext'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { ArrowDownIcon, ArrowUpIcon, RefreshCcwIcon, ArrowLeftRightIcon } from 'lucide-react'

export function RecentTransactions() {
  const { transactions } = useAppContext()

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />
      case 'withdraw':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />
      case 'exchange':
        return <RefreshCcwIcon className="h-4 w-4 text-blue-500" />
      case 'transfer':
        return <ArrowLeftRightIcon className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'إيداع'
      case 'withdraw':
        return 'سحب'
      case 'exchange':
        return 'صرف'
      case 'transfer':
        return 'تحويل'
      default:
        return type
    }
  }

  return (
    <div className="space-y-8">
      {transactions.slice(0, 5).map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {getTransactionTypeText(transaction.type)}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.fromCurrency === 'dinar' ? 'دينار' : 'دولار'} {transaction.amount}
              {transaction.toCurrency && ` إلى ${transaction.toCurrency === 'dinar' ? 'دينار' : 'دولار'}`}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatDistanceToNow(transaction.date, { addSuffix: true, locale: ar })}
          </div>
          <div className="mr-2">
            {getTransactionIcon(transaction.type)}
          </div>
        </div>
      ))}
    </div>
  )
}

