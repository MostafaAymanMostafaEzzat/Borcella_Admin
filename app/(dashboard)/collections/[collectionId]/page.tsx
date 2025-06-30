'use client'

import CollectionForm from "@/components/collections/CollectionForm"
import Loader from "@/components/Custom_ui/Loader"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"



export default function Page  ({params } : {params : { collectionId: string }}) {

const [collection, setCollection] = useState<CollectionType | null>(null)
const [loading, setLoading] = useState(false)

    const getCollection = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/collections/${params.collectionId}`)
            setCollection(res.data)
            // toast.success("Collection fetched successfully")
            setLoading(false)


        } catch (err) {
            console.log("[collection_GET]", err)
        }
    }

    useEffect(() => {
        getCollection()
    }, [])

    return (

loading ? <Loader /> : (
    <CollectionForm initialData={collection}/>
  )
    )
    

}