"use client"

import type React from "react"

import { useState } from "react"
import type { Customer } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { arSA } from "date-fns/locale"
import { cairo } from "../app/fonts"

interface CustomerListProps {
  customers: Customer[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
}

export default function CustomerList({
  customers,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}: CustomerListProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const renderCustomerList = (type: "all" | "sale" | "payment") => (
    <div className="space-y-4">
      {customers
        .filter((customer) => (type === "all" ? true : customer.type === type))
        .map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  <p className="text-sm text-muted-foreground">{customer.com_from}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(customer.time), "PPP HH:mm", { locale: arSA })}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">
                  {customer.type === "sale" ? "بيع" : customer.type === "payment" ? "شاري" : customer.type}
                </p>
                <p className="text-sm">{customer.note}</p>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )

  return (
    <Card className={cairo.className}>
      <CardHeader>
        <CardTitle>قائمة المشترين</CardTitle>
        <form onSubmit={handleSearch} className="mt-2">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">بحث</Button>
          </div>
        </form>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | "sale" | "payment")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="sale">بيع</TabsTrigger>
            <TabsTrigger value="payment">شاري</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{isLoading ? <p>جاري التحميل...</p> : renderCustomerList("all")}</TabsContent>
          <TabsContent value="sale">{isLoading ? <p>جاري التحميل...</p> : renderCustomerList("sale")}</TabsContent>
          <TabsContent value="payment">
            {isLoading ? <p>جاري التحميل...</p> : renderCustomerList("payment")}
          </TabsContent>
        </Tabs>
        <div className="flex justify-between items-center mt-4">
          <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading}>
            السابق
          </Button>
          <span>
            الصفحة {currentPage} من {totalPages}
          </span>
          <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading}>
            التالي
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

