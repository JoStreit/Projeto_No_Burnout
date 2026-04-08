import { NextRequest } from "next/server";
import { registrarQuestionario } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = checkRateLimit(`questionario:${ip}`);
  if (!allowed) return Response.json({ ok: true }); // silencia sem bloquear UX

  registrarQuestionario();
  return Response.json({ ok: true });
}
