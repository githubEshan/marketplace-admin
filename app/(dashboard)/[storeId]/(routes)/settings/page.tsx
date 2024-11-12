import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


interface SettingsPageprops {
    params: {
        storeId: string;
    }
}

const SettingsPage = () => {
    
    const { userId } = auth()

    if(!userId){
        redirect("/sign-in");
    }

    
    const store = await prismadb.store.
    
    return (
        <div>
        Settings
        </div>
    )
}


export default SettingsPage;