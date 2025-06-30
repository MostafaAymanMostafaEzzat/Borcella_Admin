import { DataTable } from "@/components/Custom_ui/DataTable";
import { columns } from "@/components/Order/order_column";
import { Separator } from "@/components/ui/separator";
import axios from "axios";



export const dynamic = "force-dynamic";

export default async function Orders(){

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
    const orders = res.data;
    return(
        <div className="p-4">
                <h1 className="text-heading2-bold "> Orders</h1>
                <Separator className="bg-slate-500/50 h-[0.5px] w-full mt-8" />

                <DataTable columns={columns} data={orders} searchKey="title" />
            </div>

    )
}