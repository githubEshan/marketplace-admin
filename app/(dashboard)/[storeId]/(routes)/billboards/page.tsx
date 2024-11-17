import { BillboardClient } from "./components/client";


const billboards = () => {
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4">
                <BillboardClient/>
            </div>

        </div>
    )
}

export default billboards;