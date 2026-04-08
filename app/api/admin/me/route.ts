import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";

export async function GET() {
  const adminCpf = process.env.ADMIN_CPF;
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return Response.json(null);
  const id = verificarToken(token);
  if (!adminCpf || id !== adminCpf) return Response.json(null);
  return Response.json({ cpf: adminCpf });
}
