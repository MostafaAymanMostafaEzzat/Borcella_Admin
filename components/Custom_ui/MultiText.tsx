import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";





export default function MultiText({placeholder , value , onChange , onRemove} : {placeholder: string , value: string[], onChange: (value: string) => void, onRemove: (value: string) => void} ) {

    const [inputValue, setInputValue] = useState("");

    return(
        <div className="flex flex-col gap-2">
          <Input 
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault()
                    onChange(inputValue)
                    setInputValue("");
                }}
            }
            />
            <div className="flex gap-2 flex-wrap ">
                {value.map((item, index) => (
                    <Badge variant="outline"  className="bg-grey-1 text-white flex gap-1 rounded-full">
                        {item}
                        <button
                        onClick={(e) => onRemove(item) }
                        className="outline-none hover:bg-red-600 rounded-full"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
            
    )
}