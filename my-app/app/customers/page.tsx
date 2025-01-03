'use client';

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { CustomerDialog } from '@/components/CustomerDialog';
import { Customer } from '@/types';

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = async (newCustomer: Customer) => {
    await addCustomer(newCustomer);
    setIsDialogOpen(false);
  };

  const handleEditCustomer = async (updatedCustomer: Customer) => {
    await updateCustomer(updatedCustomer);
    setEditingCustomer(null);
  };

  const confirmDeleteCustomer = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCustomer = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete);
      setCustomerToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

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
              <TableCell>
                {customer.safes.dinar.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })} د
              </TableCell>
              <TableCell>
                $
                {customer.safes.dollar.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/customers/${customer.id}`}>عرض</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingCustomer(customer)}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDeleteCustomer(customer.id)}
                  >
                    حذف
                  </Button>
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
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg space-y-4">
            <h2 className="text-xl font-bold">تأكيد الحذف</h2>
            <p>هل أنت متأكد أنك تريد حذف هذا العميل؟</p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDeleteCustomer}>
                حذف
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
