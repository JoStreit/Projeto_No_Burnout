import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { buscarProfissionalPorId } from "@/lib/db";

function mascaraCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.***.***-${d.slice(9)}`;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_prof")?.value;
  if (!token) return Response.json(null);

  const id = verificarToken(token);
  if (!id) return Response.json(null);

  const profissional = buscarProfissionalPorId(id);
  if (!profissional) return Response.json(null);
  return Response.json({ ...profissional, cpf: mascaraCPF(profissional.cpf) });
}
