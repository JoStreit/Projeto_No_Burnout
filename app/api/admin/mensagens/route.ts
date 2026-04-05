import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { listarMensagens, criarMensagem } from "@/lib/db";

async function verificarAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return !!verificarToken(token);
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
  const { icone, titulo, texto, ativa } = body;

  if (!icone?.trim()) return NextResponse.json({ erro: "Ícone é obrigatório" }, { status: 400 });
  if (!titulo?.trim()) return NextResponse.json({ erro: "Título é obrigatório" }, { status: 400 });
  if (!texto?.trim()) return NextResponse.json({ erro: "Texto é obrigatório" }, { status: 400 });

  const nova = criarMensagem({ icone: icone.trim(), titulo: titulo.trim(), texto: texto.trim(), ativa: ativa !== false });
  return NextResponse.json(nova, { status: 201 });
}
