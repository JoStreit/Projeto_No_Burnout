"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "lgpd-consent";

export default function CookieBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) setVisivel(true);
    } catch {
      // localStorage não disponível
    }
  }, []);

  function aceitar() {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ aceito: true, timestamp: new Date().toISOString() })
      );
    } catch {
      // silencioso
    }
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg"
      style={{ backgroundColor: "#3c2010", borderColor: "#7a3d18" }}
      role="dialog"
      aria-label="Aviso de cookies e privacidade"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm flex-1 leading-relaxed" style={{ color: "#ede0d4" }}>
          Utilizamos cookies essenciais e armazenamento local para funcionamento da plataforma e
          registro do aceite desta política. Ao continuar, você concorda com nossa{" "}
          <Link
            href="/politica-privacidade"
            className="underline font-medium"
            style={{ color: "#c9b49a" }}
          >
            Política de Privacidade
          </Link>{" "}
          e os{" "}
          <Link
            href="/termos-servico"
            className="underline font-medium"
            style={{ color: "#c9b49a" }}
          >
            Termos de Uso
          </Link>
          , em conformidade com a LGPD (Lei 13.709/2018).
        </p>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/politica-privacidade"
            className="px-4 py-2 rounded text-xs font-medium border transition-colors"
            style={{ borderColor: "#7a6352", color: "#ede0d4" }}
          >
            Saiba mais
          </Link>
          <button
            onClick={aceitar}
            className="px-4 py-2 rounded text-xs font-semibold transition-colors"
            style={{ backgroundColor: "#4a6741", color: "#fff" }}
          >
            Aceitar e continuar
          </button>
        </div>
      </div>
    </div>
  );
}
