"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";   

export default function MultiSelect({
  placeholder,
  value,
  onChange,
  onRemove,
  collections,
}: {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  collections: CollectionType[];
}) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const selected = collections.filter((item) => value.includes(item._id));
  const unselected = collections.filter((item) => !value.includes(item._id));

  return (

    <Command className=" bg-white overflow-visible">
      <div className="flex gap-1 flex-wrap border rounded-md ">
        {selected.length > 0
          ? selected.map((item) => (
              <Badge
                variant="outline"
                className="bg-grey-1/40 text-white flex gap-1"
                key={item._id}
              >
                {item.title}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(item._id);
                  }}
                  className="outline-none hover:bg-red-600 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))
          : null}
                <CommandInput
        placeholder={placeholder}
        value={inputValue}
        onValueChange={(value) => setInputValue(value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="border-none outline-none"
        
      />

      </div>


      <div className=" mt-2 relative">
        {open && <CommandGroup className="absolute  top-0 left-0 w-full z-50 border rounded-md shadow-md">
          {unselected.length > 0 ? (
            unselected.map((item) => (
              <CommandItem
                key={item._id}
                value={item.title}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(item._id);
                  setInputValue("");
                }}
                  className="hover:bg-grey-2 cursor-pointer"
              >
                <span>{item.title}</span>
              </CommandItem>
            ))
          ) : (
            null
          )}
        </CommandGroup> }
      </div>
    </Command>
  );
}
