import { auth } from "@/src/lib/auth";
import { acceptMessageSchema } from "@/src/schema/acceptMessage.schema";
import type { ApiResponse } from "@/src/types/ApiResponse";

function json(body: ApiResponse, status = 200) {
  return Response.json(body, { status });
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ success: false, message: "Not authenticated" }, 401);

  return json({
    success: true,
    message: "OK",
    isAcceptingMessages: session.user.isAcceptingMessage ?? true,
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ success: false, message: "Not authenticated" }, 401);

  const parsed = acceptMessageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ success: false, message: "Invalid request body" }, 400);
  }

  try {
    await auth.api.updateUser({
      headers: request.headers,
      body: { isAcceptingMessage: parsed.data.acceptMessage },
    });
    return json({
      success: true,
      message: "Message acceptance updated",
      isAcceptingMessages: parsed.data.acceptMessage,
    });
  } catch (error) {
    console.error("accept-messages error:", error);
    return json({ success: false, message: "Could not update setting" }, 500);
  }
}
