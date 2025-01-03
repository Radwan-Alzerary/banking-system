'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/Overview"
import { RecentTransactions } from "@/components/RecentTransactions"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalDinarBalance: 0,
    totalDollarBalance: 0,
    exchangeRateValue: 3.0,
    recentTransactions: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <div>جاري تحميل لوحة التحكم...</div>
  if (error) return <div>خطأ: {error}</div>

  const { totalCustomers, totalDinarBalance, totalDollarBalance, exchangeRateValue, recentTransactions } = dashboardData

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+٥٥ منذ آخر شهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي رصيد الدينار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDinarBalance.toLocaleString()} د</div>
            <p className="text-xs text-muted-foreground">+٢٪ منذ آخر شهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي رصيد الدولار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDollarBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+٥٪ منذ آخر شهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سعر الصرف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">١ دولار = {exchangeRateValue.toFixed(0)} د</div>
            <p className="text-xs text-muted-foreground">تحديث منذ ٥ دقائق</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={dashboardData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>المعاملات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
