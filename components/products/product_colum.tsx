
"use client"

import { ColumnDef } from "@tanstack/react-table"

import Delete from "../Custom_ui/Delete"
import Link from "next/link"


  const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
   cell: ({row}) => (
        <Link href={`/products/${row.original._id}`} className="hover:text-red-1  ">
            
            {row.original.title}
        </Link>

    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
    accessorKey: "expense",
    header: "Expense ($)",
  },
  {
    id: "action",
    cell: ({ row }) => ( <Delete item="product" id={row.original._id}/>)
  },
]
export default columns
