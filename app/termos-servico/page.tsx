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
          Última atualização: 10 de junho de 2026
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
              2. Natureza do Serviço — Plataforma de Intermediação
            </h2>
            <p className="mb-3">
              O <strong>Calma Mente</strong> é uma plataforma digital de intermediação que
              conecta pacientes a profissionais de saúde autônomos e independentes —
              psicólogos, nutricionistas, fisioterapeutas e personal trainers.
            </p>
            <p className="mb-3">
              A Calma Mente <strong>não presta serviços de saúde</strong>, não é empregadora
              nem sócia dos profissionais cadastrados e não estabelece vínculo empregatício,
              societário ou de qualquer outra natureza com esses profissionais. A relação
              contratual pelo atendimento ocorre exclusivamente entre o paciente e o
              profissional escolhido.
            </p>
            <p>
              A plataforma não substitui consultas médicas, diagnósticos ou tratamentos
              profissionais, e não deve ser utilizada em situações de emergência.
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
              4. Responsabilidade dos Profissionais Cadastrados
            </h2>
            <p className="mb-3">
              Ao se cadastrar na plataforma, o profissional declara, expressamente e sob sua{" "}
              <strong>inteira e exclusiva responsabilidade</strong>, que:
            </p>
            <ul className="ml-4 space-y-2 list-disc">
              <li>
                Todas as informações fornecidas — incluindo nome completo, CPF, número de
                registro profissional e ramo de atuação — são verdadeiras, atualizadas e de sua
                titularidade.
              </li>
              <li>
                Possui registro ativo e regular no conselho profissional competente (CRP, CREFITO,
                CRN ou CREF) e está habilitado ao exercício da profissão declarada.
              </li>
              <li>
                Atua em conformidade com as normas éticas e legais de sua categoria profissional.
              </li>
            </ul>
            <p className="mt-3">
              O cadastro com dados falsos ou de terceiros sem autorização constitui crime de
              falsidade ideológica (art. 299 do Código Penal) e crime de falsidade de documento
              (art. 297 do Código Penal), sujeitando o infrator às sanções civis e criminais
              cabíveis, independentemente das medidas administrativas adotadas pela plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              5. Isenção de Responsabilidade por Fraude ou Falsidade
            </h2>
            <p className="mb-3">
              A Calma Mente <strong>não realiza verificação prévia ou em tempo real</strong> da
              autenticidade dos registros profissionais junto aos conselhos competentes. As
              informações apresentadas nos perfis são de responsabilidade exclusiva de cada
              profissional cadastrado.
            </p>
            <p className="mb-3">
              Em razão disso, <strong>a Calma Mente não se responsabiliza</strong> por danos
              decorrentes de:
            </p>
            <ul className="ml-4 space-y-2 list-disc">
              <li>
                Cadastros realizados com dados falsos, fraudulentos ou de terceiros.
              </li>
              <li>
                Profissionais que não possuam registro válido no conselho declarado.
              </li>
              <li>
                Atendimentos prestados por pessoa não habilitada ao exercício da profissão
                informada.
              </li>
              <li>
                Danos à saúde, morais ou materiais decorrentes de atendimentos realizados com
                base em perfis fraudulentos.
              </li>
            </ul>
            <p className="mt-3">
              Recomendamos fortemente que pacientes verifiquem a validade do registro profissional
              diretamente no site do conselho competente antes de iniciar qualquer atendimento:
            </p>
            <ul className="ml-4 mt-2 space-y-1 list-disc">
              <li>
                <strong>Psicólogo (CRP):</strong>{" "}
                <a href="https://e-psi.cfp.org.br" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#4a6741" }}>
                  e-psi.cfp.org.br
                </a>
              </li>
              <li>
                <strong>Fisioterapeuta (CREFITO):</strong>{" "}
                <a href="https://consulta.coffito.gov.br" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#4a6741" }}>
                  consulta.coffito.gov.br
                </a>
              </li>
              <li>
                <strong>Nutricionista (CRN):</strong>{" "}
                <a href="https://www.cfn.org.br" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#4a6741" }}>
                  cfn.org.br
                </a>
              </li>
              <li>
                <strong>Personal Trainer (CREF):</strong>{" "}
                <a href="https://www.confef.org.br" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#4a6741" }}>
                  confef.org.br
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              6. Canal de Denúncia
            </h2>
            <p className="mb-3">
              Caso você identifique um perfil fraudulento, conduta inadequada ou qualquer
              violação destes Termos, reporte imediatamente pelo e-mail{" "}
              <strong>contato@calmamentes.com.br</strong>.
            </p>
            <p>
              A Calma Mente se reserva o direito de suspender ou excluir perfis mediante
              denúncia fundamentada, sem prejuízo das medidas legais cabíveis contra o infrator.
              A plataforma colaborará com autoridades competentes em investigações relacionadas
              a fraudes ou crimes praticados por meio do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              7. Tratamento de Dados Pessoais (LGPD)
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
              8. Conteúdo Proibido
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
              9. Exclusão de Conta
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
              10. Limitação de Responsabilidade
            </h2>
            <p className="mb-3">
              A Calma Mente atua exclusivamente como plataforma de intermediação e não se
              responsabiliza por:
            </p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>A qualidade, adequação ou resultado dos serviços prestados pelos profissionais</li>
              <li>Consultas, atendimentos ou acordos realizados fora da plataforma</li>
              <li>Danos diretos, indiretos ou consequentes decorrentes da relação entre paciente e profissional</li>
              <li>Informações falsas fornecidas por profissionais ou pacientes no cadastro</li>
              <li>Indisponibilidade temporária da plataforma por manutenção ou falhas técnicas</li>
            </ul>
            <p className="mt-3">
              A plataforma é fornecida &quot;como está&quot;, sem garantias de disponibilidade
              contínua ou ausência de erros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              11. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo da plataforma — incluindo código, design, textos e logotipos — é
              de propriedade do Calma Mente ou de seus licenciadores e protegido por leis de
              direito autoral. É proibida a reprodução sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              12. Alterações nos Termos
            </h2>
            <p>
              Podemos atualizar estes Termos periodicamente. Mudanças relevantes serão comunicadas
              com destaque na plataforma. O uso continuado após a publicação das alterações
              implica aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              13. Lei Aplicável e Foro
            </h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil, especialmente
              o Marco Civil da Internet (Lei 12.965/2014) e a Lei Geral de Proteção de Dados
              (Lei 13.709/2018). Fica eleito o foro da comarca de São Paulo/SP para dirimir
              quaisquer controvérsias decorrentes deste instrumento, com renúncia a qualquer
              outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              14. Contato
            </h2>
            <p>
              Para dúvidas sobre estes Termos, denúncias ou solicitações relacionadas aos seus
              dados, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@calmamentes.com.br" className="underline" style={{ color: "#4a6741" }}>
                contato@calmamentes.com.br
              </a>
              .
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
