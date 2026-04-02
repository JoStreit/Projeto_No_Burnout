"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnaliseGratuitaModal from "@/components/AnaliseGratuitaModal";
import CadastroPacienteModal from "@/components/CadastroPacienteModal";
import CadastroProfissionalModal from "@/components/CadastroProfissionalModal";
import LoginModal from "@/components/LoginModal";
import LoginProfissionalModal from "@/components/LoginProfissionalModal";
import BuscarProfissionaisModal from "@/components/BuscarProfissionaisModal";
import DashboardProfissionalModal from "@/components/DashboardProfissionalModal";
import EditarPerfilPacienteModal from "@/components/EditarPerfilPacienteModal";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { paciente, carregandoPaciente, logoutPaciente, profissional, carregandoProfissional, logoutProfissional } = useAuth();

  const [analiseAberta, setAnaliseAberta] = useState(false);
  const [pacienteAberto, setPacienteAberto] = useState(false);
  const [profissionalAberto, setProfissionalAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [loginProfAberto, setLoginProfAberto] = useState(false);
  const [buscarAberto, setBuscarAberto] = useState(false);
  const [dashboardAberto, setDashboardAberto] = useState(false);
  const [editarPacienteAberto, setEditarPacienteAberto] = useState(false);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 overflow-hidden">
      {/* Marca d'água */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/logo.png"
          alt=""
          width={1200}
          height={1200}
          className="opacity-[0.125] object-contain"
        />
      </div>

      {/* Navbar */}
      <nav className="border-b border-green-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="SaúdeConnect" width={120} height={120} className="object-contain rounded-xl" />
            <span className="font-bold text-green-900 text-lg">SaúdeConnect</span>
          </div>

          <div className="flex items-center gap-0">
            {/* ─── Área do Paciente — oculta quando profissional está logado ─── */}
            {!carregandoPaciente && !profissional && (
              <div className="flex items-center gap-3 pr-4 border-r border-green-100">
                {paciente ? (
                  <>
                    {/* Avatar com inicial */}
                    <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {paciente.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Nome + label empilhados */}
                    <div className="hidden sm:flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-green-900">
                        {paciente.nome.split(" ")[0]}
                      </span>
                      <span className="text-xs text-green-800 font-medium">Área do Paciente</span>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-1 ml-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logoutPaciente}
                        className="text-gray-400 hover:text-red-500 px-2"
                      >
                        Sair
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLoginAberto(true)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Sou Paciente
                    </Button>
                    <span className="text-[10px] text-green-400 mt-0.5">Área do Paciente</span>
                  </div>
                )}
              </div>
            )}

            {/* ─── Área do Profissional — oculta quando paciente está logado ─── */}
            {!carregandoProfissional && !paciente && (
              <div className="flex items-center gap-3 pl-4">
                {profissional ? (
                  <>
                    {/* Avatar com inicial */}
                    <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {profissional.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Nome + label empilhados */}
                    <div className="hidden sm:flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-green-900">
                        {profissional.nome.split(" ")[0]}
                      </span>
                      <span className="text-xs text-green-800 font-medium">Área do Profissional</span>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-1 ml-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDashboardAberto(true)}
                        className="border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Meu Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logoutProfissional}
                        className="text-gray-400 hover:text-red-500 px-2"
                      >
                        Sair
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-end">
                    <Button
                      size="sm"
                      onClick={() => setLoginProfAberto(true)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Sou Profissional
                    </Button>
                    <span className="text-xs text-green-800 mt-0.5 font-medium">Área do Profissional</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-[15] max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Plataforma de saúde personalizada
        </div>

        <h1 className="text-5xl font-bold text-green-950 leading-tight mb-6 max-w-3xl mx-auto">
          Encontre o profissional{" "}
          <span className="text-green-600">certo para você</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Responda algumas perguntas e descubra qual profissional de saúde é
          ideal para o seu perfil. Rápido, gratuito e sem compromisso.
        </p>

        <Button
          size="lg"
          onClick={() => setAnaliseAberta(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          Análise Gratuita
        </Button>

        <p className="text-sm text-gray-400 mt-4">
          Sem cadastro necessário · Apenas 5 perguntas
        </p>
      </section>

      {/* Cards */}
      <section className="relative z-[15] max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🩺</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Análise Personalizada</h3>
            <p className="text-sm text-gray-500">
              {profissional
                ? "Nosso algoritmo analisa o perfil do usuário e recomenda o profissional adequado para a necessidade dele — e este profissional pode ser você! Mantenha seu perfil ativo."
                : "Nosso algoritmo analisa seu perfil e recomenda o profissional mais adequado para suas necessidades."}
            </p>
          </div>

          {profissional ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Editar Perfil</h3>
              <p className="text-sm text-gray-500">
                Atualize suas informações de cadastro, modalidade de atendimento e mantenha seu perfil sempre em dia.
              </p>
              <button onClick={() => setDashboardAberto(true)} className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium">
                Abrir perfil →
              </button>
            </div>
          ) : paciente ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Editar Perfil</h3>
              <p className="text-sm text-gray-500">
                Atualize suas informações de cadastro, preferência de busca e mantenha seu perfil sempre em dia.
              </p>
              <button onClick={() => setEditarPacienteAberto(true)} className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
                ✏️ Editar perfil →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Cadastro de Paciente</h3>
              <p className="text-sm text-gray-500">
                Crie seu perfil gratuitamente para ter as melhores recomendações de profissionais.
              </p>
              <button onClick={() => setPacienteAberto(true)} className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
                Cadastrar agora →
              </button>
            </div>
          )}

          {paciente && !profissional ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Buscar Profissionais</h3>
              <p className="text-sm text-gray-500">
                Encontre profissionais de saúde de acordo com sua preferência de busca e necessidades.
              </p>
              <button onClick={() => setBuscarAberto(true)} className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
                🔍 Buscar profissionais →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Para Profissionais</h3>
              <p className="text-sm text-gray-500">
                {profissional
                  ? "Mesmo com perfil profissional você pode cadastrar seu perfil de paciente e encontrar um profissional para você."
                  : "Cadastre-se como profissional de saúde e seja recomendado para pacientes que precisam do seu perfil."}
              </p>
              {!profissional && (
                <button onClick={() => setProfissionalAberto(true)} className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Quero me cadastrar →
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modais */}
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
