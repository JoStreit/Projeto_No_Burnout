import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), "logs", "security.log");

async function autenticarAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_admin")?.value;
  if (!token) return false;
  return verificarToken(token) === process.env.ADMIN_CPF;
}

export async function GET() {
  if (!(await autenticarAdmin())) {
    return Response.json({ erro: "Não autorizado" }, { status: 403 });
  }

  if (!fs.existsSync(LOG_PATH)) {
    return Response.json([]);
  }

  const conteudo = fs.readFileSync(LOG_PATH, "utf-8");
  const linhas = conteudo
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((linha) => {
      try {
        return JSON.parse(linha);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .reverse(); // mais recentes primeiro

  return Response.json(linhas);
}
