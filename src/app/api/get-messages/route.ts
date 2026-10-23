import { auth } from "@/src/lib/auth";
import { getMessagesForUser } from "@/src/lib/messages";
import type { ApiResponse } from "@/src/types/ApiResponse";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json(
      { success: false, message: "Not authenticated" } satisfies ApiResponse,
      { status: 401 },
    );
  }

  try {
    const messages = await getMessagesForUser(session.user.id);
    return Response.json({
      success: true,
      message: "OK",
      messages,
    } satisfies ApiResponse);
  } catch (error) {
    console.error("get-messages error:", error);
    return Response.json(
      { success: false, message: "Could not load messages" } satisfies ApiResponse,
      { status: 500 },
    );
  }
}
