import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";

const ADMIN_CPF = "01581020023";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return Response.json(null);
  const id = verificarToken(token);
  if (id !== ADMIN_CPF) return Response.json(null);
  return Response.json({ cpf: ADMIN_CPF });
}
