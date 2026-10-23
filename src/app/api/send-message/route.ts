import { z } from "zod";
import dbConnect from "@/src/lib/db";
import MessageModel from "@/src/model/Message.model";
import { findUserByUsername } from "@/src/lib/users";
import { messageSchema } from "@/src/schema/message.schema";
import { usernameValidation } from "@/src/schema/signUp.schema";
import type { ApiResponse } from "@/src/types/ApiResponse";

const bodySchema = messageSchema.extend({ username: usernameValidation });

function json(body: ApiResponse, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json(
      { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request" },
      400,
    );
  }

  try {
    const user = await findUserByUsername(parsed.data.username);
    if (!user) return json({ success: false, message: "User not found" }, 404);
    if (!user.isAcceptingMessage) {
      return json({ success: false, message: "This user is not accepting messages" }, 403);
    }

    await dbConnect();
    await MessageModel.create({ userId: user.id, content: parsed.data.content });

    return json({ success: true, message: "Message sent" }, 201);
  } catch (error) {
    console.error("send-message error:", error);
    return json({ success: false, message: "Could not send message" }, 500);
  }
}

export type SendMessageBody = z.infer<typeof bodySchema>;
