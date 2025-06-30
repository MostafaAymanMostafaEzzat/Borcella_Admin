import SalesChart from "@/components/Custom_ui/SalesChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSalesPerMonth, getTotalCustomers, getTotalSales } from "@/lib/action/action";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
  const data = await getSalesPerMonth()
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();
  return (
    <div className="p-4 ">
      <h1 className="text-heading2-bold "> Dashboard</h1>
      <Separator className="bg-slate-500/50 h-[0.5px] w-full mt-8" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div>Total Revenue</div>
              <CircleDollarSign className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            ${totalRevenue}
        </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div>Total Orders</div>
              <ShoppingBag className="max-sm:hidden" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            ${totalOrders}
        </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div>Total Customers</div>
              <UserRound className="max-sm:hidden" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            ${totalCustomers}
        </CardContent>
        </Card>
        <Card className="col-span-full m-4 mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div>Sales Chart ($)</div>
            </CardTitle>
          </CardHeader>
          <CardContent >
            <SalesChart data={data} />
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
