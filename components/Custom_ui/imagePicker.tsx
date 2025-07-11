import Image from "next/image";
import { Button } from "../ui/button";
import { Plus, Trash, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface ImagePickerProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}


export default function ImagePickerr({
  onChange,
  onRemove,
  value,
}: ImagePickerProps) {

    const onUpload = (result: any) => {
        console.log("result.info.secure_url");
           onChange(result.info.secure_url);
      };
      return (
        <div className="!mb-4">
          <div className=" mb-2 flex flex-wrap items-center gap-4">
            {value.map((url) => (
              <div key={url} className="relative w-[200px] h-[200px]">
                <div className="absolute top-0 right-0 z-10">
                  <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Image
                  src={url}
                  alt="collection"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            ))}
          </div>
    
          <CldUploadWidget uploadPreset="myyu6boo" onUpload={onUpload} >
            {({ open }) => {
              return (
                <Button type="button" onClick={() => open()} className="bg-grey-1 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              );
            }}
          </CldUploadWidget>
        </div>
      );
}
