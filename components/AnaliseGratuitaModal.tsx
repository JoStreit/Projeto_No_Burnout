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

const PERGUNTAS = [
  {
    id: 1,
    texto: "Qual é a sua faixa etária?",
    opcoes: ["18 a 25 anos", "26 a 35 anos", "36 a 45 anos", "46 a 55 anos", "Acima de 55 anos"],
  },
  {
    id: 2,
    texto: "Como você avalia sua saúde geral atualmente?",
    opcoes: ["Ótima", "Boa", "Regular", "Ruim"],
  },
  {
    id: 3,
    texto: "Com que frequência você pratica atividade física?",
    opcoes: [
      "Todos os dias",
      "3 a 4 vezes por semana",
      "1 a 2 vezes por semana",
      "Raramente",
      "Nunca",
    ],
  },
  {
    id: 4,
    texto: "Possui alguma condição de saúde diagnosticada?",
    opcoes: [
      "Não possuo",
      "Problema articular ou muscular",
      "Distúrbio alimentar",
      "Questão emocional ou psicológica",
      "Outra condição",
    ],
  },
  {
    id: 5,
    texto: "Qual é o seu principal objetivo?",
    opcoes: [
      "Perda de peso",
      "Ganho de massa muscular",
      "Reabilitação física",
      "Saúde mental e bem-estar",
      "Reeducação alimentar",
    ],
  },
];

interface Profissional {
  id: string;
  nome: string;
  ramo: string;
  cidade: string;
}

const COR_RAMO: Record<string, string> = {
  Fisioterapeuta: "bg-blue-100 text-blue-700",
  Nutricionista: "bg-green-100 text-green-700",
  "Psicólogo": "bg-purple-100 text-purple-700",
  "Personal Trainer": "bg-orange-100 text-orange-700",
};

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onLoginClick: () => void;
  onCadastrarClick: () => void;
}

export default function AnaliseGratuitaModal({
  aberto,
  onFechar,
  onLoginClick,
  onCadastrarClick,
}: Props) {
  const { paciente } = useAuth();
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [ramoRecomendado, setRamoRecomendado] = useState<string | null>(null);
  const [motivoRecomendado, setMotivoRecomendado] = useState("");
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregandoProfs, setCarregandoProfs] = useState(false);

  const perguntaAtual = PERGUNTAS[etapa];
  const totalPerguntas = PERGUNTAS.length;
  const progresso = (etapa / totalPerguntas) * 100;

  useEffect(() => {
    if (ramoRecomendado && paciente) {
      setCarregandoProfs(true);
      fetch(`/api/profissionais?ramo=${encodeURIComponent(ramoRecomendado)}`)
        .then((r) => r.json())
        .then((data) => setProfissionais(data))
        .catch(() => setProfissionais([]))
        .finally(() => setCarregandoProfs(false));
    }
  }, [ramoRecomendado, paciente]);

  function responder(opcao: string) {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: opcao };
    setRespostas(novasRespostas);

    if (etapa + 1 < totalPerguntas) {
      setEtapa(etapa + 1);
    } else {
      gerarResultado(novasRespostas);
    }
  }

  function gerarResultado(resp: Record<number, string>) {
    const objetivo = resp[5] ?? "";
    const condicao = resp[4] ?? "";

    let ramo = "Personal Trainer";
    let motivo = "para ajudar a alcançar seus objetivos de forma saudável";

    if (objetivo.includes("Reabilitação") || condicao.includes("articular") || condicao.includes("muscular")) {
      ramo = "Fisioterapeuta";
      motivo = "especializado em reabilitação e saúde física";
    } else if (objetivo.includes("alimentar") || condicao.includes("alimentar")) {
      ramo = "Nutricionista";
      motivo = "para cuidar da sua alimentação e nutrição";
    } else if (objetivo.includes("mental") || condicao.includes("psicológica")) {
      ramo = "Psicólogo";
      motivo = "para apoiar sua saúde mental e bem-estar";
    }

    setRamoRecomendado(ramo);
    setMotivoRecomendado(motivo);
  }

  function reiniciar() {
    setEtapa(0);
    setRespostas({});
    setRamoRecomendado(null);
    setMotivoRecomendado("");
    setProfissionais([]);
  }

  function fechar() {
    reiniciar();
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-700">
            Análise Gratuita
          </DialogTitle>
        </DialogHeader>

        {!ramoRecomendado ? (
          <div className="space-y-6">
            {/* Barra de progresso */}
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Pergunta {etapa + 1} de {totalPerguntas}</span>
                <span>{Math.round(progresso)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <p className="text-base font-medium text-gray-800">
              {perguntaAtual.texto}
            </p>

            <div className="space-y-2">
              {perguntaAtual.opcoes.map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => responder(opcao)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 text-sm text-gray-700 font-medium"
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 overflow-hidden">
            {/* Resultado */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">Profissional recomendado</p>
              <p className="text-2xl font-bold text-emerald-700">{ramoRecomendado}</p>
              <p className="text-gray-600 mt-1 text-sm">{motivoRecomendado}.</p>
              <p className="text-xs text-gray-400 mt-2">
                Recomendação inicial. Consulte sempre um profissional de saúde.
              </p>
            </div>

            {/* Profissionais disponíveis (logado) ou CTA (não logado) */}
            {paciente ? (
              <div className="flex flex-col gap-3 overflow-hidden">
                <p className="text-sm font-semibold text-gray-700">
                  Profissionais disponíveis
                </p>
                <div className="overflow-y-auto max-h-52 space-y-2 pr-1">
                  {carregandoProfs ? (
                    <p className="text-sm text-gray-400 text-center py-4">Buscando...</p>
                  ) : profissionais.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Nenhum profissional cadastrado neste ramo ainda.
                    </p>
                  ) : (
                    profissionais.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{p.nome}</p>
                          <p className="text-xs text-gray-500">📍 {p.cidade}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${COR_RAMO[p.ramo] ?? "bg-gray-100 text-gray-600"}`}>
                          {p.ramo}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-emerald-800 mb-1">
                  Veja os profissionais disponíveis
                </p>
                <p className="text-xs text-emerald-700 mb-3">
                  Faça login ou cadastre-se gratuitamente para ver a lista completa de profissionais do seu perfil.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-400 text-emerald-700 hover:bg-emerald-100"
                    onClick={() => { fechar(); onLoginClick(); }}
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => { fechar(); onCadastrarClick(); }}
                  >
                    Cadastrar-se
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reiniciar} className="flex-1">
                Refazer análise
              </Button>
              <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={fechar}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
