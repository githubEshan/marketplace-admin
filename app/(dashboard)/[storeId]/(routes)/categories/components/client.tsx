"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="mr-8 ml-5 flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage Categories for your store"
        />
        <Button
          className="mt-3.5"
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <div className="mr-8 ml-8 mt-4">
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data} />
        <Heading title="API" description="API calls for Categories" />
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId"></ApiList>
      </div>
    </>
  );
};
