import { NextRequest, NextResponse } from "next/server";
import { logSeguranca } from "@/lib/security-log";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(request: NextRequest) {
  if (!MUTATING_METHODS.has(request.method)) return NextResponse.next();

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // Sem Origin: apenas server-to-server ou ferramentas — logar mas permitir
  if (!origin) {
    logSeguranca("sem_origin", { host: host ?? "desconhecido", rota: request.nextUrl.pathname });
    return NextResponse.next();
  }

  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      logSeguranca("csrf_bloqueado", { origin, host: host ?? "desconhecido", rota: request.nextUrl.pathname });
      return NextResponse.json({ erro: "Origem não permitida" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ erro: "Origin inválido" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
