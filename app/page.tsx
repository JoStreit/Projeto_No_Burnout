"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
      "Você responde 5 perguntas rápidas sobre saúde, hábitos e objetivos. Nosso sistema analisa suas respostas e indica o tipo de profissional mais adequado ao seu perfil — sem cadastro, sem custo.",
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
          className={`text-[#4a6741] text-lg font-light shrink-0 transition-transform duration-200 ${
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
    <main className="min-h-screen bg-[#faf7f4]">

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-[#eaf2e7] border-b border-[#4a6741]/15 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.png"
              alt="SaúdeConnect"
              width={72}
              height={72}
              className="object-contain mix-blend-multiply"
            />
            <span className="font-bold text-[#3c2010] text-xl tracking-tight">
              Saúde<span className="text-[#4a6741]">Connect</span>
            </span>
          </div>

          {/* Auth área */}
          <div className="flex items-center gap-2">

            {/* Área do Paciente */}
            {!carregandoPaciente && (!profissional || !!paciente) && (
              <div className="flex items-center gap-2 pr-3 border-r border-[#4a6741]/20">
                {paciente ? (
                  <>
                    {/* Badge com avatar + nome */}
                    <div className="flex items-center gap-2 bg-white/70 border border-[#4a6741]/20 rounded-full pl-1 pr-3 py-1">
                      <div className="w-7 h-7 rounded-full bg-[#4a6741] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xs">
                          {paciente.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-semibold text-[#3c2010]">
                        {paciente.nome.split(" ")[0]}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditarPacienteAberto(true)}
                      className="hidden sm:block text-xs font-medium text-[#4a6741] bg-[#4a6741]/10 hover:bg-[#4a6741]/20 px-3 py-1.5 rounded-full transition-colors"
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
                    className="bg-[#4a6741] hover:bg-[#3d5836] text-white font-semibold text-sm h-9 px-4 rounded-full"
                  >
                    Sou Paciente
                  </Button>
                )}
              </div>
            )}

            {/* Área do Profissional */}
            {!carregandoProfissional && (!paciente || !!profissional) && (
              <div className="flex items-center gap-2">
                {profissional ? (
                  <>
                    {/* Badge com avatar + nome */}
                    <div className="flex items-center gap-2 bg-white/70 border border-[#7a3d18]/20 rounded-full pl-1 pr-3 py-1">
                      <div className="w-7 h-7 rounded-full bg-[#7a3d18] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xs">
                          {profissional.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-semibold text-[#3c2010]">
                        {profissional.nome.split(" ")[0]}
                      </span>
                    </div>
                    <button
                      onClick={() => setDashboardAberto(true)}
                      className="hidden sm:block text-xs font-medium text-[#7a3d18] bg-[#7a3d18]/10 hover:bg-[#7a3d18]/20 px-3 py-1.5 rounded-full transition-colors"
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
                    className="bg-[#7a3d18] hover:bg-[#662f12] text-white font-semibold text-sm h-9 px-4 rounded-full"
                  >
                    Sou Profissional
                  </Button>
                )}
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[#ede0d4]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-[#4a6741]/10 text-[#4a6741] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Plataforma de saúde personalizada
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3c2010] leading-tight mb-6">
              Encontre o profissional{" "}
              <span className="text-[#4a6741]">certo para você</span>
            </h1>

            <p className="text-stone-500 text-lg leading-relaxed max-w-lg mb-10 mx-auto md:mx-0">
              Responda algumas perguntas e descubra qual profissional de saúde é
              ideal para o seu perfil. Rápido, gratuito e sem compromisso.
            </p>

            <div className="flex flex-col items-center md:items-start gap-4">
              <Button
                size="lg"
                onClick={() => setAnaliseAberta(true)}
                className="bg-[#4a6741] hover:bg-[#3d5836] text-white px-14 py-8 text-xl rounded-2xl font-bold shadow-lg shadow-[#4a6741]/25 hover:shadow-xl hover:shadow-[#4a6741]/30 transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto"
              >
                Fazer Análise Gratuita
              </Button>

              {paciente ? (
                <Button
                  variant="outline"
                  onClick={() => setBuscarAberto(true)}
                  className="border-[#4a6741] text-[#4a6741] hover:bg-[#4a6741]/8 px-10 py-6 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Buscar Profissionais
                </Button>
              ) : profissional ? (
                <Button
                  variant="outline"
                  onClick={() => setDashboardAberto(true)}
                  className="border-[#7a3d18] text-[#7a3d18] hover:bg-[#7a3d18]/8 px-10 py-6 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Editar Perfil
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setPacienteAberto(true)}
                  className="border-[#4a6741] text-[#4a6741] hover:bg-[#4a6741]/8 px-10 py-6 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Criar conta gratuitamente
                </Button>
              )}
            </div>

          </div>

          {/* Logo decorativa */}
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-[#4a6741]/8" />
              <div className="absolute inset-4 rounded-full bg-[#4a6741]/6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="SaúdeConnect"
                  width={320}
                  height={320}
                  className="object-contain opacity-90"
                />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-[#3c2010] tracking-tight">
              Saúde<span className="text-[#4a6741]">Connect</span>
            </p>
          </div>

        </div>
      </section>

      {/* ─── Mensagem Diária ─────────────────────────────────────────────── */}
      <MensagemDiaria />

      {/* ─── Como funciona ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3c2010] mb-4">
              Como a plataforma funciona
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto text-base">
              Uma forma simples e eficiente de conectar pacientes aos profissionais de saúde certos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 — Análise */}
            <div className="group p-8 rounded-2xl border border-stone-100 hover:border-[#4a6741]/30 hover:shadow-lg hover:shadow-[#4a6741]/5 transition-all duration-300">
              <div className="w-14 h-14 bg-[#ede0d4] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4a6741]/10 transition-colors">
                <svg className="w-7 h-7 text-[#4a6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#3c2010] text-lg mb-3">Análise Personalizada</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {profissional
                  ? "Nosso algoritmo analisa o perfil do paciente e recomenda o profissional adequado — e este profissional pode ser você. Mantenha seu perfil ativo."
                  : "Nosso algoritmo analisa seu perfil e recomenda o profissional de saúde mais adequado para suas necessidades atuais."}
              </p>
            </div>

            {/* Card 2 — Paciente / Profissional */}
            {profissional ? (
              <div
                className="group p-8 rounded-2xl border border-[#7a3d18]/20 bg-[#7a3d18]/3 hover:border-[#7a3d18]/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setDashboardAberto(true)}
              >
                <div className="w-14 h-14 bg-[#7a3d18]/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#7a3d18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3c2010] text-lg mb-3">Meu Perfil Profissional</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Atualize suas informações, modalidade de atendimento e mantenha seu cadastro sempre em dia para ser encontrado pelos pacientes.
                </p>
                <span className="text-xs font-medium text-[#7a3d18]">Abrir perfil →</span>
              </div>
            ) : paciente ? (
              <div
                className="group p-8 rounded-2xl border border-[#4a6741]/20 bg-[#4a6741]/3 hover:border-[#4a6741]/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setEditarPacienteAberto(true)}
              >
                <div className="w-14 h-14 bg-[#4a6741]/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#4a6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3c2010] text-lg mb-3">Editar Meu Perfil</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Mantenha suas informações e preferências de busca atualizadas para obter as melhores recomendações de profissionais.
                </p>
                <span className="text-xs font-medium text-[#4a6741]">Editar perfil →</span>
              </div>
            ) : (
              <div
                className="group p-8 rounded-2xl border border-stone-100 hover:border-[#4a6741]/30 hover:shadow-lg hover:shadow-[#4a6741]/5 transition-all duration-300 cursor-pointer"
                onClick={() => setPacienteAberto(true)}
              >
                <div className="w-14 h-14 bg-[#ede0d4] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4a6741]/10 transition-colors">
                  <svg className="w-7 h-7 text-[#4a6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3c2010] text-lg mb-3">Cadastro de Paciente</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Crie seu perfil gratuitamente para ter as melhores recomendações de profissionais de acordo com seu perfil e localização.
                </p>
                <span className="text-xs font-medium text-[#4a6741]">Cadastrar agora →</span>
              </div>
            )}

            {/* Card 3 — Buscar / Para Profissionais */}
            {paciente && !profissional ? (
              <div
                className="group p-8 rounded-2xl border border-stone-100 hover:border-[#4a6741]/30 hover:shadow-lg hover:shadow-[#4a6741]/5 transition-all duration-300 cursor-pointer"
                onClick={() => setBuscarAberto(true)}
              >
                <div className="w-14 h-14 bg-[#ede0d4] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4a6741]/10 transition-colors">
                  <svg className="w-7 h-7 text-[#4a6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3c2010] text-lg mb-3">Buscar Profissionais</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  Encontre profissionais de saúde de acordo com sua localização e preferência de atendimento presencial ou online.
                </p>
                <span className="text-xs font-medium text-[#4a6741]">Buscar profissionais →</span>
              </div>
            ) : (
              <div className="group p-8 rounded-2xl border border-stone-100 hover:border-[#7a3d18]/30 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#ede0d4] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#7a3d18]/10 transition-colors">
                  <svg className="w-7 h-7 text-[#7a3d18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#3c2010] text-lg mb-3">Para Profissionais</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">
                  {profissional
                    ? "Mesmo com perfil profissional você pode cadastrar seu perfil de paciente e encontrar um profissional de saúde para você."
                    : "Cadastre-se como profissional de saúde e seja recomendado para pacientes que precisam do seu perfil de atendimento."}
                </p>
                {!profissional && (
                  <button
                    onClick={() => setProfissionalAberto(true)}
                    className="text-xs font-medium text-[#7a3d18] hover:underline"
                  >
                    Quero me cadastrar →
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#7a3d18] py-20">
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
      <footer className="bg-[#3c2010] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="SaúdeConnect" width={28} height={28} className="object-contain opacity-80" />
            <span className="text-white/60 text-sm font-medium">SaúdeConnect</span>
          </div>
          <p className="text-white/40 text-xs text-center">
            Conectando pacientes aos profissionais de saúde certos.
          </p>
          <button
            onClick={() => setAnaliseAberta(true)}
            className="text-xs text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
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
