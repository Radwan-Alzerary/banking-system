import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/Overview"
import { RecentTransactions } from "@/components/RecentTransactions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">٢٥٤</div>
            <p className="text-xs text-muted-foreground">+٥٥ منذ آخر شهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي رصيد الدينار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">١،٢٣٤،٥٦٧ د</div>
            <p className="text-xs text-muted-foreground">+٢٪ منذ آخر شهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي رصيد الدولار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$٩٨٧،٦٥٤</div>
            <p className="text-xs text-muted-foreground">+٥٪ منذ آخر شهر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سعر الصرف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">١ دولار = ٣.٠ د</div>
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
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>المعاملات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

