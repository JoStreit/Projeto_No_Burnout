"use client";

import { useState, useEffect } from "react";

export interface MensagemDica {
  id: string;
  icone: string;
  titulo: string;
  texto: string;
  ativa: boolean;
}

// ─── localStorage com IDs ─────────────────────────────────────────────────────

const STORAGE_KEY = "saude_mensagem_diaria_v3";
const JANELA_DIAS = 10;

interface EntradaHistorico {
  data: string;
  ids: string[];
}

interface DadosArmazenados {
  hoje: string;
  idsHoje: string[];
  reveladas: string[]; // IDs revelados hoje
  historico: EntradaHistorico[];
}

function dataHoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function sortearDois(pool: MensagemDica[], excluir: Set<string>): string[] {
  const disponiveis = pool.filter((m) => !excluir.has(m.id));
  const fonte = disponiveis.length >= 2 ? disponiveis : pool;
  const shuffled = fonte.slice().sort(() => Math.random() - 0.5);
  return [shuffled[0].id, shuffled[1]?.id ?? shuffled[0].id];
}

function carregarOuSortear(pool: MensagemDica[]): DadosArmazenados {
  const hoje = dataHoje();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DadosArmazenados = JSON.parse(raw);

      if (parsed.hoje === hoje) return parsed;

      // Novo dia: move para histórico, limpa janela
      const dataCorte = new Date();
      dataCorte.setDate(dataCorte.getDate() - JANELA_DIAS);
      const corteStr = dataCorte.toISOString().slice(0, 10);

      const historico: EntradaHistorico[] = [
        { data: parsed.hoje, ids: parsed.idsHoje },
        ...parsed.historico,
      ].filter((e) => e.data >= corteStr);

      const excluir = new Set<string>(historico.flatMap((e) => e.ids));
      const idsHoje = sortearDois(pool, excluir);

      const novo: DadosArmazenados = { hoje, idsHoje, reveladas: [], historico };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
      return novo;
    }
  } catch {
    // ignore
  }

  const idsHoje = sortearDois(pool, new Set());
  const inicial: DadosArmazenados = { hoje, idsHoje, reveladas: [], historico: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
  return inicial;
}

function salvarRevelada(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DadosArmazenados = JSON.parse(raw);
      if (!parsed.reveladas.includes(id)) {
        parsed.reveladas.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    }
  } catch {
    // ignore
  }
}

// ─── Card com flip 3D ─────────────────────────────────────────────────────────

function CardFlip({
  mensagem,
  revelada,
  onRevelar,
}: {
  mensagem: MensagemDica;
  revelada: boolean;
  onRevelar: () => void;
}) {
  return (
    <div className="h-28" style={{ perspective: "1000px" }}>
      <div
        onClick={!revelada ? onRevelar : undefined}
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: revelada ? "rotateY(180deg)" : "rotateY(0deg)",
          cursor: revelada ? "default" : "pointer",
        }}
      >
        {/* ── Frente (oculta) ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-[#eaf2e7] border border-[#4a6741]/20 flex flex-col items-center justify-center gap-2 hover:border-[#4a6741]/50 hover:bg-[#dceeda] transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-3xl select-none">🌱</span>
          <p className="text-xs font-semibold text-[#4a6741] uppercase tracking-widest select-none">
            Dica para você
          </p>
          <p className="text-[11px] text-[#4a6741]/60 select-none">clique para revelar</p>
        </div>

        {/* ── Verso (mensagem) ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-white border border-[#4a6741]/15 flex items-start gap-4 px-5 py-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="w-11 h-11 rounded-xl bg-[#eaf2e7] flex items-center justify-center shrink-0 text-xl">
            {mensagem.icone}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#4a6741] uppercase tracking-wide mb-0.5">
              {mensagem.titulo}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
              {mensagem.texto}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function MensagemDiaria() {
  const [armazenado, setArmazenado] = useState<DadosArmazenados | null>(null);
  const [pool, setPool] = useState<MensagemDica[]>([]);

  useEffect(() => {
    fetch("/api/mensagens")
      .then((r) => r.json())
      .then((mensagens: MensagemDica[]) => {
        if (!mensagens || mensagens.length < 2) return;
        setPool(mensagens);
        setArmazenado(carregarOuSortear(mensagens));
      })
      .catch(() => {});
  }, []);

  function revelar(id: string) {
    salvarRevelada(id);
    setArmazenado((prev) =>
      prev && !prev.reveladas.includes(id)
        ? { ...prev, reveladas: [...prev.reveladas, id] }
        : prev
    );
  }

  if (!armazenado || pool.length < 2) return null;

  const mensagensHoje = armazenado.idsHoje
    .map((id) => pool.find((m) => m.id === id))
    .filter(Boolean) as MensagemDica[];

  if (mensagensHoje.length < 2) return null;

  return (
    <section className="bg-[#faf7f4] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#4a6741] text-lg">🌱</span>
          <h2 className="text-sm font-semibold text-[#4a6741] uppercase tracking-widest">
            Dica para você
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {mensagensHoje.map((m) => (
            <CardFlip
              key={m.id}
              mensagem={m}
              revelada={armazenado.reveladas.includes(m.id)}
              onRevelar={() => revelar(m.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
