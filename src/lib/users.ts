import { auth } from "@/src/lib/auth";

export type PublicUser = {
  id: string;
  username: string;
  isAcceptingMessage: boolean;
};

// Finds a user by username through better-auth's own adapter, so we never
// have to care how the id is stored in MongoDB.
export async function findUserByUsername(
  username: string,
): Promise<PublicUser | null> {
  const ctx = await auth.$context;
  const user = await ctx.adapter.findOne<{
    id: string;
    username?: string | null;
    isAcceptingMessage?: boolean | null;
  }>({
    model: "user",
    where: [{ field: "username", value: username.toLowerCase() }],
  });

  if (!user || !user.username) return null;

  return {
    id: user.id,
    username: user.username,
    isAcceptingMessage: user.isAcceptingMessage ?? true,
  };
}
