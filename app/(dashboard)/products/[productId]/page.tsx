import ProductForm from "@/components/products/product_Form";
import axios from "axios";

export default async function ProductPage({
  params
}: {
  params: { productId: string };
}) {


  const res = await axios.get( `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.productId}`);
  const product =  res.data;
     
    return <ProductForm initialData={product} />;
}
