import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { listarMensagens, criarMensagem } from "@/lib/db";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
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
  const icone = stripHtml(body.icone ?? "");
  const titulo = stripHtml(body.titulo ?? "");
  const texto = stripHtml(body.texto ?? "");
  const ativa = body.ativa;

  if (!icone) return NextResponse.json({ erro: "Ícone é obrigatório" }, { status: 400 });
  if (!titulo) return NextResponse.json({ erro: "Título é obrigatório" }, { status: 400 });
  if (!texto) return NextResponse.json({ erro: "Texto é obrigatório" }, { status: 400 });

  const nova = criarMensagem({ icone, titulo, texto, ativa: ativa !== false });
  return NextResponse.json(nova, { status: 201 });
}
