import { z } from "zod";
import dbConnect from "@/src/lib/db";
import MessageModel from "@/src/model/Message.model";
import { findUserByUsername } from "@/src/lib/users";
import { messageSchema } from "@/src/schema/message.schema";
import { usernameValidation } from "@/src/schema/signUp.schema";
import { getClientIp, rateLimit } from "@/src/lib/rate-limit";
import type { ApiResponse } from "@/src/types/ApiResponse";

const bodySchema = messageSchema.extend({ username: usernameValidation });

function json(body: ApiResponse, status = 200) {
  return Response.json(body, { status });
}

// Public: anyone may send an anonymous message to an accepting user.
export async function POST(request: Request) {
  // 5 messages per minute per IP, to blunt spam and flooding.
  const limit = rateLimit(`send:${getClientIp(request)}`, 5, 60_000);
  if (!limit.allowed) {
    return Response.json(
      {
        success: false,
        message: `Too many messages. Try again in ${limit.retryAfterSeconds}s.`,
      } satisfies ApiResponse,
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

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
