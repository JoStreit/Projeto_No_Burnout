"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AnaliseGratuitaModal from "@/components/AnaliseGratuitaModal";
import CadastroPacienteModal from "@/components/CadastroPacienteModal";
import CadastroProfissionalModal from "@/components/CadastroProfissionalModal";
import LoginModal from "@/components/LoginModal";
import BuscarProfissionaisModal from "@/components/BuscarProfissionaisModal";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { paciente, carregando, logout } = useAuth();

  const [analiseAberta, setAnaliseAberta] = useState(false);
  const [pacienteAberto, setPacienteAberto] = useState(false);
  const [profissionalAberto, setProfissionalAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [buscarAberto, setBuscarAberto] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">SaúdeConnect</span>
          </div>

          <div className="flex items-center gap-3">
            {carregando ? null : paciente ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBuscarAberto(true)}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Buscar Profissionais
                </Button>
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    Olá, <strong>{paciente.nome.split(" ")[0]}</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600"
                  >
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLoginAberto(true)}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Entrar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPacienteAberto(true)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Sou Paciente
                </Button>
                <Button
                  size="sm"
                  onClick={() => setProfissionalAberto(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Sou Profissional
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Plataforma de saúde personalizada
        </div>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl mx-auto">
          Encontre o profissional{" "}
          <span className="text-emerald-600">certo para você</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Responda algumas perguntas e descubra qual profissional de saúde é
          ideal para o seu perfil. Rápido, gratuito e sem compromisso.
        </p>

        <Button
          size="lg"
          onClick={() => setAnaliseAberta(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          Análise Gratuita
        </Button>

        <p className="text-sm text-gray-400 mt-4">
          Sem cadastro necessário · Apenas 5 perguntas
        </p>
      </section>

      {/* Cards de recursos */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🩺</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Análise Personalizada</h3>
            <p className="text-sm text-gray-500">
              Nosso algoritmo analisa seu perfil e recomenda o profissional mais
              adequado para suas necessidades.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Cadastro de Paciente</h3>
            <p className="text-sm text-gray-500">
              Crie seu perfil como paciente para acompanhar suas consultas e
              recomendações ao longo do tempo.
            </p>
            {!paciente && (
              <button
                onClick={() => setPacienteAberto(true)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Cadastrar agora →
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Para Profissionais</h3>
            <p className="text-sm text-gray-500">
              Cadastre-se como profissional de saúde e seja recomendado para
              pacientes que precisam do seu perfil.
            </p>
            <button
              onClick={() => setProfissionalAberto(true)}
              className="mt-4 text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              Quero me cadastrar →
            </button>
          </div>
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
      />
      <LoginModal
        aberto={loginAberto}
        onFechar={() => setLoginAberto(false)}
        onCadastrar={() => setPacienteAberto(true)}
      />
      <BuscarProfissionaisModal
        aberto={buscarAberto}
        onFechar={() => setBuscarAberto(false)}
      />
    </main>
  );
}
