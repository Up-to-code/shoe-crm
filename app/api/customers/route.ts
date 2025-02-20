import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const search = searchParams.get("search") || ""
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { phone: { contains: search } },
          { type: { contains: search } },
          { note: { contains: search } },
          { com_from: { contains: search } },
        ],
      }
    : {}

  const [customers, totalCount] = await Promise.all([
    prisma.cRM_Customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { time: "desc" },
    }),
    prisma.cRM_Customer.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({
    customers,
    currentPage: page,
    totalPages,
    totalCount,
  })
}

export async function POST(request: Request) {
  const data = await request.json()
  const newCustomer = await prisma.cRM_Customer.create({
    data: {
      name: data.name,
      phone: data.phone,
      type: data.type,
      note: data.note || "",
      time: new Date(data.time),
      com_from: data.com_from || "",
    },
  })
  return NextResponse.json(newCustomer, { status: 201 })
}

