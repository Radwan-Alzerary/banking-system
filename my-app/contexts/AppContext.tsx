'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Customer, ExchangeRate, Transaction } from '@/types'

interface AppContextType {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>
  updateCustomer: (customer: Customer) => Promise<void>
  deleteCustomer: (customerId: string) => Promise<void>
  exchangeRate: ExchangeRate
  setExchangeRate: React.Dispatch<React.SetStateAction<ExchangeRate>>
  transactions: Transaction[]
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>
  transferMoney: (fromCustomerId: string, toCustomerId: string, amount: number, currency: 'dinar' | 'dollar') => Promise<void>
  backupData: () => Promise<string>
  importData: (data: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    dinarToDollar: 0.33,
    dollarToDinar: 3.0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [customersRes, exchangeRateRes, transactionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/customers`),
          fetch(`${API_BASE_URL}/exchange-rate`),
          fetch(`${API_BASE_URL}/transactions`) // If you have a GET /transactions endpoint
        ])

        const [customersData, exchangeRateData, transactionsData] = await Promise.all([
          customersRes.json(),
          exchangeRateRes.json(),
          transactionsRes.json()
        ])

        setCustomers(customersData)
        setExchangeRate({
          dinarToDollar: exchangeRateData.dinarToDollar,
          dollarToDinar: exchangeRateData.dollarToDinar
        })
        setTransactions(transactionsData)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }

    fetchData()
  }, [])

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      console.log("xx")
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      })

      if (!res.ok) {
        throw new Error('Failed to create customer')
      }

      const newCustomer: Customer = await res.json()
      setCustomers(prev => [...prev, newCustomer])
    } catch (error) {
      console.error(error)
    }
  }

  const updateCustomer = async (updatedCustomer: Customer) => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers/${updatedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer)
      })

      if (!res.ok) {
        throw new Error('Failed to update customer')
      }

      const result: Customer = await res.json()
      setCustomers(prev => prev.map(c => c.id === result.id ? result : c))
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCustomer = async (customerId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete customer')
      }

      setCustomers(prev => prev.filter(c => c.id !== customerId))
    } catch (error) {
      console.error(error)
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      })
      if (!res.ok) {
        throw new Error('Failed to create transaction')
      }
      const newTransaction: Transaction = await res.json()
      setTransactions(prev => [...prev, newTransaction])

      // Update the corresponding customer's balances by refetching or adjusting state
      // Let's refetch customers to keep it simple (or you could optimize by updating local state)
      const customersRes = await fetch(`${API_BASE_URL}/customers`)
      const customersData = await customersRes.json()
      setCustomers(customersData)
    } catch (error) {
      console.error(error)
    }
  }

  const transferMoney = async (fromCustomerId: string, toCustomerId: string, amount: number, currency: 'dinar' | 'dollar') => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCustomerId, toCustomerId, amount, currency })
      })

      if (!res.ok) {
        throw new Error('Failed to transfer money')
      }

      const data = await res.json()
      // The response contains newly created transactions (withdrawTransaction, depositTransaction)
      setTransactions(prev => [...prev, data.withdrawTransaction, data.depositTransaction])

      // Refetch customers to update balances
      const customersRes = await fetch(`${API_BASE_URL}/customers`)
      const customersData = await customersRes.json()
      setCustomers(customersData)
    } catch (error) {
      console.error(error)
    }
  }

  const backupData = async (): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/backup`)
      if (!res.ok) {
        throw new Error('Failed to backup data')
      }
      const data = await res.json()
      return JSON.stringify(data)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const importData = async (data: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      })
      if (!res.ok) {
        throw new Error('Failed to import data')
      }

      // Refetch everything after import
      const [customersRes, exchangeRateRes, transactionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customers`),
        fetch(`${API_BASE_URL}/exchange-rate`),
        fetch(`${API_BASE_URL}/transactions`)
      ])
      const [customersData, exchangeRateData, transactionsData] = await Promise.all([
        customersRes.json(),
        exchangeRateRes.json(),
        transactionsRes.json()
      ])
      console.log(customersData)
      setCustomers(customersData)
      setExchangeRate({
        dinarToDollar: exchangeRateData.dinarToDollar,
        dollarToDinar: exchangeRateData.dollarToDinar
      })
      setTransactions(transactionsData)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <AppContext.Provider 
      value={{ 
        customers, 
        setCustomers, 
        addCustomer, 
        updateCustomer, 
        deleteCustomer, 
        exchangeRate, 
        setExchangeRate, 
        transactions, 
        setTransactions,
        addTransaction,
        transferMoney,
        backupData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
