import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), "logs", "security.log");

function garantirDiretorio() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export type EventoSeguranca =
  | "login_falhou"
  | "acesso_negado"
  | "rate_limit"
  | "csrf_bloqueado";

export function logSeguranca(
  evento: EventoSeguranca,
  detalhes: { ip?: string; rota?: string; info?: string }
) {
  try {
    garantirDiretorio();
    const linha =
      JSON.stringify({
        ts: new Date().toISOString(),
        evento,
        ...detalhes,
      }) + "\n";
    fs.appendFileSync(LOG_PATH, linha, "utf-8");
  } catch {
    // Falha silenciosa: log não deve derrubar a requisição
  }
}
