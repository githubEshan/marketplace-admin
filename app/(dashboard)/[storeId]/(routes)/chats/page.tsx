import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ChatClient } from "./components/client";
import { ChatColumn } from "./components/columns";

const ChatsPage = async ({ params }: { params: { storeId: string } }) => {
  const chats = await prismadb.chat.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedChat: ChatColumn[] = chats.map((item) => ({
    id: item.id,
    fromUserId: item.fromUserId,
    toUserId: item.toUserId,
    productId: item.productId,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ChatClient data={formattedChat} />
      </div>
    </div>
  );
};

export default ChatsPage;
