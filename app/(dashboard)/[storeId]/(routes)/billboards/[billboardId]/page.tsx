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
            <div>
                <BillBoardForm  initialData ={billboard}/>
            </div>
        </>
    )
}


export default BillboardPage