import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { buscarPacientePorId } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return Response.json(null);

  const id = verificarToken(token);
  if (!id) return Response.json(null);

  const paciente = buscarPacientePorId(id);
  return Response.json(paciente);
}
