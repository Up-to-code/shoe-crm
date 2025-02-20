export interface Customer {
  id: string;
  name: string;
  phone: string;
  type: string;
  note: string;
  time: Date; // Ensure this is Date if you are using Date objects
  com_from: string;
  createdAt: Date; // Ensure this is Date
  updatedAt: Date; // Ensure this is Date
}
export interface CustomersResponse {
  customers: Customer[]
  currentPage: number
  totalPages: number
  totalCount: number
}

