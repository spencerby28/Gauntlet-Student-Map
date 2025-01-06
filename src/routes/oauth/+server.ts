import { SESSION_COOKIE, createAdminClient } from "$lib/server/appwrite";
import { redirect } from "@sveltejs/kit";

export async function GET(event) {
  // We should have a `userId` and `secret` query parameters in the URL
  const userId = event.url.searchParams.get("userId");
  const secret = event.url.searchParams.get("secret");

  if (!userId || !secret) {
    return new Response("Missing `userId` or `secret` query parameters", {
      status: 400,
    });
  }

  // Exchange the token `userId` and `secret` for a session
  const { account } = createAdminClient();
  const session = await account.createSession(userId, secret);

  // Set the session cookie with proper attributes
  const cookieOptions = {
    path: '/',
    secure: true,
    sameSite: 'lax' as const,
    httpOnly: true,
    expires: new Date(session.expire)
  };

  event.cookies.set(SESSION_COOKIE, session.secret, cookieOptions);

  // Use 307 to ensure cookie is preserved during redirect
  throw redirect(307, "/");
}
