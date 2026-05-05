"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

type Ramo = "Psicólogo" | "Fisioterapeuta" | "Nutricionista" | "Personal Trainer";

interface Opcao {
  texto: string;
  pontos: Partial<Record<Ramo, number>>;
}

interface Pergunta {
  id: number;
  texto: string;
  opcoes: Opcao[];
}

// ─── Perguntas ────────────────────────────────────────────────────────────────

const PERGUNTAS: Pergunta[] = [
  {
    id: 1,
    texto: "Como você se sente emocionalmente nos últimos 30 dias?",
    opcoes: [
      { texto: "Bem e equilibrado", pontos: {} },
      { texto: "Cansado e irritado com mais frequência que o normal", pontos: { "Psicólogo": 1 } },
      { texto: "Ansioso, triste ou sem motivação com frequência", pontos: { "Psicólogo": 2.5 } },
      { texto: "Esgotado, com sensação de vazio ou desesperança", pontos: { "Psicólogo": 4 } },
    ],
  },
  {
    id: 2,
    texto: "Como você avalia a pressão que sente no trabalho ou na sua rotina?",
    opcoes: [
      { texto: "Gerenciável — me sinto no controle", pontos: {} },
      { texto: "Alta, mas ainda consigo lidar", pontos: { "Psicólogo": 1 } },
      { texto: "Muito alta — frequentemente me sinto sobrecarregado", pontos: { "Psicólogo": 2.5 } },
      { texto: "Insuportável — sinto que não aguento mais", pontos: { "Psicólogo": 4 } },
    ],
  },
  {
    id: 3,
    texto: "Após descanso ou fins de semana, o cansaço passa?",
    opcoes: [
      { texto: "Sim, me recupero bem com descanso", pontos: {} },
      { texto: "Às vezes ainda me sinto cansado após descansar", pontos: { "Psicólogo": 1 } },
      { texto: "Raramente — o cansaço persiste mesmo dormindo bem", pontos: { "Psicólogo": 2.5 } },
      { texto: "Não — não consigo me desligar nem nos momentos de folga", pontos: { "Psicólogo": 4 } },
    ],
  },
  {
    id: 4,
    texto: "Você tem evitado interações sociais ou atividades que antes gostava?",
    opcoes: [
      { texto: "Não — estou bem socialmente", pontos: {} },
      { texto: "Às vezes prefiro ficar sozinho", pontos: { "Psicólogo": 1 } },
      { texto: "Com frequência evito pessoas e compromissos sociais", pontos: { "Psicólogo": 2.5 } },
      { texto: "Me isolei bastante — perdi o interesse na maioria das coisas", pontos: { "Psicólogo": 4 } },
    ],
  },
  {
    id: 5,
    texto: "Você sente dores físicas com frequência?",
    opcoes: [
      { texto: "Não tenho dores", pontos: {} },
      { texto: "Dores leves e ocasionais", pontos: { "Fisioterapeuta": 1 } },
      { texto: "Dores musculares ou articulares constantes (costas, pescoço, ombros)", pontos: { "Fisioterapeuta": 2.5 } },
      { texto: "Dores severas que limitam meu movimento ou minha produtividade", pontos: { "Fisioterapeuta": 4 } },
    ],
  },
  {
    id: 6,
    texto: "Você passa muitas horas sentado e sente dores posturais com frequência?",
    opcoes: [
      { texto: "Não — não tenho esse problema", pontos: {} },
      { texto: "Às vezes — dores leves nas costas ou pescoço", pontos: { "Fisioterapeuta": 1 } },
      { texto: "Sim — dores frequentes que prejudicam minha concentração", pontos: { "Fisioterapeuta": 2.5 } },
      { texto: "Sim — as dores são intensas e limitam minha rotina", pontos: { "Fisioterapeuta": 4 } },
    ],
  },
  {
    id: 7,
    texto: "Como está a qualidade do seu sono?",
    opcoes: [
      { texto: "Durmo bem e acordo descansado", pontos: {} },
      { texto: "Tenho algumas noites ruins ocasionalmente", pontos: { "Psicólogo": 0.5, "Fisioterapeuta": 0.5 } },
      { texto: "Durmo mal com frequência e acordo cansado", pontos: { "Psicólogo": 1.5, "Fisioterapeuta": 1.5 } },
      { texto: "Insônia severa ou acordo sempre exausto sem me sentir descansado", pontos: { "Psicólogo": 2.5, "Fisioterapeuta": 1.5 } },
    ],
  },
  {
    id: 8,
    texto: "Como você descreve seus hábitos alimentares?",
    opcoes: [
      { texto: "Equilibrados — como bem na maioria das refeições", pontos: {} },
      { texto: "Razoáveis, mas poderia melhorar", pontos: { "Nutricionista": 1 } },
      { texto: "Irregulares — pulo refeições ou como muito sob estresse", pontos: { "Nutricionista": 2.5 } },
      { texto: "Ruins — excesso de ultraprocessados, açúcar ou perda de apetite", pontos: { "Nutricionista": 4 } },
    ],
  },
  {
    id: 9,
    texto: "Você tem dificuldades com peso corporal ou problemas digestivos?",
    opcoes: [
      { texto: "Não tenho dificuldades", pontos: {} },
      { texto: "Tenho dificuldade para controlar o peso", pontos: { "Nutricionista": 2 } },
      { texto: "Tenho problemas digestivos frequentes (gases, azia, intestino irregular)", pontos: { "Nutricionista": 2.5 } },
      { texto: "Ambos — dificuldade com peso e problemas digestivos", pontos: { "Nutricionista": 4 } },
    ],
  },
  {
    id: 10,
    texto: "Você costuma comer em excesso ou de forma descontrolada quando está ansioso, estressado ou triste?",
    opcoes: [
      { texto: "Não — meu apetite não muda com o humor", pontos: {} },
      { texto: "Às vezes busco conforto na comida quando estou mal", pontos: { "Nutricionista": 1, "Psicólogo": 0.5 } },
      { texto: "Com frequência — o estresse e a ansiedade me fazem comer sem controle", pontos: { "Nutricionista": 2.5, "Psicólogo": 1 } },
      { texto: "Sempre — a comida é minha principal válvula de escape emocional", pontos: { "Nutricionista": 4, "Psicólogo": 1.5 } },
    ],
  },
  {
    id: 11,
    texto: "Como a sua alimentação afeta seu humor e energia ao longo do dia?",
    opcoes: [
      { texto: "Não percebo relação entre o que como e como me sinto", pontos: {} },
      { texto: "Percebo um pouco — comer mal me deixa um pouco mais cansado", pontos: { "Nutricionista": 1 } },
      { texto: "Percebo claramente — comer mal me deixa irritado, cansado ou ansioso", pontos: { "Nutricionista": 2.5 } },
      { texto: "Muito — minha alimentação afeta diretamente meu humor e disposição o dia todo", pontos: { "Nutricionista": 4 } },
    ],
  },
  {
    id: 12,
    texto: "Com que frequência você pratica atividade física?",
    opcoes: [
      { texto: "3 vezes por semana ou mais", pontos: {} },
      { texto: "1 a 2 vezes por semana", pontos: { "Personal Trainer": 2 } },
      { texto: "Raramente", pontos: { "Personal Trainer": 3 } },
      { texto: "Nunca — minha rotina é completamente sedentária", pontos: { "Personal Trainer": 4 } },
    ],
  },
  {
    id: 13,
    texto: "Você sente que a falta de condicionamento físico prejudica seu bem-estar?",
    opcoes: [
      { texto: "Não — estou satisfeito com meu condicionamento", pontos: {} },
      { texto: "Um pouco — poderia me exercitar mais", pontos: { "Personal Trainer": 1.5 } },
      { texto: "Sim — a falta de exercício afeta meu humor e minha energia", pontos: { "Personal Trainer": 3 } },
      { texto: "Muito — me sinto sem disposição e isso impacta minha qualidade de vida", pontos: { "Personal Trainer": 4 } },
    ],
  },
  {
    id: 14,
    texto: "Você se sente frequentemente sem energia ou sem vontade de realizar atividades que antes gostava?",
    opcoes: [
      { texto: "Raramente ou nunca", pontos: {} },
      { texto: "Às vezes, mas consigo me motivar", pontos: { "Psicólogo": 0.5 } },
      { texto: "Com frequência — tenho dificuldade de me animar para as coisas", pontos: { "Psicólogo": 1.5, "Personal Trainer": 0.5 } },
      { texto: "Quase sempre — perdi a motivação para quase tudo", pontos: { "Psicólogo": 2.5, "Personal Trainer": 1 } },
    ],
  },
];

// ─── Lógica de pontuação ──────────────────────────────────────────────────────

// Soma máxima possível por profissional (para normalização)
const MAX_PONTOS: Record<Ramo, number> = {
  "Psicólogo":        22.5, // Q1(4)+Q2(4)+Q3(4)+Q4(4)+Q7(2.5)+Q10(1.5)+Q14(2.5)
  "Fisioterapeuta":   9.5,  // Q5(4)+Q6(4)+Q7(1.5)
  "Nutricionista":    16,   // Q8(4)+Q9(4)+Q10(4)+Q11(4)
  "Personal Trainer": 9,    // Q12(4)+Q13(4)+Q14(1)
};

const MOTIVOS: Record<Ramo, string> = {
  "Psicólogo":        "para apoiar sua saúde mental, reduzir o estresse e tratar sinais de esgotamento emocional",
  "Fisioterapeuta":   "para aliviar dores físicas, tensões musculares e melhorar sua postura e mobilidade",
  "Nutricionista":    "para equilibrar sua alimentação, cuidar da saúde intestinal e gerenciar seu peso",
  "Personal Trainer": "para retomar a atividade física de forma gradual e segura, melhorando sua disposição e energia",
};

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

interface Profissional {
  id: string;
  nome: string;
  ramo: string;
  cidade: string;
  email: string;
  telefone?: string;
}

const COR_RAMO: Record<string, string> = {
  "Fisioterapeuta":   "bg-[#EBF4E3] text-[#5C8A3C]",
  "Nutricionista":    "bg-[#EBF4E3] text-[#5C8A3C]",
  "Psicólogo":        "bg-[#F5EDD0] text-[#7A5C2E]",
  "Personal Trainer": "bg-[#F5EDD0] text-[#7A5C2E]",
};

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onLoginClick: () => void;
  onCadastrarClick: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AnaliseGratuitaModal({
  aberto,
  onFechar,
  onLoginClick,
  onCadastrarClick,
}: Props) {
  const { paciente } = useAuth();

  const [etapa, setEtapa]                             = useState(0);
  const [respostas, setRespostas]                     = useState<Record<number, Opcao>>({});
  const [ramosRecomendados, setRamosRecomendados]     = useState<Ramo[] | null>(null);
  const [profissionais, setProfissionais]             = useState<Profissional[]>([]);
  const [carregandoProfs, setCarregandoProfs]         = useState(false);

  const perguntaAtual = PERGUNTAS[etapa];
  const totalPerguntas = PERGUNTAS.length;
  const progresso = (etapa / totalPerguntas) * 100;

  const ramosPrimario = ramosRecomendados?.[0] ?? null;

  useEffect(() => {
    if (ramosPrimario && paciente) {
      setCarregandoProfs(true);
      fetch(`/api/profissionais?ramo=${encodeURIComponent(ramosPrimario)}&limit=5`)
        .then((r) => r.json())
        .then((data) => setProfissionais(Array.isArray(data) ? data : (data.data ?? [])))
        .catch(() => setProfissionais([]))
        .finally(() => setCarregandoProfs(false));
    }
  }, [ramosPrimario, paciente]);

  function responder(opcao: Opcao) {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: opcao };
    setRespostas(novasRespostas);

    if (etapa + 1 < totalPerguntas) {
      setEtapa(etapa + 1);
    } else {
      gerarResultado(novasRespostas);
    }
  }

  function gerarResultado(resp: Record<number, Opcao>) {
    // Acumular pontos brutos
    const brutos: Record<Ramo, number> = {
      "Psicólogo": 0, "Fisioterapeuta": 0, "Nutricionista": 0, "Personal Trainer": 0,
    };

    for (const opcao of Object.values(resp)) {
      for (const [ramo, pts] of Object.entries(opcao.pontos) as [Ramo, number][]) {
        brutos[ramo] += pts;
      }
    }

    // Normalizar cada profissional para escala 0-10
    // Psicólogo recebe boost de 30% para prioridade em casos graves
    const norm: Record<Ramo, number> = {
      "Psicólogo":        (brutos["Psicólogo"]        / MAX_PONTOS["Psicólogo"])        * 10 * 1.3,
      "Fisioterapeuta":   (brutos["Fisioterapeuta"]   / MAX_PONTOS["Fisioterapeuta"])   * 10,
      "Nutricionista":    (brutos["Nutricionista"]    / MAX_PONTOS["Nutricionista"])    * 10,
      "Personal Trainer": (brutos["Personal Trainer"] / MAX_PONTOS["Personal Trainer"]) * 10,
    };

    const ordenados = (Object.keys(norm) as Ramo[]).sort((a, b) => norm[b] - norm[a]);
    const maxNorm   = norm[ordenados[0]];

    // Se todos os scores são muito baixos → recomendação preventiva
    if (maxNorm < 0.5) {
      setRamosRecomendados(["Personal Trainer"]);
      fetch("/api/questionarios", { method: "POST" }).catch(() => {});
      return;
    }

    // Incluir profissionais com score >= 50% do maior score (máx 3)
    const recomendados = ordenados
      .filter((r) => norm[r] >= maxNorm * 0.5)
      .slice(0, 3);

    setRamosRecomendados(recomendados);
    fetch("/api/questionarios", { method: "POST" }).catch(() => {});
  }

  function reiniciar() {
    setEtapa(0);
    setRespostas({});
    setRamosRecomendados(null);
    setProfissionais([]);
  }

  function fechar() {
    reiniciar();
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col bg-[#FFFDF0] border border-[#5C8A3C]/20">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-[#3B2A14] text-center">
            Análise Gratuita
          </DialogTitle>
          <p className="text-xs text-stone-400 flex items-center justify-center gap-1 pt-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Questionário 100% anônimo — nenhum dado pessoal é coletado
          </p>
        </DialogHeader>

        {!ramosRecomendados ? (
          <div className="space-y-6">
            {/* Barra de progresso */}
            <div>
              <div className="flex justify-between text-sm text-stone-400 mb-1">
                <span>Pergunta {etapa + 1} de {totalPerguntas}</span>
                <span>{Math.round(progresso)}%</span>
              </div>
              <div className="w-full bg-[#F5EDD0] rounded-full h-2">
                <div
                  className="bg-[#5C8A3C] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <p className="text-base font-semibold text-[#3B2A14]">
              {perguntaAtual.texto}
            </p>

            <div className="space-y-2">
              {perguntaAtual.opcoes.map((opcao) => (
                <button
                  key={opcao.texto}
                  onClick={() => responder(opcao)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-[#5C8A3C]/20 bg-white hover:border-[#5C8A3C] hover:bg-[#EBF4E3] transition-all duration-200 text-sm text-[#3B2A14] font-medium"
                >
                  {opcao.texto}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 overflow-hidden">
            {/* Resultado */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-[#EBF4E3] border border-[#5C8A3C]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">
                Profissional recomendado
              </p>
              <p className="text-2xl font-bold text-[#5C8A3C]">{ramosPrimario}</p>
              <p className="text-stone-500 mt-1 text-sm leading-relaxed">
                {MOTIVOS[ramosPrimario!]}.
              </p>

              {/* Também recomendados */}
              {ramosRecomendados.length > 1 && (
                <div className="mt-4">
                  <p className="text-xs text-stone-400 mb-2">
                    Também recomendado{ramosRecomendados.length > 2 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {ramosRecomendados.slice(1).map((ramo) => (
                      <span
                        key={ramo}
                        className="text-xs font-semibold text-[#5C8A3C] bg-[#5C8A3C]/10 border border-[#5C8A3C]/20 px-3 py-1 rounded-full"
                      >
                        {ramo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-stone-400 mt-3">
                Recomendação inicial. Consulte sempre um profissional de saúde.
              </p>
            </div>

            {/* Profissionais disponíveis (logado) ou CTA (não logado) */}
            {paciente ? (
              <div className="flex flex-col gap-3 overflow-hidden">
                <p className="text-sm font-semibold text-[#3B2A14]">
                  Profissionais disponíveis
                </p>
                <div className="overflow-y-auto max-h-52 space-y-2 pr-1">
                  {carregandoProfs ? (
                    <p className="text-sm text-stone-400 text-center py-4">Buscando...</p>
                  ) : profissionais.length === 0 ? (
                    <p className="text-sm text-stone-400 text-center py-4">
                      Nenhum profissional cadastrado neste ramo ainda.
                    </p>
                  ) : (
                    profissionais.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-lg px-3 py-2.5 border border-[#5C8A3C]/15 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-[#3B2A14]">{p.nome}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${COR_RAMO[p.ramo] ?? "bg-stone-100 text-stone-600"}`}>
                            {p.ramo}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">📍 {p.cidade}</p>
                        <a
                          href={`mailto:${p.email}`}
                          className="text-xs text-stone-500 hover:text-[#5C8A3C] hover:underline flex items-center gap-1"
                        >
                          <span>✉️</span>{p.email}
                        </a>
                        {p.telefone && (
                          <a
                            href={`https://wa.me/55${p.telefone.replace(/\D/g, "")}?text=${encodeURIComponent("Olá, cheguei até você através do Calma mente. Gostaria de marcar uma avaliação/consulta.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-stone-500 hover:text-[#5C8A3C] hover:underline flex items-center gap-1"
                          >
                            <span>📱</span>{p.telefone}
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {profissionais.length > 0 && (
                  <p className="text-xs text-stone-400 text-center pt-1">
                    Para ver mais profissionais, use o botão{" "}
                    <strong className="text-[#5C8A3C]">Buscar Profissionais</strong> no menu principal.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-[#EBF4E3] border border-[#5C8A3C]/25 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-[#3B2A14] mb-1">
                  Veja os profissionais disponíveis
                </p>
                <p className="text-xs text-stone-500 mb-3">
                  Faça login ou cadastre-se gratuitamente para ver a lista completa de profissionais do seu perfil.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#5C8A3C]/40 text-[#5C8A3C] hover:bg-[#5C8A3C]/10"
                    onClick={() => { fechar(); onLoginClick(); }}
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white"
                    onClick={() => { fechar(); onCadastrarClick(); }}
                  >
                    Cadastrar-se
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reiniciar}
                className="flex-1 border-[#5C8A3C]/30 text-[#5C8A3C] hover:bg-[#EBF4E3]"
              >
                Refazer análise
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#5C8A3C] hover:bg-[#3A6624] text-white"
                onClick={fechar}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
