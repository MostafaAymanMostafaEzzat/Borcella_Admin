"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DeleteProps {
    item: string;
    id: string;
  }

export default function Delete({ item, id }: DeleteProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
    const handleDelete = async () => {
       
        try {
          setLoading(true)
          const itemType = item === 'product' ? 'products': 'collections'
          const res = await fetch(`/api/${itemType}/${id}` , {method : 'DELETE'})
          if(res.ok){
            setLoading(false);
            router.refresh();
            toast.success(`${item} deleted successfully`)
            
          }
          if(res.status === 404){
            setLoading(false);
            toast.error(`${item} not found`)
          }
        } catch (error) {
          console.log(error)
  
          toast.error("Something went wrong! Please try again.")
        }
        
        
    };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
