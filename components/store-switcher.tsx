import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronsUpDown, Store as StoreIcon } from "lucide-react";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandInput } from "./ui/command";
import { CommandList } from "cmdk";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof Popover>

interface StoreSwitcherProps extends PopoverTriggerProps{
    items: Store[];
};

export default function StoreSwitcher({
    className,
    items = []

}: StoreSwitcherProps) {

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))


    const currentStore = formattedItems.findIndex((item) => item.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store: { value: String, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        <Popover open= {open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant = "outline"
                    size="sm"
                    role="combobox"
                    aria-expanded= {open}
                    aria-label="Select Store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className=" mr-2 h-4 w-4"/>
                    Current Store
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <CommandList>
                    <Command>
                        <CommandInput placeholder=""></CommandInput>
                    </Command>
                </CommandList>
            </PopoverContent>
        </Popover>
    )
}