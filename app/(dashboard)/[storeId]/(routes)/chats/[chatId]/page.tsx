import prismadb from "@/lib/prismadb";
import { ChatForm } from "./components/chat-form";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  try {
    const { chatId } = params;

    if (!chatId) {
      throw new Error("Missing chatId");
    }

    const chat = await prismadb.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    return (
      <div className="flex-col">
        <div className="space-y-2 p-8">
          <ChatForm initialData={chat} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    return <div>Something went wrong.</div>;
  }
};

export default ChatPage;
