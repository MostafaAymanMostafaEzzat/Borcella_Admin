
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<OrderItemType>[] = [
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => (
        <Link href={`/products/${row.original.product._id}`} className="hover:text-red-1">
            {row.original.product.title}
        </Link>
        ),
    },
    {
        accessorKey: "color",
        header: "Color",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
]