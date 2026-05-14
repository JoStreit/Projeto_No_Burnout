"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PagamentoPage() {
  const searchParams = useSearchParams();
  const plano = searchParams.get("plano") ?? "Plano";

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-black text-[#3B2A14] mb-2">Pagamento</h1>
        <p className="text-stone-500 text-sm mb-6">Plano selecionado: <span className="font-semibold text-[#5C8A3C]">{plano}</span></p>

        <div className="bg-stone-100 rounded-2xl h-48 flex items-center justify-center mb-8">
          <p className="text-stone-400 text-sm">Integração de pagamento em breve.</p>
        </div>

        <Link href="/profissional">
          <Button variant="outline" className="border-stone-300 text-stone-600 hover:bg-stone-50 rounded-xl w-full">
            Voltar
          </Button>
        </Link>
      </div>
    </main>
  );
}
