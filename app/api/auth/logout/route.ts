import { cookies } from "next/headers";
import { revogarToken } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (token) revogarToken(token);
  cookieStore.delete("session");
  return Response.json({ ok: true });
}
