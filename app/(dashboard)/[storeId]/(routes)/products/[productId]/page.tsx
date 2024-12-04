import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/products-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  try {
    const { productId } = params;

    if (!productId) {
      throw new Error("Missing ProductId");
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });


    return (
      <div className="flex-col">
        <div className="space-y-2 p-8">
          <ProductForm 
          categories = {categories}
          initialData={product} 
          />

        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch billboard:", error);
    return <div>Something went wrong.</div>;
  }
};

export default ProductPage;
