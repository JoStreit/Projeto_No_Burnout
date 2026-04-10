import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const uf = req.nextUrl.searchParams.get("uf");
  if (!uf) return NextResponse.json([], { status: 400 });

  const res = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return NextResponse.json([]);

  const data: { nome: string }[] = await res.json();
  return NextResponse.json(data.map((m) => m.nome));
}
