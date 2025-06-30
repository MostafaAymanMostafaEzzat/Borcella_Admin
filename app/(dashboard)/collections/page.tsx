"use client";

import columns from "@/components/collections/collections_colum";
import { DataTable } from "@/components/Custom_ui/DataTable";
import Loader from "@/components/Custom_ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Plus, SeparatorHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const getCollections = async () => {
    try {
      const res = await axios.get("/api/collections");
      setCollections(res.data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };
  useEffect(() => {
    getCollections();
  }, []);

  return loading ? 
      <Loader />
    : (
      <div className="p-6 ">
        <div className="flex justify-between items-center">
          <h2 className="text-heading2-bold ">Collection</h2>
          <Button
            onClick={() => router.push("/collections/new")}
            className="flex gap-3 items-center bg-blue-600 text-white "
          >
            <Plus className="w-5 h-5 " /> Create Collection
          </Button>
        </div>
               <Separator className="bg-slate-500/50 h-[0.5px] w-full mt-8" />
       
        <DataTable columns={columns} data={collections} searchKey="title" />
      </div>
    )
  
}
