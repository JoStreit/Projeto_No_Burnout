"use client";

import { useState, useEffect } from "react";

const MENSAGENS = [
  {
    icone: "💧",
    titulo: "Hidratação",
    texto: "Você já se hidratou hoje? Tente tomar pelo menos 2 litros de água ao longo do dia. Um copo agora já é um bom começo.",
  },
  {
    icone: "🚶",
    titulo: "Movimento",
    texto: "Que tal uma caminhada de 30 minutos hoje? Além de fazer bem ao corpo, clareia a mente e melhora o humor.",
  },
  {
    icone: "☀️",
    titulo: "Vitamina D",
    texto: "Aproveite para pegar pelo menos 15 minutos de sol hoje. A vitamina D faz bem ao humor, à imunidade e aos ossos.",
  },
  {
    icone: "👥",
    titulo: "Conexão",
    texto: "Que tal um café ou uma conversa com um amigo hoje? Deixe o celular fora da sua visão por 30 minutos e aproveite o momento.",
  },
  {
    icone: "🌬️",
    titulo: "Respiração",
    texto: "Respire fundo 5 vezes antes de começar suas tarefas. Inspire pelo nariz, segure 4 segundos, expire pela boca. Isso reduz o estresse.",
  },
  {
    icone: "🌙",
    titulo: "Sono",
    texto: "Hoje é um bom dia para dormir cedo. Uma boa noite de sono transforma o dia seguinte — tente manter um horário fixo.",
  },
  {
    icone: "🍎",
    titulo: "Alimentação",
    texto: "Que tal substituir um snack industrializado por uma fruta hoje? Pequenas trocas no dia a dia somam grandes resultados.",
  },
  {
    icone: "🪑",
    titulo: "Postura",
    texto: "Levante da cadeira a cada hora e caminhe por 5 minutos. Seu corpo e sua mente agradecem pela pausa.",
  },
  {
    icone: "📵",
    titulo: "Descanso digital",
    texto: "Tente desligar as telas 30 minutos antes de dormir esta noite. A qualidade do sono melhora bastante com esse hábito.",
  },
  {
    icone: "🙏",
    titulo: "Gratidão",
    texto: "Escreva três coisas pelas quais você é grato hoje. É rápido, simples e muda a perspectiva do dia.",
  },
  {
    icone: "🧘",
    titulo: "Alongamento",
    texto: "Se você sentiu tensão no pescoço ou ombros hoje, faça uma pausa e se alongue por 5 minutos. Faz mais diferença do que parece.",
  },
  {
    icone: "🥗",
    titulo: "Nutrição",
    texto: "Uma pequena caminhada após o almoço melhora a digestão e ajuda a equilibrar o nível de açúcar no sangue.",
  },
  {
    icone: "🎵",
    titulo: "Bem-estar",
    texto: "Coloque uma música que te deixa bem-disposto e comece o dia com energia positiva. O som tem poder sobre o humor.",
  },
  {
    icone: "📞",
    titulo: "Afeto",
    texto: "Que tal ligar para alguém de quem você sente falta? Uma boa conversa faz bem à saúde mental tanto sua quanto da outra pessoa.",
  },
  {
    icone: "🪜",
    titulo: "Atividade",
    texto: "Experimente trocar o elevador pela escada hoje. São pequenas escolhas cotidianas que, somadas, fazem grande diferença.",
  },
  {
    icone: "🌿",
    titulo: "Silêncio",
    texto: "Reserve 10 minutos hoje para ficar em silêncio, sem tela, sem barulho. O descanso mental é tão importante quanto o físico.",
  },
  {
    icone: "🍵",
    titulo: "Hidratação",
    texto: "Prefira água, chá ou água com limão ao invés de refrigerante hoje. Pequenas trocas criam grandes hábitos ao longo do tempo.",
  },
  {
    icone: "😄",
    titulo: "Humor",
    texto: "Sabia que sorrir, mesmo que brevemente, reduz o cortisol (hormônio do estresse)? Tente hoje — funciona mesmo!",
  },
  {
    icone: "🛏️",
    titulo: "Ambiente",
    texto: "Antes de dormir, deixe o quarto arejado. O sono é mais profundo e reparador em ambientes frescos e escuros.",
  },
  {
    icone: "🩺",
    titulo: "Prevenção",
    texto: "Você está em dia com suas consultas preventivas? Check-ups regulares são a melhor forma de cuidar da saúde a longo prazo.",
  },
  {
    icone: "🧠",
    titulo: "Foco",
    texto: "Tente fazer uma coisa de cada vez hoje. O multitasking cansa mais do que parece — o foco único melhora a produtividade e o bem-estar.",
  },
  {
    icone: "🌊",
    titulo: "Pausa",
    texto: "Faça uma pausa no trabalho e observe algo bonito ao seu redor por 2 minutos. A mente precisa de micro-intervalos para funcionar bem.",
  },
];

const STORAGE_KEY = "saude_mensagem_diaria_v2";
const JANELA_DIAS = 10;

interface EntradaHistorico {
  data: string;
  indices: number[];
}

interface DadosArmazenados {
  hoje: string;
  indicesHoje: number[];
  reveladas: number[]; // posições (0 ou 1) já reveladas hoje
  historico: EntradaHistorico[];
}

interface DadosDia {
  indices: number[];
  reveladas: number[];
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function sortearDoisEvitando(excluir: Set<number>): number[] {
  const disponiveis = Array.from({ length: MENSAGENS.length }, (_, i) => i).filter(
    (i) => !excluir.has(i)
  );
  const pool = disponiveis.length >= 2 ? disponiveis : Array.from({ length: MENSAGENS.length }, (_, i) => i);
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function carregarOuSortear(): DadosDia {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DadosArmazenados = JSON.parse(raw);
      if (parsed.hoje === hoje()) {
        return { indices: parsed.indicesHoje, reveladas: parsed.reveladas ?? [] };
      }
      const dataCorte = new Date();
      dataCorte.setDate(dataCorte.getDate() - JANELA_DIAS);
      const corteStr = dataCorte.toISOString().slice(0, 10);

      const historicoAtualizado: EntradaHistorico[] = [
        { data: parsed.hoje, indices: parsed.indicesHoje },
        ...parsed.historico,
      ].filter((e) => e.data >= corteStr);

      const excluir = new Set<number>(historicoAtualizado.flatMap((e) => e.indices));
      const novosIndices = sortearDoisEvitando(excluir);

      const novosDados: DadosArmazenados = {
        hoje: hoje(),
        indicesHoje: novosIndices,
        reveladas: [],
        historico: historicoAtualizado,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados));
      return { indices: novosIndices, reveladas: [] };
    }
  } catch {
    // ignore
  }

  const indices = sortearDoisEvitando(new Set());
  const inicial: DadosArmazenados = {
    hoje: hoje(),
    indicesHoje: indices,
    reveladas: [],
    historico: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
  return { indices, reveladas: [] };
}

function salvarRevelada(posicao: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DadosArmazenados = JSON.parse(raw);
      if (!parsed.reveladas.includes(posicao)) {
        parsed.reveladas.push(posicao);
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
  mensagem: (typeof MENSAGENS)[number];
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
  const [dados, setDados] = useState<DadosDia | null>(null);

  useEffect(() => {
    setDados(carregarOuSortear());
  }, []);

  function revelar(posicao: number) {
    salvarRevelada(posicao);
    setDados((prev) =>
      prev && !prev.reveladas.includes(posicao)
        ? { ...prev, reveladas: [...prev.reveladas, posicao] }
        : prev
    );
  }

  if (!dados) return null;

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
          {dados.indices.map((msgIdx, posicao) => (
            <CardFlip
              key={msgIdx}
              mensagem={MENSAGENS[msgIdx]}
              revelada={dados.reveladas.includes(posicao)}
              onRevelar={() => revelar(posicao)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
