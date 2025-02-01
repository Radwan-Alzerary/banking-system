import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Transaction } from '@/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>التاريخ</TableHead>
          <TableHead>النوع</TableHead>
          <TableHead>المبلغ</TableHead>
          <TableHead>العملة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
            <TableCell>
              {{
                deposit: 'إيداع',
                withdraw: 'سحب',
                exchange: 'تحويل',
                transfer: 'نقل'
              }[transaction.type]}
            </TableCell>
            <TableCell>{transaction.amount.toFixed(0)}</TableCell>
            <TableCell>{transaction.fromCurrency === 'dinar' ? 'دينار' : 'دولار'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
