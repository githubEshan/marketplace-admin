import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
  params,
}: {
  params: { categoryId: string; Id: string };
}) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.categoryId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategory: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoryClient data={formattedCategory} />
      </div>
    </div>
  );
};

export default CategoriesPage;
