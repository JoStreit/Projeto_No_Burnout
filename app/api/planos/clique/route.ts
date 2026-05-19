import { registrarCliquePlano } from "@/lib/db";

export async function POST() {
  registrarCliquePlano();
  return Response.json({ ok: true });
}
