"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { arSA } from "date-fns/locale"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cairo } from "../app/fonts"

interface CustomerFormProps {
  onSubmit: () => void
}

export default function CustomerForm({ onSubmit }: CustomerFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [type, setType] = useState<string>("sale")
  const [customType, setCustomType] = useState("")
  const [note, setNote] = useState("")
  const [time, setTime] = useState<Date>()
  const [comFrom, setComFrom] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalType = type === "custom" ? customType : type
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        type: finalType,
        note,
        time: time?.toISOString(),
        com_from: comFrom,
      }),
    })
    if (response.ok) {
      setName("")
      setPhone("")
      setType("sale")
      setCustomType("")
      setNote("")
      setTime(undefined)
      setComFrom("")
      onSubmit()
    }
  }

  return (
    <Card className={`mb-6 ${cairo.className}`}>
      <CardHeader>
        <CardTitle>إضافة مشتري جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>النوع</Label>
            <RadioGroup defaultValue="sale" onValueChange={setType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sale" id="sale" />
                <Label htmlFor="sale">بيع</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="payment" id="payment" />
                <Label htmlFor="payment">شاري</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">آخر</Label>
              </div>
            </RadioGroup>
            {type === "custom" && (
              <Input
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="أدخل النوع المخصص"
                required
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">ملاحظات</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>التاريخ والوقت</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-right font-normal ${!time && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {time ? format(time, "PPP HH:mm", { locale: arSA }) : <span>اختر تاريخًا ووقتًا</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={time} onSelect={setTime} initialFocus locale={arSA} />
                <div className="p-2">
                  <Input
                    type="time"
                    value={time ? format(time, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":")
                      const newTime = new Date(time || new Date())
                      newTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                      setTime(newTime)
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comFrom">مصدر المشتري</Label>
            <Input id="comFrom" value={comFrom} onChange={(e) => setComFrom(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">
            إضافة المشتري
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

