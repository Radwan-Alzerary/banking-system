// TransactionList.tsx
import { useEffect, useState } from 'react'
import { Transaction } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pen, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionListProps {
  customerId: string
  // Callback to update customer account data in the main page
  onTransactionUpdate?: () => void
}

export function TransactionList({ customerId, onTransactionUpdate }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
  // New state to toggle between combined view and separate tables
  const [combinedView, setCombinedView] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [customerId])

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/customer/${customerId}`)
      if (!response.ok) throw new Error('Failed to fetch transactions')
      const data = await response.json()
      setTransactions(data)
    } catch (err) {
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete transaction')

      // Update local state by filtering out the deleted transaction
      setTransactions(prev => prev.filter(t => t._id !== transactionId))
      // Optionally, refresh customer account info in the main page
      onTransactionUpdate?.()
    } catch (err) {
      setError('Failed to delete transaction')
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTransaction) return

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${editTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editTransaction),
      })

      if (!response.ok) throw new Error('Failed to update transaction')

      const updatedTransaction = await response.json()
      setTransactions(prev =>
        prev.map(t => t._id === updatedTransaction._id ? updatedTransaction : t)
      )
      setIsEditModalOpen(false)
      // Update customer account info in the main page
      onTransactionUpdate?.()
    } catch (err) {
      setError('Failed to update transaction')
    }
  }

  if (loading) return <div>جاري تحميل المعاملات...</div>
  if (error) return <div>خطأ: {error}</div>

  // Helper function to render a table given a list of transactions and a title
  const renderTable = (tableTransactions: Transaction[], title: string) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>العملة</TableHead>
              <TableHead>ملاحظات</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableTransactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString('ar-EG')}</TableCell>
                <TableCell>
                  {{
                    deposit: 'إيداع',
                    withdraw: 'سحب',
                    exchange: 'تحويل',
                    transfer: 'نقل'
                  }[transaction.type]}
                </TableCell>
                <TableCell>{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.fromCurrency}</TableCell>
                <TableCell>{transaction.note || '-'}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Pen className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction._id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setCombinedView(prev => !prev)}>
          {combinedView ? 'عرض المعاملات حسب العملة' : 'عرض كل المعاملات'}
        </Button>
      </div>

      {combinedView ? (
        // Combined table: show all transactions in one table
        renderTable(transactions, 'كل المعاملات')
      ) : (
        // Render two tables side by side using flexbox
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            {renderTable(
              transactions.filter(t => t.fromCurrency === 'dollar'),
              'المعاملات بالدولار'
            )}
          </div>
          <div className="md:w-1/2">
            {renderTable(
              transactions.filter(t => t.fromCurrency === 'dinar'),
              'المعاملات بالدينار'
            )}
          </div>
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المعاملة</DialogTitle>
          </DialogHeader>
          {editTransaction && (
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <Label>النوع</Label>
                <Select
                  value={editTransaction.type}
                  onValueChange={value => setEditTransaction(prev =>
                    prev ? { ...prev, type: value as any } : prev
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">إيداع</SelectItem>
                    <SelectItem value="withdraw">سحب</SelectItem>
                    <SelectItem value="exchange">تحويل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>المبلغ</Label>
                <Input
                  type="number"
                  value={editTransaction.amount}
                  onChange={e => setEditTransaction(prev =>
                    prev ? { ...prev, amount: Number(e.target.value) } : prev
                  )}
                />
              </div>

              <div>
                <Label>من عملة</Label>
                <Select
                  value={editTransaction.fromCurrency}
                  onValueChange={value => setEditTransaction(prev =>
                    prev ? { ...prev, fromCurrency: value as any } : prev
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinar">دينار</SelectItem>
                    <SelectItem value="dollar">دولار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editTransaction.type === 'exchange' && (
                <div>
                  <Label>إلى عملة</Label>
                  <Select
                    value={editTransaction.toCurrency}
                    onValueChange={value => setEditTransaction(prev =>
                      prev ? { ...prev, toCurrency: value as any } : prev
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinar">دينار</SelectItem>
                      <SelectItem value="dollar">دولار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>ملاحظات</Label>
                <Input
                  value={editTransaction.note || ''}
                  onChange={e => setEditTransaction(prev =>
                    prev ? { ...prev, note: e.target.value } : prev
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ التغييرات</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
