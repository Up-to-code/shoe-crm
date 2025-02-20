"use client"

import { useState, useCallback, useEffect } from "react"
import CustomerForm from "@/components/CustomerForm"
import CustomerList from "@/components/CustomerList"
import { Button } from "@/components/ui/button"
import type { Customer } from "@/types"
import { cairo } from "./fonts"

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchCustomers = useCallback(async (page: number, search = "") => {
    setIsLoading(true)
    const res = await fetch(`/api/customers?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
    if (res.ok) {
      const data = await res.json()
      setCustomers(data.customers)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchCustomers(currentPage, searchQuery)
  }, [fetchCustomers, currentPage, searchQuery])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFormSubmit = () => {
    fetchCustomers(1, searchQuery) // Refresh the list and go back to the first page
    setShowForm(false) // Hide the form after submission
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${cairo.className}`}>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900"   >
            crm
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Button onClick={() => setShowForm(!showForm)} className="mb-4">
              {showForm ? "إخفاء النموذج" : "إظهار نموذج المشتري"}
            </Button>
            <div className="grid md:grid-cols-2 gap-6">
              <div>{showForm && <CustomerForm onSubmit={handleFormSubmit} />}</div>
              <div>
                <CustomerList
                  customers={customers}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

