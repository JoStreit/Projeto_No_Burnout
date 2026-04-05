import { NextResponse } from "next/server";
import { listarMensagens } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listarMensagens(true));
}
