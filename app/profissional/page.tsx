"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import CadastroProfissionalModal from "@/components/CadastroProfissionalModal";
import LoginProfissionalModal from "@/components/LoginProfissionalModal";
import DashboardProfissionalModal from "@/components/DashboardProfissionalModal";
import CadastroPacienteModal from "@/components/CadastroPacienteModal";
import LoginModal from "@/components/LoginModal";
import EditarPerfilPacienteModal from "@/components/EditarPerfilPacienteModal";
import AnaliseGratuitaModal from "@/components/AnaliseGratuitaModal";

// ─── Planos ───────────────────────────────────────────────────────────────────

const PLANOS = [
  {
    nome: "Mensal",
    preco: "R$ 20",
    periodo: "/mês",
    porMes: null,
    descricao: "Ideal para começar e testar a plataforma.",
    destaque: false,
    items: [
      "Perfil visível na busca",
      "Sugestão automática aos pacientes",
      "Contato direto via WhatsApp e e-mail",
      "Cancelamento a qualquer momento",
    ],
  },
  {
    nome: "Trimestral",
    preco: "R$ 50",
    periodo: "/trimestre",
    porMes: "R$ 16,67/mês",
    descricao: "Melhor custo-benefício para quem busca constância.",
    destaque: true,
    items: [
      "Perfil visível na busca",
      "Sugestão automática aos pacientes",
      "Contato direto via WhatsApp e e-mail",
      "Economia de 17% em relação ao mensal",
    ],
  },
  {
    nome: "Anual",
    preco: "R$ 120",
    periodo: "/ano",
    porMes: "R$ 10,00/mês",
    descricao: "Para profissionais comprometidos com crescimento contínuo.",
    destaque: false,
    items: [
      "Perfil visível na busca",
      "Sugestão automática aos pacientes",
      "Contato direto via WhatsApp e e-mail",
      "Economia de 50% em relação ao mensal",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfissionalPage() {
  const router = useRouter();
  const {
    paciente, carregandoPaciente, logoutPaciente,
    profissional, carregandoProfissional, logoutProfissional,
  } = useAuth();

  const diasVigencia = profissional
    ? Math.ceil((new Date(profissional.vigenciaFim).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : Infinity;
  const planoUrgente = profissional ? diasVigencia <= 7 : false;

  const [cadastroAberto,      setCadastroAberto]      = useState(false);
  const [loginProfAberto,     setLoginProfAberto]     = useState(false);
  const [dashboardAberto,     setDashboardAberto]     = useState(false);
  const [dashboardEditando,   setDashboardEditando]   = useState(false);
  const [pacienteAberto,      setPacienteAberto]      = useState(false);
  const [loginAberto,         setLoginAberto]         = useState(false);
  const [editarPacienteAberto, setEditarPacienteAberto] = useState(false);
  const [analiseAberta,       setAnaliseAberta]       = useState(false);

  return (
    <main className="min-h-screen bg-[#FFFDF0]">

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-[#EBF4E3] border-b border-[#5C8A3C]/15 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/">
              <img src="/logo_pequeno.svg" alt="Calma mente" className="h-10 sm:h-12 w-auto" />
            </Link>
            <Link
              href="/"
              className="hidden sm:inline text-xs font-semibold text-[#5C8A3C] bg-[#5C8A3C]/10 hover:bg-[#5C8A3C]/20 border border-[#5C8A3C]/25 hover:border-[#5C8A3C]/40 px-4 py-1.5 rounded-full transition-all duration-200"
            >
              Início
            </Link>
          </div>

          <div className="flex items-center gap-2">

            {/* Área do Paciente */}
            {!carregandoPaciente && (!profissional || !!paciente) && (
              <div className="flex items-center gap-2 pr-3 border-r border-[#5C8A3C]/20">
                {paciente ? (
                  <>
                    <div className="flex items-center gap-2 bg-white/70 border border-[#5C8A3C]/20 rounded-full pl-1 pr-3 py-1">
                      <div className="w-7 h-7 rounded-full bg-[#5C8A3C] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-xs">{paciente.nome.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="hidden sm:block text-sm font-semibold text-[#3B2A14]">
                        {paciente.nome.split(" ")[0]}
                      </span>
                    </div>
                    <button onClick={() => setEditarPacienteAberto(true)} className="hidden sm:block text-xs font-medium text-[#5C8A3C] bg-[#5C8A3C]/10 hover:bg-[#5C8A3C]/20 px-3 py-1.5 rounded-full transition-colors">Perfil</button>
                    <button onClick={logoutPaciente} className="text-xs font-medium text-stone-500 hover:text-red-500 bg-white/50 hover:bg-red-50 border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors">Sair</button>
                  </>
                ) : (
                  <Button onClick={() => setLoginAberto(true)} className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white font-semibold text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-full">
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
                        <span className="text-white font-bold text-xs">{profissional.nome.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="hidden sm:flex flex-col leading-none">
                        <span className="text-xs font-bold text-[#7A5C2E] uppercase tracking-wide">Profissional</span>
                        <span className="text-sm font-semibold text-[#3B2A14]">{profissional.nome.split(" ")[0]}</span>
                      </div>
                    </div>
                    <button onClick={() => setDashboardAberto(true)} className="hidden sm:block text-xs font-medium text-[#7A5C2E] bg-[#7A5C2E]/10 hover:bg-[#7A5C2E]/20 px-3 py-1.5 rounded-full transition-colors">Perfil</button>
                    <button
                      onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        planoUrgente
                          ? "text-white bg-amber-500 hover:bg-amber-600 shadow-sm"
                          : "text-[#7A5C2E] bg-[#7A5C2E]/10 hover:bg-[#7A5C2E]/20"
                      }`}
                    >
                      {planoUrgente ? "Renovar Plano" : "Planos"}
                    </button>
                    {profissional.status === "Inativo" && (
                      <button onClick={() => { setDashboardEditando(true); setDashboardAberto(true); }} className="hidden sm:block text-xs font-semibold text-white bg-[#5C8A3C] hover:bg-[#3A6624] px-3 py-1.5 rounded-full transition-colors shadow-sm">Ativar Cadastro</button>
                    )}
                    <button onClick={logoutProfissional} className="text-xs font-medium text-stone-500 hover:text-red-500 bg-white/50 hover:bg-red-50 border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors">Sair</button>
                  </>
                ) : (
                  <Button onClick={() => setLoginProfAberto(true)} className="bg-[#7A5C2E] hover:bg-[#662f12] text-white font-semibold text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-full">
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
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-24">

          {/* Promo banner */}
          <div className="inline-flex items-center gap-2 bg-[#5C8A3C] text-white text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-md shadow-[#5C8A3C]/25">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cadastre-se até 15/06/2026 e ganhe 3 meses gratuitos
          </div>

          <div className="max-w-2xl">
            <span className="inline-block bg-[#7A5C2E]/10 text-[#7A5C2E] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Para Profissionais de Saúde
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#3B2A14] leading-tight mb-5">
              Amplie seu alcance e conecte-se com quem{" "}
              <span className="text-[#5C8A3C]">precisa de você</span>
            </h1>
            <p className="text-stone-500 text-base md:text-lg leading-relaxed mb-8">
              A demanda por profissionais de saúde mental e bem-estar nunca foi tão alta.
              Cadastre-se na plataforma, preencha seus dados e comece a receber contatos
              de pacientes que precisam exatamente do seu perfil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {profissional ? (
                <>
                  <Button
                    onClick={() => setDashboardAberto(true)}
                    className="bg-[#7A5C2E] hover:bg-[#662f12] text-white px-8 py-5 sm:px-12 sm:py-7 text-base sm:text-lg rounded-2xl font-bold shadow-lg shadow-[#7A5C2E]/25 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Acessar meu Perfil
                  </Button>
                  <Button
                    onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
                    className={`px-8 py-5 sm:px-10 sm:py-7 text-base sm:text-lg rounded-2xl font-bold transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto ${
                      planoUrgente
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl"
                        : "border-2 border-[#7A5C2E] text-[#7A5C2E] hover:bg-[#7A5C2E]/8"
                    }`}
                  >
                    {planoUrgente
                      ? diasVigencia <= 0
                        ? "Renovar Plano — Expirado"
                        : `Renovar Plano — ${diasVigencia}d`
                      : "Ver Planos"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setCadastroAberto(true)}
                    className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white px-8 py-5 sm:px-12 sm:py-7 text-base sm:text-lg rounded-2xl font-bold shadow-lg shadow-[#5C8A3C]/25 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Criar meu cadastro
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLoginProfAberto(true)}
                    className="border-[#7A5C2E] text-[#7A5C2E] hover:bg-[#7A5C2E]/8 px-8 py-5 sm:px-10 sm:py-7 text-base rounded-2xl font-semibold w-full sm:w-auto"
                  >
                    Já tenho cadastro
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Como funciona ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#5C8A3C]/10 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Simples e direto
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A14] mb-4">
              Como funciona para o profissional
            </h2>
            <p className="text-stone-500 text-base max-w-xl mx-auto">
              Sem complicação. Três passos e você já está disponível para receber pacientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                numero: "01",
                titulo: "Faça seu cadastro",
                descricao: "Preencha seus dados: nome, ramo de atuação, localização, modalidade de atendimento (presencial ou online) e formas de contato.",
                icone: (
                  <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ),
              },
              {
                numero: "02",
                titulo: "Seja encontrado",
                descricao: "Quando um paciente responde ao questionário, o sistema analisa o perfil dele e sugere automaticamente o profissional mais adequado.",
                icone: (
                  <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
              {
                numero: "03",
                titulo: "Receba o contato",
                descricao: "O paciente visualiza seu perfil e entra em contato diretamente pelo WhatsApp ou e-mail que você cadastrou. Sem intermediários.",
                icone: (
                  <svg className="w-7 h-7 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
              },
            ].map(({ numero, titulo, descricao, icone }) => (
              <div key={numero} className="group p-8 rounded-2xl border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg hover:shadow-[#5C8A3C]/5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-black text-[#5C8A3C]/15">{numero}</span>
                  <div className="w-14 h-14 bg-[#F5EDD0] rounded-2xl flex items-center justify-center group-hover:bg-[#5C8A3C]/10 transition-colors">
                    {icone}
                  </div>
                </div>
                <h3 className="font-semibold text-[#3B2A14] text-lg mb-3">{titulo}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NR-1 e Oportunidade ─────────────────────────────────────────── */}
      <section className="bg-[#EBF4E3] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#5C8A3C]/15 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                Uma oportunidade real
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A14] mb-5 leading-tight">
                A NR-1 abriu uma nova era para os profissionais de saúde
              </h2>
              <p className="text-stone-600 text-base leading-relaxed mb-4">
                A Norma Regulamentadora 1 (NR-1) reconhece oficialmente os riscos psicossociais
                ligados ao trabalho — como o burnout — como responsabilidade das empresas.
                Isso criou uma demanda crescente e urgente por profissionais de saúde mental,
                nutrição, fisioterapia e educação física no ambiente corporativo.
              </p>
              <p className="text-stone-600 text-base leading-relaxed mb-6">
                A plataforma Calma mente será divulgada nas maiores empresas do Brasil, apoiando
                tanto o funcionário em seu processo de recuperação quanto a empresa no cumprimento
                das exigências legais. Profissionais cadastrados estarão na linha de frente para
                receber esses pacientes.
              </p>
              <Button
                onClick={() => setCadastroAberto(true)}
                className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white px-8 py-4 rounded-2xl font-bold shadow-md shadow-[#5C8A3C]/20 transition-all hover:-translate-y-0.5"
              >
                Quero fazer parte
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  titulo: "Burnout reconhecido por lei",
                  descricao: "A NR-1 classifica o esgotamento profissional como risco ocupacional, obrigando empresas a agir.",
                },
                {
                  titulo: "Demanda nas empresas",
                  descricao: "RHs e gestores buscam profissionais de saúde para apoiar equipes e prevenir o afastamento.",
                },
                {
                  titulo: "Alcance nacional",
                  descricao: "A plataforma será apresentada a empresas de todo o Brasil, ampliando sua visibilidade além da sua cidade.",
                },
                {
                  titulo: "Conexão direta",
                  descricao: "Sem intermediários. O paciente encontra você e entra em contato pelo canal que você escolheu.",
                },
              ].map(({ titulo, descricao }) => (
                <div key={titulo} className="bg-white rounded-2xl p-5 border border-[#5C8A3C]/10">
                  <div className="w-8 h-8 rounded-lg bg-[#5C8A3C]/10 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-[#5C8A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#3B2A14] text-sm mb-1.5">{titulo}</h4>
                  <p className="text-stone-500 text-xs leading-relaxed">{descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sobre o Burnout ─────────────────────────────────────────────── */}
      <section className="bg-[#FFFDF0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#5C8A3C]/10 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Entenda o cenário
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A14] mb-4">
              Por que o burnout cria demanda para você
            </h2>
            <p className="text-stone-500 text-base max-w-2xl mx-auto">
              A Síndrome de Burnout afeta diretamente a saúde física e mental dos trabalhadores —
              e a recuperação exige uma equipe multidisciplinar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                ramo: "Psicólogo",
                cor: "bg-purple-50 border-purple-100",
                corTexto: "text-purple-700",
                descricao: "Trata o esgotamento emocional, ansiedade, desesperança e os padrões de pensamento que levam ao burnout.",
              },
              {
                ramo: "Nutricionista",
                cor: "bg-green-50 border-green-100",
                corTexto: "text-green-700",
                descricao: "Regula a alimentação afetada pelo estresse, melhora o humor via eixo intestino-cérebro e combate a inflamação.",
              },
              {
                ramo: "Personal Trainer",
                cor: "bg-orange-50 border-orange-100",
                corTexto: "text-orange-700",
                descricao: "Retoma a atividade física de forma gradual, libera endorfinas e reconstrói a disposição e o condicionamento.",
              },
              {
                ramo: "Fisioterapeuta",
                cor: "bg-teal-50 border-teal-100",
                corTexto: "text-teal-700",
                descricao: "Trata as dores musculares, tensões posturais e os distúrbios do sono causados pelo estresse crônico.",
              },
            ].map(({ ramo, cor, corTexto, descricao }) => (
              <div key={ramo} className={`rounded-2xl p-5 border ${cor}`}>
                <h4 className={`font-bold text-base mb-2 ${corTexto}`}>{ramo}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Planos ──────────────────────────────────────────────────────── */}
      <section id="planos" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#5C8A3C]/10 text-[#5C8A3C] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Planos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A14] mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-stone-500 text-base max-w-xl mx-auto">
              Valores acessíveis para profissionais de saúde que querem ampliar sua presença
              e receber novos pacientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANOS.map((plano) => (
              <div
                key={plano.nome}
                onClick={() =>
                    profissional
                      ? router.push(`/profissional/pagamento?plano=${encodeURIComponent(plano.nome)}`)
                      : setCadastroAberto(true)
                  }
                className={`relative rounded-2xl p-7 flex flex-col gap-5 border transition-all duration-300 cursor-pointer ${
                  plano.destaque
                    ? "border-[#5C8A3C] shadow-xl shadow-[#5C8A3C]/10 scale-105 hover:shadow-2xl hover:scale-[1.07]"
                    : "border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-lg"
                }`}
              >
                {plano.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5C8A3C] text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                    Mais popular
                  </span>
                )}

                <div>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">{plano.nome}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-[#3B2A14]">{plano.preco}</span>
                    <span className="text-stone-400 text-sm mb-1">{plano.periodo}</span>
                  </div>
                  {plano.porMes && (
                    <p className="text-xs text-[#5C8A3C] font-semibold mt-1">{plano.porMes}</p>
                  )}
                  <p className="text-stone-500 text-xs mt-2 leading-relaxed">{plano.descricao}</p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {plano.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                      <svg className="w-4 h-4 text-[#5C8A3C] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() =>
                    profissional
                      ? router.push(`/profissional/pagamento?plano=${encodeURIComponent(plano.nome)}`)
                      : setCadastroAberto(true)
                  }
                  className={`w-full rounded-xl font-semibold ${
                    plano.destaque
                      ? "bg-[#5C8A3C] hover:bg-[#3A6624] text-white shadow-md shadow-[#5C8A3C]/20"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  Começar agora
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-stone-400 mt-8">
            Pagamento integrado em breve. Após o cadastro, entraremos em contato para formalizar o plano escolhido.
          </p>
        </div>
      </section>

      {/* ─── Promo 3 meses ───────────────────────────────────────────────── */}
      <section className="bg-[#5C8A3C] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Cadastre-se até 15/06/2026 e ganhe 3 meses gratuitos
          </h2>
          <p className="text-white/75 text-base leading-relaxed mb-8">
            Profissionais que realizarem o cadastro até o dia 15 de junho de 2026 terão
            3 meses de plataforma sem nenhum custo. É a oportunidade de começar a receber
            pacientes agora e avaliar os resultados antes de qualquer investimento.
          </p>
          <Button
            onClick={() => setCadastroAberto(true)}
            className="bg-white hover:bg-white/90 text-[#5C8A3C] font-bold px-10 py-6 text-lg rounded-2xl shadow-lg transition-all hover:-translate-y-1"
          >
            Garantir minha vaga gratuita
          </Button>
          <p className="text-white/50 text-xs mt-4">Sem necessidade de cartão de crédito.</p>
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
            onClick={() => setCadastroAberto(true)}
            className="text-sm font-bold text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
          >
            Criar cadastro profissional
          </button>
        </div>
      </footer>

      {/* ─── Modais ──────────────────────────────────────────────────────── */}
      <CadastroProfissionalModal
        aberto={cadastroAberto}
        onFechar={() => setCadastroAberto(false)}
        onLoginClick={() => setLoginProfAberto(true)}
      />
      <LoginProfissionalModal
        aberto={loginProfAberto}
        onFechar={() => setLoginProfAberto(false)}
        onCadastrar={() => setCadastroAberto(true)}
      />
      <DashboardProfissionalModal
        aberto={dashboardAberto}
        onFechar={() => { setDashboardAberto(false); setDashboardEditando(false); }}
        iniciarEditando={dashboardEditando}
      />
      <CadastroPacienteModal
        aberto={pacienteAberto}
        onFechar={() => setPacienteAberto(false)}
        onLoginClick={() => setLoginAberto(true)}
      />
      <LoginModal
        aberto={loginAberto}
        onFechar={() => setLoginAberto(false)}
        onCadastrar={() => setPacienteAberto(true)}
      />
      <EditarPerfilPacienteModal
        aberto={editarPacienteAberto}
        onFechar={() => setEditarPacienteAberto(false)}
      />
      <AnaliseGratuitaModal
        aberto={analiseAberta}
        onFechar={() => setAnaliseAberta(false)}
        onLoginClick={() => setLoginAberto(true)}
        onCadastrarClick={() => setPacienteAberto(true)}
      />
    </main>
  );
}
