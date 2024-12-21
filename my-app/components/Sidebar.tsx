'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, DollarSign, Settings, BarChart, ClipboardList, Menu, Moon, Sun } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

const navItems = [
  { href: '/', icon: Home, label: 'الرئيسية' },
  { href: '/customers', icon: Users, label: 'العملاء' },
  { href: '/exchange', icon: DollarSign, label: 'الصرف' },
  { href: '/transactions', icon: ClipboardList, label: 'المعاملات' },
  { href: '/analysis', icon: BarChart, label: 'التحليل' },
  { href: '/settings', icon: Settings, label: 'الإعدادات' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6" />
          <span className="font-bold text-lg">تطبيق الصرافة</span>
        </Link>
        {mounted && (
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">تبديل السمة</span>
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2 py-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-right",
                pathname === item.href
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-transparent hover:underline"
              )}
            >
              <Link href={item.href}>
                <item.icon className="ml-2 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <p className="text-sm text-muted-foreground">
          {mounted && (theme === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح')}
        </p>
      </div>
    </>
  )

  return (
    <>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 right-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
          <div className="h-full flex flex-col">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex h-screen border-l">
        <div className="flex w-64 flex-col">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

