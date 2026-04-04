import { registrarQuestionario } from "@/lib/db";

export async function POST() {
  registrarQuestionario();
  return Response.json({ ok: true });
}
