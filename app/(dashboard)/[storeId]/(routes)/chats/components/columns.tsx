"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ChatColumn = {
  id: string;
  fromUserId: string;
  toUserId: string;
  productId: string;
  chatName: string;
  createdAt: string;
};

export const columns: ColumnDef<ChatColumn>[] = [
  {
    accessorKey: "chatName",
    header: "Chat Name",
  },
  {
    accessorKey: "fromUserId",
    header: "From User",
  },
  {
    accessorKey: "toUserId",
    header: "To User",
  },
  {
    accessorKey: "productId",
    header: "Product Id",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
