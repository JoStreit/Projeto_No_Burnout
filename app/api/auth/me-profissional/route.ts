import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { buscarProfissionalPorId } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_prof")?.value;
  if (!token) return Response.json(null);

  const id = verificarToken(token);
  if (!id) return Response.json(null);

  const profissional = buscarProfissionalPorId(id);
  return Response.json(profissional);
}
