import { NextRequest, NextResponse } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(request: NextRequest) {
  if (!MUTATING_METHODS.has(request.method)) return NextResponse.next();

  const origin = request.headers.get("origin");

  // Permite requisições sem Origin (chamadas server-to-server, ferramentas de teste)
  if (!origin) return NextResponse.next();

  const host = request.headers.get("host");

  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
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
