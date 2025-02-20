export interface Customer {
  id: string
  name: string
  phone: string
  type: string
  note: string
  time: string
  com_from: string
  createdAt: string
  updatedAt: string
}

export interface CustomersResponse {
  customers: Customer[]
  currentPage: number
  totalPages: number
  totalCount: number
}

