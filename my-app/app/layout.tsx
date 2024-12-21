import './globals.css'
import { Cairo } from 'next/font/google'
import { AppProvider } from '@/contexts/AppContext'
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from '@/components/Sidebar'

const cairo = Cairo({ subsets: ['arabic'] })

export const metadata = {
  title: 'تطبيق الصرافة',
  description: 'إدارة حسابات الدينار والدولار الخاصة بك',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AppProvider>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-8 px-4 md:px-8">
                  {children}
                </div>
              </main>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

