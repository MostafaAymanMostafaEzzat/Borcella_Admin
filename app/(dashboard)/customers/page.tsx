import { DataTable } from "@/components/Custom_ui/DataTable";
import { columns } from "@/components/customers/CustomerColumns";

import { Separator } from "@/components/ui/separator";
import Customer from "@/lib/models/Customer";
import connectToDB from "@/lib/mongoDB";
import axios from "axios";




export default async function Customers(){

    await connectToDB()

    const customers = await Customer.find().sort({ createdAt: "desc" })
    return(
        <div className="p-4">
                <h1 className="text-heading2-bold "> Customers</h1>
                <Separator className="bg-slate-500/50 h-[0.5px] w-full mt-8" />

                <DataTable columns={columns} data={customers} searchKey="title" />
            </div>

    )
}