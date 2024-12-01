import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ProductClient } from "./components/client";
import {  ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    isListed: item.isListed,
    price : formatter.format(item.price.toNumber()),
    createdAt: format(item.createdAt, "MMMM do, yyyy")

  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
