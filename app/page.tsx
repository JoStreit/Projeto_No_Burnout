"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnaliseGratuitaModal from "@/components/AnaliseGratuitaModal";
import CadastroPacienteModal from "@/components/CadastroPacienteModal";
import CadastroProfissionalModal from "@/components/CadastroProfissionalModal";
import LoginModal from "@/components/LoginModal";
import LoginProfissionalModal from "@/components/LoginProfissionalModal";
import MensagemDiaria from "@/components/MensagemDiaria";
import BuscarProfissionaisModal from "@/components/BuscarProfissionaisModal";
import DashboardProfissionalModal from "@/components/DashboardProfissionalModal";
import EditarPerfilPacienteModal from "@/components/EditarPerfilPacienteModal";
import { useAuth } from "@/components/AuthProvider";

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    pergunta: "Como funciona a análise gratuita?",
    resposta:
      "Você responde algumas perguntas rápidas sobre saúde, hábitos e objetivos. Nosso sistema analisa suas respostas e indica o tipo de profissional mais adequado ao seu perfil, sem cadastro e sem custo.",
  },
  {
    pergunta: "Preciso me cadastrar para ver os profissionais?",
    resposta:
      "Sim. O cadastro de paciente é gratuito e permite visualizar a lista completa de profissionais disponíveis, filtrar por modalidade (presencial ou remoto) e localização.",
  },
  {
    pergunta: "Os atendimentos são presenciais ou online?",
    resposta:
      "Depende de cada profissional. Ao se cadastrar, o profissional indica as modalidades que oferece. Você pode filtrar por presencial, remoto (seu estado) ou remoto (todo o Brasil).",
  },
  {
    pergunta: "Como os profissionais são cadastrados na plataforma?",
    resposta:
      "Cada profissional cria seu próprio perfil informando CPF, número de carteirinha profissional, ramo de atuação e modalidade de atendimento. Os perfis têm vigência definida e precisam ser mantidos ativos.",
  },
  {
    pergunta: "É gratuito para os pacientes?",
    resposta:
      "Sim. O cadastro e o uso da plataforma são totalmente gratuitos para pacientes. Você pode fazer a análise, buscar profissionais e gerenciar seu perfil sem nenhum custo.",
  },
  {
    pergunta: "Posso editar meu perfil depois do cadastro?",
    resposta:
      "Sim. Tanto pacientes quanto profissionais podem editar suas informações a qualquer momento através do painel de perfil disponível após o login.",
  },
];

// ─── Componente FAQ Accordion ─────────────────────────────────────────────────

function FaqItem({ pergunta, resposta, aberto, onToggle }: {
  pergunta: string;
  resposta: string;
  aberto: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-5 text-left hover:bg-stone-50 transition-colors"
      >
        <span className="text-sm font-medium text-stone-700 pr-4">{pergunta}</span>
        <span
          className={`text-[#5C8A3C] text-lg font-light shrink-0 transition-transform duration-200 ${
            aberto ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {aberto && (
        <div className="px-5 pb-4">
          <p className="text-sm text-stone-500 leading-relaxed">{resposta}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const {
    paciente, carregandoPaciente, logoutPaciente,
    profissional, carregandoProfissional, logoutProfissional,
  } = useAuth();

  useEffect(() => {
    if (!sessionStorage.getItem("visitaRegistrada")) {
      sessionStorage.setItem("visitaRegistrada", "1");
      fetch("/api/visitas", { method: "POST" }).catch(() => {});
    }
  }, []);

  const [analiseAberta, setAnaliseAberta] = useState(false);
  const [pacienteAberto, setPacienteAberto] = useState(false);
  const [profissionalAberto, setProfissionalAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [loginProfAberto, setLoginProfAberto] = useState(false);
  const [buscarAberto, setBuscarAberto] = useState(false);
  const [dashboardAberto, setDashboardAberto] = useState(false);
  const [editarPacienteAberto, setEditarPacienteAberto] = useState(false);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#FFFDF0]">

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-[#EBF4E3] border-b border-[#5C8A3C]/15 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="/logo_pequeno.svg"
              alt="Calma mente"
              className="h-10 sm:h-12 w-auto"
            />
          </div>

          {/* Nav links */}
          <div className="hidden sm:flex items-center flex-1 px-6">
            <Link
              href="/burnout"
              className="text-xs font-semibold text-[#5C8A3C] bg-[#5C8A3C]/10 hover:bg-[#5C8A3C]/20 border border-[#5C8A3C]/25 hover:border-[#5C8A3C]/40 px-4 py-1.5 rounded-full transition-all duration-200"
            >
              Sobre o Burnout
            </Link>
          </div>

          {/* Auth área */}
          <div className="flex items-center gap-2">

            {/* Área do Paciente */}
            {!carregandoPaciente && (!profissional || !!paciente) && (
              <div className="flex items-center gap-2 pr-3 border-r border-[#5C8A3C]/20">
                {paciente ? (
                  <>
                    {/* Badge com avatar + nome */}
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
                    {/* Badge com avatar + nome + label Profissional */}
                    <div className="flex items-center gap-2 bg-white/70 border border-[#7A5C2E]/30 rounded-full pl-1 pr-3 py-1">
                      <div className="w-7 h-7 rounded-full bg-[#7A5C2E] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xs">
                          {profissional.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="hidden sm:flex flex-col leading-none">
                        <span className="text-xs font-bold text-[#7A5C2E] uppercase tracking-wide">Profissional</span>
                        <span className="text-sm font-semibold text-[#3B2A14]">
                          {profissional.nome.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDashboardAberto(true)}
                      className="hidden sm:block text-xs font-medium text-[#7A5C2E] bg-[#7A5C2E]/10 hover:bg-[#7A5C2E]/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Perfil
                    </button>
                    {profissional.status === "Inativo" && (
                      <button className="hidden sm:block text-xs font-semibold text-white bg-[#5C8A3C] hover:bg-[#3A6624] px-3 py-1.5 rounded-full transition-colors shadow-sm">
                        Ativar Cadastro
                      </button>
                    )}
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
      <section className="bg-[#F5EDD0]">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-[#5C8A3C]/10 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Plataforma de apoio personalizado para o Burnout
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3B2A14] leading-tight mb-6">
              Encontre o profissional{" "}
              <span className="text-[#5C8A3C]">certo para você</span>
            </h1>

            <p className="text-stone-500 text-lg leading-relaxed max-w-lg mb-10 mx-auto md:mx-0">
              Síndrome de burnout é um distúrbio emocional relacionado ao estresse frequente no
              ambiente de trabalho, causando sintomas como exaustão física e emocional, falta de
              motivação, insônia e irritabilidade constante. Responda algumas perguntas e descubra
              qual profissional é ideal para o seu momento. Rápido, gratuito e sem compromisso.
            </p>

            <div className="flex flex-col items-center md:items-start gap-4">
              <Button
                size="lg"
                onClick={() => setAnaliseAberta(true)}
                className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white px-8 py-5 sm:px-14 sm:py-8 text-lg sm:text-xl rounded-2xl font-bold shadow-lg shadow-[#5C8A3C]/25 hover:shadow-xl hover:shadow-[#5C8A3C]/30 transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto"
              >
                Fazer Análise Gratuita
              </Button>

              {paciente ? (
                <Button
                  variant="outline"
                  onClick={() => setBuscarAberto(true)}
                  className="border-[#5C8A3C] text-[#5C8A3C] hover:bg-[#5C8A3C]/8 px-10 py-6 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Buscar Profissionais
                </Button>
              ) : profissional ? (
                <Button
                  variant="outline"
                  onClick={() => setDashboardAberto(true)}
                  className="border-[#7A5C2E] text-[#7A5C2E] hover:bg-[#7A5C2E]/8 px-10 py-6 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Editar Perfil
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setPacienteAberto(true)}
                  className="border-[#5C8A3C] text-[#5C8A3C] hover:bg-[#5C8A3C]/8 px-10 py-6 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Criar conta gratuitamente
                </Button>
              )}
            </div>

          </div>

          {/* Logo decorativa */}
          <div className="shrink-0 hidden sm:flex flex-col items-center justify-center ml-8">
            <img
              src="/logo.svg"
              alt="Calma mente"
              className="w-72 md:w-96 opacity-95"
            />
          </div>

        </div>
      </section>

      {/* ─── Mensagem Diária ─────────────────────────────────────────────── */}
      <MensagemDiaria />

      {/* ─── Como funciona ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A14] mb-4">
              Como a plataforma funciona
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto text-base">
              Uma forma simples e eficiente de conectar pacientes aos profissionais de saúde certos.
              Você responde algumas perguntas, nós avaliamos e recomendamos os melhores profissionais para o seu bem estar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1 — Sobre o Burnout */}
            <Link href="/burnout">
              <div className="group p-8 rounded-2xl border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#F5EDD0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5C8A3C]/10 transition-colors">
                  <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">Sobre o Burnout</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Entenda o que é a síndrome de esgotamento profissional, seus sintomas e as abordagens disponíveis para tratamento e prevenção.
                </p>
                <span className="text-xs font-medium text-[#5C8A3C]">Saiba mais →</span>
              </div>
            </Link>

            {/* Card 2 — Análise Personalizada */}
            <div
              className="group p-8 rounded-2xl border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300 cursor-pointer"
              onClick={() => setAnaliseAberta(true)}
            >
              <div className="w-14 h-14 bg-[#F5EDD0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5C8A3C]/10 transition-colors">
                <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">Análise Personalizada</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                {profissional
                  ? "Nosso algoritmo analisa o perfil do paciente e recomenda o profissional adequado, e este profissional pode ser você. Mantenha seu perfil ativo."
                  : "Nosso algoritmo analisa seu perfil e recomenda o profissional de saúde mais adequado para suas necessidades atuais."}
              </p>
              <span className="text-xs font-medium text-[#5C8A3C]">Fazer análise →</span>
            </div>

            {/* Card 3 — Cadastro de Paciente */}
            {paciente ? (
              <div
                className="group p-8 rounded-2xl border border-[#5C8A3C]/20 bg-[#5C8A3C]/3 hover:border-[#5C8A3C]/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setEditarPacienteAberto(true)}
              >
                <div className="w-14 h-14 bg-[#5C8A3C]/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">Editar Meu Perfil</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Mantenha suas informações e preferências de busca atualizadas para obter as melhores recomendações de profissionais.
                </p>
                <span className="text-xs font-medium text-[#5C8A3C]">Editar perfil →</span>
              </div>
            ) : (
              <div
                className="group p-8 rounded-2xl border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300 cursor-pointer"
                onClick={() => setPacienteAberto(true)}
              >
                <div className="w-14 h-14 bg-[#F5EDD0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5C8A3C]/10 transition-colors">
                  <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">Cadastro de Paciente</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Crie seu perfil gratuitamente para ter as melhores recomendações de profissionais de acordo com seu perfil e localização.
                </p>
                <span className="text-xs font-medium text-[#5C8A3C]">Cadastrar agora →</span>
              </div>
            )}

            {/* Card 4 — Cadastro Profissional */}
            {profissional ? (
              <div
                className="group p-8 rounded-2xl border border-[#7A5C2E]/20 bg-[#7A5C2E]/3 hover:border-[#7A5C2E]/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setDashboardAberto(true)}
              >
                <div className="w-14 h-14 bg-[#7A5C2E]/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#7A5C2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">Meu Perfil Profissional</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Atualize suas informações, modalidade de atendimento e mantenha seu cadastro sempre em dia para ser encontrado pelos pacientes.
                </p>
                <span className="text-xs font-medium text-[#7A5C2E]">Abrir perfil →</span>
              </div>
            ) : (
              <div
                className="group p-8 rounded-2xl border border-stone-100 hover:border-[#7A5C2E]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setProfissionalAberto(true)}
              >
                <div className="w-14 h-14 bg-[#F5EDD0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#7A5C2E]/10 transition-colors">
                  <svg className="w-7 h-7 text-[#7A5C2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">Para Profissionais</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Cadastre-se como profissional de saúde e seja recomendado para pacientes que precisam do seu perfil de atendimento.
                </p>
                <span className="text-xs font-medium text-[#7A5C2E]">Quero me cadastrar →</span>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ─── Questionário & Especialidades ──────────────────────────────── */}
      <section className="bg-[#FFFDF0] py-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Intro do questionário */}
          <div className="text-center mb-14">
            <span className="inline-block bg-[#5C8A3C]/10 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Avaliação personalizada
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A14] mb-5">
              O questionário que entende você
            </h2>
            <p className="text-stone-500 text-base leading-relaxed max-w-2xl mx-auto">
              O questionário é uma avaliação rápida do seu estado atual: hábitos, bem-estar, objetivos e necessidades. A partir das suas respostas, nosso sistema identifica qual ou quais profissionais de saúde são mais indicados para o seu momento, de forma personalizada e sem achismos.
            </p>
            <button
              onClick={() => setAnaliseAberta(true)}
              className="mt-8 inline-flex items-center gap-2 bg-[#5C8A3C] hover:bg-[#3A6624] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md shadow-[#5C8A3C]/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Responder o questionário
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Blocos por especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Psicólogo */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300">
              <h3 className="font-bold text-[#5C8A3C] text-base mb-2">Psicólogo</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Cuida da saúde mental e emocional. Auxilia em questões como ansiedade, depressão, estresse, autoestima, relacionamentos e desenvolvimento pessoal através de acompanhamento terapêutico.
              </p>
            </div>

            {/* Nutricionista */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300">
              <h3 className="font-bold text-[#5C8A3C] text-base mb-2">Nutricionista</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Especialista em alimentação e nutrição. Elabora planos alimentares personalizados para perda de peso, ganho de massa, controle de doenças crônicas e melhora do bem-estar geral.
              </p>
            </div>

            {/* Personal Trainer */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300">
              <h3 className="font-bold text-[#5C8A3C] text-base mb-2">Personal Trainer</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Profissional de educação física focado em treino individualizado. Cria programas de exercícios para condicionamento, emagrecimento, hipertrofia e qualidade de vida com acompanhamento próximo.
              </p>
            </div>

            {/* Fisioterapeuta */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300">
              <h3 className="font-bold text-[#5C8A3C] text-base mb-2">Fisioterapeuta</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Atua na reabilitação e prevenção de lesões musculoesqueléticas. Trata dores, recupera mobilidade após cirurgias ou lesões e melhora a funcionalidade do corpo com técnicas terapêuticas especializadas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#7A5C2E] py-20">
        <div className="max-w-4xl mx-auto px-6">

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Dúvidas comuns</h2>
              <p className="text-white/60 text-sm mt-1">Respostas para as perguntas mais frequentes sobre a plataforma.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                pergunta={faq.pergunta}
                resposta={faq.resposta}
                aberto={faqAberto === i}
                onToggle={() => setFaqAberto(faqAberto === i ? null : i)}
              />
            ))}
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
      <BuscarProfissionaisModal
        aberto={buscarAberto}
        onFechar={() => setBuscarAberto(false)}
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
