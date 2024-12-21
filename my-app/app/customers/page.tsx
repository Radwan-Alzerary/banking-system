'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { CustomerDialog } from '@/components/CustomerDialog'
import { Customer } from '@/types'

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  console.log(customers)

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCustomer = async (newCustomer: Omit<Customer, 'id'>) => {
    console.log(newCustomer)
    await addCustomer(newCustomer)
    setIsDialogOpen(false)
  }

  const handleEditCustomer = async (updatedCustomer: Customer) => {
    await updateCustomer(updatedCustomer)
    setEditingCustomer(null)
  }

  const handleDeleteCustomer = async (customerId: string) => {
    await deleteCustomer(customerId)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">العملاء</h1>
      <div className="flex justify-between items-center">
        <Input
          className="max-w-sm"
          placeholder="البحث عن العملاء..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setIsDialogOpen(true)}>إضافة عميل جديد</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>رصيد الدينار</TableHead>
            <TableHead>رصيد الدولار</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.safes.dinar.balance.toFixed(2)} د</TableCell>
              <TableCell>${customer.safes.dollar.balance.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/customers/${customer.id}`}>عرض</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setEditingCustomer(customer)}>تعديل</Button>
                  <Button variant="destructive" onClick={() => handleDeleteCustomer(customer.id)}>حذف</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddCustomer}
      />
      {editingCustomer && (
        <CustomerDialog
          isOpen={true}
          onClose={() => setEditingCustomer(null)}
          onSubmit={handleEditCustomer}
          customer={editingCustomer}
        />
      )}
    </div>
  )
}
