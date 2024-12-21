'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Customer } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface CustomerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customer: Customer) => void
  customer?: Customer
}

export function CustomerDialog({ isOpen, onClose, onSubmit, customer }: CustomerDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [dinarBalance, setDinarBalance] = useState('0')
  const [dollarBalance, setDollarBalance] = useState('0')

  useEffect(() => {
    if (customer) {
      setName(customer.name)
      setEmail(customer.email)
      setPhone(customer.phone)
      setAddress(customer.address)
      setDinarBalance(customer.safes.dinar.balance.toString())
      setDollarBalance(customer.safes.dollar.balance.toString())
    } else {
      setName('')
      setEmail('')
      setPhone('')
      setAddress('')
      setDinarBalance('0')
      setDollarBalance('0')
    }
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const customerData: Customer = {
      id: customer ? customer.id : uuidv4(),
      name,
      email,
      phone,
      address,
      avatar: customer ? customer.avatar : '/placeholder.svg?height=100&width=100',
      safes: {
        dinar: { currency: 'dinar', balance: parseFloat(dinarBalance) },
        dollar: { currency: 'dollar', balance: parseFloat(dollarBalance) },
      },
    }
    onSubmit(customerData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                العنوان
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dinarBalance" className="text-right">
                رصيد الدينار
              </Label>
              <Input
                id="dinarBalance"
                type="number"
                value={dinarBalance}
                onChange={(e) => setDinarBalance(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dollarBalance" className="text-right">
                رصيد الدولار
              </Label>
              <Input
                id="dollarBalance"
                type="number"
                value={dollarBalance}
                onChange={(e) => setDollarBalance(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{customer ? 'تحديث' : 'إضافة'} العميل</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

