import prismadb from "@/lib/prismadb"
import { BillBoardForm } from "./components/billboard-form"

const BillboardPage = async ({
    params
} : {
    params: {billboardId : string}
}) => {

    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    })
    return(
        <>
            <div className="flex-col">
                <div className="space-y-2 p-8">
                    <BillBoardForm initialData={billboard}/>
                </div>
            </div>
        </>
    )
}


export default BillboardPage