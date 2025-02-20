import type React from "react"
import type { Metadata } from "next"
import { cairo } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "نظام إدارة علاقات العملاء للعقارات",
  description:
    "تطبيق متكامل لإدارة علاقات العملاء في مجال العقارات، يوفر أدوات متقدمة لتحسين تجربة العملاء وزيادة المبيعات.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>{children}</body>
    </html>
  )
}



import './globals.css'