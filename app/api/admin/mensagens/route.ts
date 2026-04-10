import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { listarMensagens, criarMensagem } from "@/lib/db";

function sanitizarTexto(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")        // Remove tags HTML
    .replace(/javascript:/gi, "")   // Remove URIs javascript:
    .replace(/on\w+\s*=/gi, "")     // Remove event handlers inline
    .trim()
    .slice(0, 500);                  // Limita tamanho
}

async function verificarAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return verificarToken(token) === process.env.ADMIN_CPF;
}

export async function GET() {
  if (!(await verificarAdmin()))
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  return NextResponse.json(listarMensagens());
}

export async function POST(req: Request) {
  if (!(await verificarAdmin()))
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const icone = sanitizarTexto(body.icone ?? "");
  const titulo = sanitizarTexto(body.titulo ?? "");
  const texto = sanitizarTexto(body.texto ?? "");
  const ativa = body.ativa;

  if (!icone) return NextResponse.json({ erro: "Ícone é obrigatório" }, { status: 400 });
  if (!titulo) return NextResponse.json({ erro: "Título é obrigatório" }, { status: 400 });
  if (!texto) return NextResponse.json({ erro: "Texto é obrigatório" }, { status: 400 });

  const nova = criarMensagem({ icone, titulo, texto, ativa: ativa !== false });
  return NextResponse.json(nova, { status: 201 });
}
