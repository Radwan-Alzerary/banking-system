'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAppContext } from '@/contexts/AppContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { BankAccount } from "@/components/BankAccount"
import { ExchangePanel } from "@/components/ExchangePanel"
import { CustomerAnalysis } from "@/components/CustomerAnalysis"
import { TransferMoney } from "@/components/TransferMoney"
import { Button } from "@/components/ui/button"
import { CustomerDialog } from '@/components/CustomerDialog'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionList } from '@/components/TransactionList' // Import TransactionList

export default function CustomerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { customers, updateCustomer, deleteCustomer } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const customer = customers.find(c => c.id === params.id)

  if (!customer) {
    return <div>Customer not found</div>
  }

  // This function re-fetches the latest customer data
  // (Adjust the URL and logic as needed for your API)
  const refreshCustomer = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${customer.id}`)
      if (!res.ok) throw new Error('Failed to fetch customer')
      const updatedCustomer = await res.json()
      updateCustomer(updatedCustomer)
    } catch (error) {
      console.error('Error refreshing customer:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleDelete = async () => {
    await deleteCustomer(customer.id)
    router.push('/customers')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <p className="text-muted-foreground">{customer.email}</p>
              <p className="text-muted-foreground">{customer.phone}</p>
              <p className="text-muted-foreground">{customer.address}</p>
            </div>
          </div>
          <div className="space-x-2">
            <Button onClick={handleEdit}>تعديل</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">الحسابات</TabsTrigger>
          <TabsTrigger value="transfer">التحويل</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          <TabsTrigger value="analysis">التحليل</TabsTrigger>
        </TabsList>
        <TabsContent value="accounts">
          <div className="grid gap-6 md:grid-cols-2">
            <BankAccount
              currency="dinar"
              balance={customer.safes.dinar.balance}
              customerId={customer.id}
            />
            <BankAccount
              currency="dollar"
              balance={customer.safes.dollar.balance}
              customerId={customer.id}
            />
          </div>
          <div className="mt-6">
            <ExchangePanel
              dinarBalance={customer.safes.dinar.balance}
              dollarBalance={customer.safes.dollar.balance}
              customerId={customer.id}
            />
          </div>
        </TabsContent>
        <TabsContent value="transfer">
          <TransferMoney fromCustomerId={customer.id} />
        </TabsContent>
        <TabsContent value="transactions">
          {/* Pass refreshCustomer as the onTransactionUpdate callback */}
          <TransactionList customerId={customer.id} onTransactionUpdate={refreshCustomer} />
        </TabsContent>
        <TabsContent value="analysis">
          <CustomerAnalysis customerId={customer.id} />
        </TabsContent>
      </Tabs>

      {isEditing && (
        <CustomerDialog
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={async (updatedCustomer) => {
            await updateCustomer(updatedCustomer)
            setIsEditing(false)
          }}
          customer={customer}
        />
      )}
    </div>
  )
}
