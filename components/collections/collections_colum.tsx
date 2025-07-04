"use client"

import { ColumnDef } from "@tanstack/react-table"

import Delete from "../Custom_ui/Delete"
import Link from "next/link"


  const columns: ColumnDef<CollectionType>[] = [
  {
    accessorKey: "title",
    header: "Title",
   cell: ({row}) => (
        <Link href={`/collections/${row.original._id}`} className="hover:text-red-1  ">
            
            {row.original.title}
        </Link>

    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <p>{row.original.products?.length}</p>,
  },
  {
    id: "action",
    cell: ({ row }) => ( <Delete item="collection" id={row.original._id}/>)
  },
]
export default columns
