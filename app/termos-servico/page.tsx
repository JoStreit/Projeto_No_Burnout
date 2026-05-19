import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma Calma Mente.",
};

export default function TermosServicoPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#faf7f4" }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium hover:underline"
            style={{ color: "#4a6741" }}
          >
            ← Voltar ao início
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "#3c2010" }}>
          Termos de Uso
        </h1>
        <p className="text-sm mb-10" style={{ color: "#7a6352" }}>
          Última atualização: 19 de maio de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#3c2010" }}>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao criar uma conta e utilizar a plataforma <strong>Calma Mente</strong>, você
              declara ter lido, compreendido e concordado integralmente com estes Termos de Uso
              e com nossa{" "}
              <Link href="/politica-privacidade" className="underline" style={{ color: "#4a6741" }}>
                Política de Privacidade
              </Link>
              . Se não concordar com qualquer parte destes termos, não utilize a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              2. Descrição do Serviço
            </h2>
            <p>
              O Calma Mente é uma plataforma digital gratuita que conecta pacientes a profissionais
              de saúde — psicólogos, nutricionistas, fisioterapeutas e personal trainers. A
              plataforma facilita a descoberta de profissionais, mas não é prestadora de serviços
              de saúde e não substitui consultas, diagnósticos ou tratamentos médicos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              3. Cadastro e Responsabilidades do Usuário
            </h2>
            <ul className="ml-4 space-y-2 list-disc">
              <li>
                Você é responsável pela veracidade das informações fornecidas no cadastro. CPFs,
                e-mails e registros profissionais incorretos ou fraudulentos resultarão em
                cancelamento imediato da conta.
              </li>
              <li>
                Mantenha suas credenciais (e-mail e senha) em sigilo. Notifique-nos imediatamente
                em caso de uso não autorizado da sua conta.
              </li>
              <li>
                Profissionais são responsáveis pela validade de seus registros nos respectivos
                conselhos (CRP, CRN, CREF, CREFITO). A plataforma não verifica os registros
                profissionais em tempo real.
              </li>
              <li>
                É proibido criar contas falsas, automatizadas ou com dados de terceiros sem
                autorização.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              4. Tratamento de Dados Pessoais (LGPD)
            </h2>
            <p>
              Ao criar sua conta, você consente expressamente com o tratamento dos seus dados
              pessoais conforme descrito em nossa{" "}
              <Link href="/politica-privacidade" className="underline" style={{ color: "#4a6741" }}>
                Política de Privacidade
              </Link>
              , em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
            </p>
            <p className="mt-3">
              Você pode, a qualquer momento, exportar seus dados ou solicitar a exclusão da sua
              conta diretamente pelas configurações do seu perfil. A revogação do consentimento
              implica a exclusão da conta e dos dados associados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              5. Conteúdo Proibido
            </h2>
            <p className="mb-2">É estritamente proibido:</p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Publicar informações falsas, enganosas ou prejudiciais</li>
              <li>Praticar assédio, discriminação ou discurso de ódio</li>
              <li>Utilizar a plataforma para fins comerciais não autorizados</li>
              <li>Tentar acessar contas ou dados de outros usuários</li>
              <li>Realizar ataques automatizados, scraping ou sobrecarga do sistema</li>
              <li>Violar direitos de propriedade intelectual de terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              6. Exclusão de Conta
            </h2>
            <p>
              Você pode solicitar a exclusão da sua conta a qualquer momento pelo painel do seu
              perfil. A exclusão é irreversível e resultará na remoção de todos os seus dados
              pessoais, conforme os prazos de retenção descritos na Política de Privacidade.
            </p>
            <p className="mt-3">
              Reservamo-nos o direito de suspender ou excluir contas que violem estes Termos,
              sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              7. Limitação de Responsabilidade
            </h2>
            <p>
              O Calma Mente atua como intermediário entre pacientes e profissionais. Não nos
              responsabilizamos pela qualidade dos serviços prestados pelos profissionais
              cadastrados, por consultas realizadas fora da plataforma, ou por quaisquer danos
              decorrentes do uso das informações disponíveis na plataforma.
            </p>
            <p className="mt-3">
              A plataforma é fornecida &quot;como está&quot;, sem garantias de disponibilidade
              contínua ou ausência de erros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              8. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo da plataforma — incluindo código, design, textos e logotipos — é
              de propriedade do Calma Mente ou de seus licenciadores e protegido por leis de
              direito autoral. É proibida a reprodução sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              9. Alterações nos Termos
            </h2>
            <p>
              Podemos atualizar estes Termos periodicamente. Mudanças relevantes serão comunicadas
              com destaque na plataforma. O uso continuado após a publicação das alterações
              implica aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              10. Lei Aplicável e Foro
            </h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito
              o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes
              deste instrumento, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              11. Contato
            </h2>
            <p>
              Para dúvidas sobre estes Termos, entre em contato pelo e-mail{" "}
              <strong>contato@calmamente.com.br</strong>.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="hover:underline" style={{ color: "#4a6741" }}>
            Página inicial
          </Link>
          <Link href="/politica-privacidade" className="hover:underline" style={{ color: "#4a6741" }}>
            Política de Privacidade
          </Link>
        </div>
      </div>
    </main>
  );
}
