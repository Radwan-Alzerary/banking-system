'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { backupData, importData } = useAppContext()
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleBackup = async () => {
    try {
      const backupString = await backupData()
      const blob = new Blob([backupString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'money_exchanger_backup.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error creating backup:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    try {
      const fileContent = await importFile.text()
      importData(fileContent)
      toast({
        title: "تم الاستيراد بنجاح",
        description: "تم استيراد البيانات بنجاح.",
      })
    } catch (error) {
      console.error('Error importing data:', error)
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد البيانات. يرجى التحقق من الملف والمحاولة مرة أخرى.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">الإعدادات</h1>
      <Card>
        <CardHeader>
          <CardTitle>النسخ الاحتياطي والاستيراد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button onClick={() => void handleBackup()}>تصدير النسخة الاحتياطية</Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="import-file">استيراد البيانات</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleImport} disabled={!importFile}>
                استيراد
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

