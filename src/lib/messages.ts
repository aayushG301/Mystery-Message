import dbConnect from "@/src/lib/db";
import MessageModel from "@/src/model/Message.model";
import type { MessageItem } from "@/src/types/ApiResponse";

export async function getMessagesForUser(
  userId: string,
): Promise<MessageItem[]> {
  await dbConnect();
  const docs = await MessageModel.find({ userId }).sort({ createdAt: -1 }).lean();

  return docs.map((doc) => ({
    id: String(doc._id),
    content: doc.content,
    createdAt: new Date(doc.createdAt).toISOString(),
  }));
}
