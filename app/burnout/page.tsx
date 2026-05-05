"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import AnaliseGratuitaModal from "@/components/AnaliseGratuitaModal";
import CadastroPacienteModal from "@/components/CadastroPacienteModal";
import CadastroProfissionalModal from "@/components/CadastroProfissionalModal";
import LoginModal from "@/components/LoginModal";
import LoginProfissionalModal from "@/components/LoginProfissionalModal";
import DashboardProfissionalModal from "@/components/DashboardProfissionalModal";
import EditarPerfilPacienteModal from "@/components/EditarPerfilPacienteModal";

// ─── Tópicos ──────────────────────────────────────────────────────────────────

const TOPICOS = [
  { id: "o-que-e",        label: "O que é" },
  { id: "sintomas",       label: "Principais sintomas" },
  { id: "tenho-burnout",  label: "Será que tenho?" },
  { id: "como-ajudar",    label: "Como me ajudar" },
  { id: "terapia",        label: "Terapia" },
  { id: "atividade-fisica", label: "Atividade Física" },
  { id: "fisioterapia",   label: "Fisioterapia" },
  { id: "alimentacao",    label: "Alimentação" },
] as const;

type TopicoId = (typeof TOPICOS)[number]["id"];

// ─── Conteúdo por tópico ──────────────────────────────────────────────────────

const SECOES: Record<TopicoId, React.ReactNode> = {
  "o-que-e": (
    <div className="space-y-5">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">O que é Burnout</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        A Síndrome de Burnout, também chamada de Síndrome do Esgotamento Profissional, é um distúrbio
        emocional caracterizado por exaustão extrema — física e mental — causada pelo estresse crônico
        no trabalho. É mais comum em pessoas que enfrentam longas jornadas, pressão excessiva por
        resultados ou ambientes organizacionais pouco saudáveis.
      </p>
    </div>
  ),

  "sintomas": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Principais sintomas</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        Os sintomas do burnout se manifestam de forma gradual e podem ser confundidos com cansaço comum.
        Fique atento aos seguintes sinais:
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          "Exaustão física e/ou mental excessiva",
          "Dificuldade de concentração",
          "Alterações no apetite (aumento ou redução)",
          "Negatividade persistente",
          "Incapacidade de se desligar do trabalho",
          "Isolamento social",
          "Sono insuficiente ou de má qualidade",
          "Mudanças frequentes de humor",
          "Sentimento de desesperança, derrota ou incompetência",
        ].map((sintoma) => (
          <li
            key={sintoma}
            className="flex items-start gap-3 bg-[#FFFDF0] rounded-xl p-4 border border-stone-100"
          >
            <span className="mt-0.5 w-5 h-5 rounded-full bg-[#5C8A3C]/15 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-stone-700 text-sm leading-relaxed">{sintoma}</span>
          </li>
        ))}
      </ul>
    </div>
  ),

  "tenho-burnout": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Será que tenho burnout?</h2>
      <div className="bg-[#F5EDD0] rounded-2xl p-6 border border-[#5C8A3C]/10">
        <p className="text-stone-700 text-base leading-relaxed">
          A diferença entre cansaço comum e burnout está na resposta ao descanso. O cansaço habitual
          melhora após uma boa noite de sono; o burnout, não — a exaustão persiste mesmo com descanso
          adequado e vem acompanhada de outros sintomas.
        </p>
      </div>
      <p className="text-stone-600 text-base leading-relaxed">
        Se você se identificou com esse quadro, procure um psicólogo ou psiquiatra para avaliação e
        orientação do tratamento adequado. O diagnóstico correto é o primeiro passo para a recuperação.
      </p>
    </div>
  ),

  "como-ajudar": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Como me ajudar</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        A recuperação do burnout é multifatorial: inclui psicoterapia, redução da carga de trabalho,
        práticas de relaxamento (mindfulness, ioga), exercícios físicos, alimentação equilibrada e
        regulação do sono. O caminho passa pelo autoconhecimento, redefinição de limites e recuperação
        gradual da saúde física e mental.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: "🧠", titulo: "Psicoterapia",          desc: "Terapia cognitivo-comportamental e outras abordagens terapêuticas" },
          { icon: "🏃", titulo: "Exercício físico",      desc: "Atividades regulares que liberam endorfinas e melhoram o humor" },
          { icon: "🥗", titulo: "Alimentação equilibrada", desc: "Nutrientes que regulam o humor e reduzem a inflamação" },
          { icon: "😴", titulo: "Regulação do sono",     desc: "Hábitos saudáveis para um descanso verdadeiramente reparador" },
          { icon: "🧘", titulo: "Mindfulness",           desc: "Meditação, ioga e técnicas de respiração consciente" },
          { icon: "⚖️", titulo: "Redução da carga",      desc: "Redefinição de limites e afastamento quando necessário" },
        ].map(({ icon, titulo, desc }) => (
          <div key={titulo} className="flex items-start gap-4 bg-[#FFFDF0] rounded-xl p-4 border border-stone-100">
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <h4 className="font-semibold text-[#3B2A14] text-sm mb-1">{titulo}</h4>
              <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  "terapia": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Terapia</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        A psicoterapia para burnout busca compreender as causas do esgotamento e construir estratégias
        para gerenciá-lo. O psicólogo ou psiquiatra acompanha o paciente com escuta ativa, identificando
        práticas terapêuticas que favorecem a recuperação — como a Terapia Cognitivo-Comportamental (TCC)
        — para que o indivíduo retome o equilíbrio e a qualidade de vida.
      </p>
      <div className="bg-[#EBF4E3] rounded-2xl p-6 border border-[#5C8A3C]/15">
        <h3 className="font-semibold text-[#3B2A14] text-base mb-4">O que esperar da terapia</h3>
        <ul className="space-y-3">
          {[
            "Identificação das causas do estresse e do esgotamento",
            "Desenvolvimento de estratégias para gerenciar pressões do trabalho",
            "Reestruturação de crenças e padrões de comportamento",
            "Recuperação gradual do equilíbrio emocional",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-stone-700 text-sm">
              <span className="text-[#5C8A3C] font-bold shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  "atividade-fisica": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Atividade Física</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        A prática regular de exercícios é uma aliada importante no tratamento do burnout. A atividade
        física libera endorfinas, reduz a ansiedade, melhora o humor e regula o sono — fatores
        diretamente afetados pela síndrome.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FFFDF0] rounded-2xl p-5 border border-stone-100">
          <h3 className="font-semibold text-[#5C8A3C] text-xs uppercase tracking-widest mb-4">Benefícios</h3>
          <ul className="space-y-3">
            {[
              "Redução do estresse e melhora do humor",
              "Regulação do sono",
              "Menor risco de desenvolver burnout",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-stone-600 text-sm">
                <span className="text-[#5C8A3C] font-bold shrink-0">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#FFFDF0] rounded-2xl p-5 border border-stone-100">
          <h3 className="font-semibold text-[#5C8A3C] text-xs uppercase tracking-widest mb-4">Recomendações</h3>
          <ul className="space-y-3">
            {[
              "Comece com atividades leves, como caminhadas",
              "Aumente a intensidade conforme o condicionamento melhora",
              "Busque orientação de um educador físico",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-stone-600 text-sm">
                <span className="text-[#5C8A3C] font-bold shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ),

  "fisioterapia": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Fisioterapia</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        O burnout não afeta apenas a mente: tensões musculares, dores crônicas, cefaleias e distúrbios
        do sono são manifestações físicas frequentes. A fisioterapia atua no alívio desses sintomas,
        complementando o tratamento.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            titulo: "Liberação miofascial",
            desc: "Reduz a tensão acumulada em pescoço, ombros e costas causada pelo estresse crônico.",
          },
          {
            titulo: "RPG — Reeducação Postural Global",
            desc: "Melhora a postura e alivia dores associadas ao esgotamento físico e mental.",
          },
          {
            titulo: "Fisioterapia respiratória",
            desc: "Exercícios de respiração consciente para reduzir a ansiedade e promover relaxamento.",
          },
          {
            titulo: "Melhora do sono",
            desc: "Ao aliviar dores físicas, favorece um descanso mais reparador e de melhor qualidade.",
          },
        ].map(({ titulo, desc }) => (
          <div key={titulo} className="bg-[#FFFDF0] rounded-xl p-5 border border-stone-100">
            <h4 className="font-semibold text-[#3B2A14] text-sm mb-2">{titulo}</h4>
            <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  "alimentacao": (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14]">Alimentação</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        Uma alimentação equilibrada é parte fundamental na prevenção e no tratamento do burnout.
        Ela contribui para a regulação do humor, redução da inflamação e fornecimento de energia
        estável ao cérebro.
      </p>
      <div className="bg-[#F5EDD0] rounded-2xl p-6 border border-[#5C8A3C]/10">
        <h3 className="font-semibold text-[#3B2A14] text-base mb-3">Eixo intestino-cérebro</h3>
        <p className="text-stone-700 text-sm leading-relaxed">
          Grande parte da serotonina é produzida no intestino. Consumir fibras e probióticos ajuda a
          manter a saúde intestinal e pode reduzir a inflamação associada à síndrome, contribuindo para
          um maior equilíbrio emocional.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { titulo: "Fibras e vegetais",  desc: "Regulam o intestino e favorecem a produção de serotonina" },
          { titulo: "Antioxidantes",      desc: "Frutas e vegetais coloridos combatem a inflamação crônica" },
          { titulo: "Ômega-3",            desc: "Peixes e sementes auxiliam na saúde cerebral e no humor" },
        ].map(({ titulo, desc }) => (
          <div key={titulo} className="bg-[#FFFDF0] rounded-xl p-4 border border-stone-100 text-center">
            <h4 className="font-semibold text-[#3B2A14] text-sm mb-1">{titulo}</h4>
            <p className="text-stone-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BurnoutPage() {
  const {
    paciente, carregandoPaciente, logoutPaciente,
    profissional, carregandoProfissional, logoutProfissional,
  } = useAuth();

  const [topicoAtivo, setTopicoAtivo] = useState<TopicoId>("o-que-e");
  const [analiseAberta,       setAnaliseAberta]       = useState(false);
  const [pacienteAberto,      setPacienteAberto]      = useState(false);
  const [profissionalAberto,  setProfissionalAberto]  = useState(false);
  const [loginAberto,         setLoginAberto]         = useState(false);
  const [loginProfAberto,     setLoginProfAberto]     = useState(false);
  const [dashboardAberto,     setDashboardAberto]     = useState(false);
  const [editarPacienteAberto, setEditarPacienteAberto] = useState(false);

  const indiceAtivo = TOPICOS.findIndex((t) => t.id === topicoAtivo);
  const topicoPrev  = indiceAtivo > 0 ? TOPICOS[indiceAtivo - 1] : null;
  const topicoNext  = indiceAtivo < TOPICOS.length - 1 ? TOPICOS[indiceAtivo + 1] : null;

  return (
    <main className="min-h-screen bg-[#FFFDF0]">

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-[#EBF4E3] border-b border-[#5C8A3C]/15 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/">
              <img src="/logo_pequeno.svg" alt="Calma mente" className="h-10 sm:h-12 w-auto" />
            </Link>
            <span className="hidden sm:inline text-stone-300 select-none">|</span>
            <span className="hidden sm:inline text-sm font-semibold text-[#5C8A3C]">Entenda o Burnout</span>
          </div>

          <div className="flex items-center gap-2">

            {/* Área do Paciente */}
            {!carregandoPaciente && (!profissional || !!paciente) && (
              <div className="flex items-center gap-2 pr-3 border-r border-[#5C8A3C]/20">
                {paciente ? (
                  <>
                    <div className="flex items-center gap-2 bg-white/70 border border-[#5C8A3C]/20 rounded-full pl-1 pr-3 py-1">
                      <div className="w-7 h-7 rounded-full bg-[#5C8A3C] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xs">
                          {paciente.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-semibold text-[#3B2A14]">
                        {paciente.nome.split(" ")[0]}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditarPacienteAberto(true)}
                      className="hidden sm:block text-xs font-medium text-[#5C8A3C] bg-[#5C8A3C]/10 hover:bg-[#5C8A3C]/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={logoutPaciente}
                      className="text-xs font-medium text-stone-500 hover:text-red-500 bg-white/50 hover:bg-red-50 border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => setLoginAberto(true)}
                    className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white font-semibold text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-full"
                  >
                    <span className="sm:hidden">Paciente</span>
                    <span className="hidden sm:inline">Sou Paciente</span>
                  </Button>
                )}
              </div>
            )}

            {/* Área do Profissional */}
            {!carregandoProfissional && (!paciente || !!profissional) && (
              <div className="flex items-center gap-2">
                {profissional ? (
                  <>
                    <div className="flex items-center gap-2 bg-white/70 border border-[#7A5C2E]/20 rounded-full pl-1 pr-3 py-1">
                      <div className="w-7 h-7 rounded-full bg-[#7A5C2E] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xs">
                          {profissional.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-semibold text-[#3B2A14]">
                        {profissional.nome.split(" ")[0]}
                      </span>
                    </div>
                    <button
                      onClick={() => setDashboardAberto(true)}
                      className="hidden sm:block text-xs font-medium text-[#7A5C2E] bg-[#7A5C2E]/10 hover:bg-[#7A5C2E]/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={logoutProfissional}
                      className="text-xs font-medium text-stone-500 hover:text-red-500 bg-white/50 hover:bg-red-50 border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => setLoginProfAberto(true)}
                    className="bg-[#7A5C2E] hover:bg-[#662f12] text-white font-semibold text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-full"
                  >
                    <span className="sm:hidden">Profissional</span>
                    <span className="hidden sm:inline">Sou Profissional</span>
                  </Button>
                )}
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F5EDD0] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#5C8A3C]/10 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Saúde e bem-estar
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#3B2A14] leading-tight mb-5">
              Entenda o{" "}
              <span className="text-[#5C8A3C]">Burnout</span>
            </h1>
            <p className="text-stone-500 text-base md:text-lg leading-relaxed">
              Conteúdo baseado em evidências sobre a Síndrome de Esgotamento Profissional —
              o que é, como identificar e quais caminhos existem para a recuperação.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Abas mobile ─────────────────────────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-stone-100 overflow-x-auto">
        <div className="flex gap-2 px-4 py-3 w-max">
          {TOPICOS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTopicoAtivo(t.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                topicoAtivo === t.id
                  ? "bg-[#5C8A3C] text-white shadow-sm"
                  : "bg-[#5C8A3C]/10 text-[#5C8A3C] hover:bg-[#5C8A3C]/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Conteúdo ────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6 flex gap-10">

          {/* Sidebar - desktop */}
          <aside className="hidden lg:flex flex-col gap-1 w-52 shrink-0 sticky top-20 self-start">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest px-4 mb-2">
              Tópicos
            </p>
            {TOPICOS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopicoAtivo(t.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  topicoAtivo === t.id
                    ? "bg-[#5C8A3C] text-white shadow-md shadow-[#5C8A3C]/20"
                    : "text-stone-600 hover:bg-[#5C8A3C]/10 hover:text-[#5C8A3C]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </aside>

          {/* Painel de conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-stone-100 p-7 md:p-10 shadow-sm min-h-80">
              {SECOES[topicoAtivo]}
            </div>

            {/* Navegação anterior / próximo */}
            <div className="flex justify-between mt-5">
              {topicoPrev ? (
                <button
                  onClick={() => setTopicoAtivo(topicoPrev.id)}
                  className="cursor-pointer text-xs font-semibold text-stone-500 hover:text-[#5C8A3C] bg-white hover:bg-[#5C8A3C]/8 border border-stone-200 hover:border-[#5C8A3C]/30 flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {topicoPrev.label}
                </button>
              ) : <div />}

              {topicoNext ? (
                <button
                  onClick={() => setTopicoAtivo(topicoNext.id)}
                  className="cursor-pointer text-xs font-semibold text-stone-500 hover:text-[#5C8A3C] bg-white hover:bg-[#5C8A3C]/8 border border-stone-200 hover:border-[#5C8A3C]/30 flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200"
                >
                  {topicoNext.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : <div />}
            </div>
          </div>

        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#EBF4E3] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="inline-block bg-[#5C8A3C]/15 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            Próximo passo
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3B2A14] mb-4">
            Encontre o profissional certo para você
          </h2>
          <p className="text-stone-600 text-base leading-relaxed mb-8">
            Responda algumas perguntas e descubra qual especialista é mais indicado
            para o seu momento — gratuito e sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => setAnaliseAberta(true)}
              className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white px-8 py-5 sm:px-12 sm:py-7 text-base sm:text-lg rounded-2xl font-bold shadow-lg shadow-[#5C8A3C]/25 hover:shadow-xl hover:shadow-[#5C8A3C]/30 transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto"
            >
              Fazer Análise Gratuita
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="border-[#5C8A3C] text-[#5C8A3C] hover:bg-[#5C8A3C]/8 px-8 py-5 sm:px-10 sm:py-7 text-base rounded-2xl font-semibold w-full sm:w-auto"
              >
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#3B2A14] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/logo_rodape.svg" alt="Calma mente" className="h-10 sm:h-12 w-auto" />
          </div>
          <p className="text-white/40 text-sm font-bold text-center">
            Conectando pacientes aos profissionais de saúde certos.
          </p>
          <button
            onClick={() => setAnaliseAberta(true)}
            className="text-sm font-bold text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
          >
            Fazer análise gratuita
          </button>
        </div>
      </footer>

      {/* ─── Modais ──────────────────────────────────────────────────────── */}
      <AnaliseGratuitaModal
        aberto={analiseAberta}
        onFechar={() => setAnaliseAberta(false)}
        onLoginClick={() => setLoginAberto(true)}
        onCadastrarClick={() => setPacienteAberto(true)}
      />
      <CadastroPacienteModal
        aberto={pacienteAberto}
        onFechar={() => setPacienteAberto(false)}
        onLoginClick={() => setLoginAberto(true)}
      />
      <CadastroProfissionalModal
        aberto={profissionalAberto}
        onFechar={() => setProfissionalAberto(false)}
        onLoginClick={() => setLoginProfAberto(true)}
      />
      <LoginModal
        aberto={loginAberto}
        onFechar={() => setLoginAberto(false)}
        onCadastrar={() => setPacienteAberto(true)}
      />
      <LoginProfissionalModal
        aberto={loginProfAberto}
        onFechar={() => setLoginProfAberto(false)}
        onCadastrar={() => setProfissionalAberto(true)}
      />
      <DashboardProfissionalModal
        aberto={dashboardAberto}
        onFechar={() => setDashboardAberto(false)}
      />
      <EditarPerfilPacienteModal
        aberto={editarPacienteAberto}
        onFechar={() => setEditarPacienteAberto(false)}
      />
    </main>
  );
}
