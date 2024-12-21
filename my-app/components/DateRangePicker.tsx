'use client'

import * as React from "react"
import { CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
  onChange: (range: [Date | undefined, Date | undefined]) => void
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>()

  const handleRangeSelect = (value: string) => {
    const today = new Date()
    let start: Date, end: Date

    switch (value) {
      case 'today':
        start = startOfDay(today)
        end = endOfDay(today)
        break
      case 'yesterday':
        start = startOfDay(addDays(today, -1))
        end = endOfDay(addDays(today, -1))
        break
      case 'last7days':
        start = startOfDay(addDays(today, -6))
        end = endOfDay(today)
        break
      case 'thisWeek':
        start = startOfWeek(today)
        end = endOfWeek(today)
        break
      case 'lastWeek':
        start = startOfWeek(addDays(today, -7))
        end = endOfWeek(addDays(today, -7))
        break
      case 'thisMonth':
        start = startOfMonth(today)
        end = endOfMonth(today)
        break
      case 'lastMonth':
        start = startOfMonth(addDays(today, -30))
        end = endOfMonth(addDays(today, -30))
        break
      default:
        return
    }

    setDate({ from: start, to: end })
    onChange([start, end])
  }

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {date.from.toDateString()} - {date.to.toDateString()}
                </>
              ) : (
                date.from.toDateString()
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              onChange([newDate?.from, newDate?.to])
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Select onValueChange={handleRangeSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7days">Last 7 days</SelectItem>
          <SelectItem value="thisWeek">This week</SelectItem>
          <SelectItem value="lastWeek">Last week</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="lastMonth">Last month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

