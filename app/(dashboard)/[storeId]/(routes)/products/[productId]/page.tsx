import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/billboard-form";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
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

    return (
      <div className="flex-col">
        <div className="space-y-2 p-8">
          <ProductForm initialData={product} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch billboard:", error);
    return <div>Something went wrong.</div>;
  }
};

export default ProductPage;
