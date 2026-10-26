import { isValidObjectId } from "mongoose";
import { auth } from "@/src/lib/auth";
import dbConnect from "@/src/lib/db";
import MessageModel from "@/src/model/Message.model";
import type { ApiResponse } from "@/src/types/ApiResponse";

function json(body: ApiResponse, status = 200) {
  return Response.json(body, { status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ success: false, message: "Not authenticated" }, 401);

  const { messageId } = await params;
  if (!isValidObjectId(messageId)) {
    return json({ success: false, message: "Invalid message id" }, 400);
  }

  try {
    await dbConnect();
    // Filtering by userId means you can only delete your own messages.
    const result = await MessageModel.deleteOne({
      _id: messageId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return json({ success: false, message: "Message not found" }, 404);
    }
    return json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("delete-message error:", error);
    return json({ success: false, message: "Could not delete message" }, 500);
  }
}
