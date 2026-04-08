import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import { atualizarMensagem, excluirMensagem } from "@/lib/db";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

async function verificarAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return verificarToken(token) === process.env.ADMIN_CPF;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verificarAdmin()))
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { icone, titulo, texto, ativa } = body;

  try {
    const atualizada = atualizarMensagem(id, {
      ...(icone !== undefined ? { icone: stripHtml(icone) } : {}),
      ...(titulo !== undefined ? { titulo: stripHtml(titulo) } : {}),
      ...(texto !== undefined ? { texto: stripHtml(texto) } : {}),
      ...(ativa !== undefined ? { ativa: !!ativa } : {}),
    });
    return NextResponse.json(atualizada);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ erro: msg }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verificarAdmin()))
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    excluirMensagem(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ erro: msg }, { status: 404 });
  }
}
