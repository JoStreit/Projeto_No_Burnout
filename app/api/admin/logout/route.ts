import { cookies } from "next/headers";
import { revogarToken } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (token) revogarToken(token);
  cookieStore.delete("session_admin");
  return Response.json({ ok: true });
}
