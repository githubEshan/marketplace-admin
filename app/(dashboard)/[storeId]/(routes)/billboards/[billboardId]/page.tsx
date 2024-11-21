import prismadb from "@/lib/prismadb";
import { BillBoardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  try {
    const { billboardId } = params;

    if (!billboardId) {
      throw new Error("Missing billboardId");
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return (
      <div className="flex-col">
        <div className="space-y-2 p-8">
          <BillBoardForm initialData={billboard} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch billboard:", error);
    return <div>Something went wrong.</div>;
  }
};

export default BillboardPage;
