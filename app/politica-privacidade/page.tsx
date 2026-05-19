import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como tratamos seus dados pessoais em conformidade com a LGPD (Lei 13.709/2018).",
};

export default function PoliticaPrivacidadePage() {
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
          Política de Privacidade
        </h1>
        <p className="text-sm mb-10" style={{ color: "#7a6352" }}>
          Última atualização: 19 de maio de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#3c2010" }}>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              1. Controlador de Dados
            </h2>
            <p>
              O <strong>Calma Mente</strong> é responsável pelo tratamento dos seus dados pessoais.
              Para dúvidas, solicitações de direitos ou contato com nosso Encarregado de Proteção de
              Dados (DPO), utilize:
            </p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li><strong>E-mail:</strong> privacidade@calmamente.com.br</li>
              <li><strong>Plataforma:</strong> calmamente.com.br</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              2. Dados Pessoais Coletados
            </h2>
            <p className="mb-3">
              Coletamos apenas os dados necessários para o funcionamento da plataforma:
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Pacientes:</p>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Nome completo</li>
                  <li>CPF (armazenado de forma protegida)</li>
                  <li>Endereço de e-mail</li>
                  <li>Estado e cidade de residência</li>
                  <li>Preferências de busca por profissionais</li>
                  <li>Senha (armazenada exclusivamente como hash bcrypt — nunca em texto plano)</li>
                  <li>Data e hora do cadastro e do aceite desta política</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Profissionais de Saúde:</p>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Nome completo</li>
                  <li>CPF (armazenado de forma protegida)</li>
                  <li>Número de registro no conselho profissional (CRP, CRN, CREF, CREFITO)</li>
                  <li>Ramo de atuação</li>
                  <li>Estado e cidade de atuação</li>
                  <li>Endereço de e-mail</li>
                  <li>Telefone (opcional)</li>
                  <li>Foto de perfil (opcional)</li>
                  <li>Modalidades de atendimento</li>
                  <li>Senha (armazenada exclusivamente como hash bcrypt)</li>
                  <li>Data e hora do cadastro e do aceite desta política</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Dados de Navegação:</p>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>Registros de visitas à plataforma (tipo de usuário e timestamp, sem identificação pessoal)</li>
                  <li>Respostas anônimas ao questionário de autoavaliação de bem-estar</li>
                  <li>Logs de segurança (tentativas de login malsucedidas, IPs, para proteção contra ataques)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              3. Base Legal para o Tratamento (Art. 7º e 11 da LGPD)
            </h2>
            <ul className="ml-4 space-y-2 list-disc">
              <li>
                <strong>Consentimento (Art. 7º, I):</strong> Dados coletados no cadastro mediante
                aceite expresso desta Política e dos Termos de Uso.
              </li>
              <li>
                <strong>Execução de contrato (Art. 7º, V):</strong> Dados necessários para
                prestação do serviço de conexão entre pacientes e profissionais.
              </li>
              <li>
                <strong>Legítimo interesse (Art. 7º, IX):</strong> Logs de segurança para prevenção
                de fraudes e proteção da plataforma.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              4. Finalidade do Tratamento
            </h2>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Criação e gestão de contas de usuário</li>
              <li>Conexão entre pacientes e profissionais de saúde</li>
              <li>Envio de e-mail para recuperação de senha (mediante solicitação)</li>
              <li>Geração de estatísticas de uso agregadas e anônimas</li>
              <li>Segurança e prevenção de acessos não autorizados</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              5. Compartilhamento de Dados
            </h2>
            <p className="mb-3">
              Não vendemos, alugamos ou comercializamos seus dados. O compartilhamento ocorre
              apenas nas seguintes situações:
            </p>
            <ul className="ml-4 space-y-2 list-disc">
              <li>
                <strong>Serviço de e-mail (SMTP):</strong> Nome e endereço de e-mail são
                transmitidos ao provedor SMTP exclusivamente para envio de e-mails de recuperação
                de senha, mediante solicitação do titular.
              </li>
              <li>
                <strong>API do IBGE:</strong> O código do estado (UF) é enviado à API pública do
                IBGE para listagem de municípios. Nenhum dado pessoal é transmitido.
              </li>
              <li>
                <strong>Autoridades públicas:</strong> Podemos compartilhar dados quando exigido
                por lei, ordem judicial ou autoridade competente.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              6. Retenção de Dados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr style={{ backgroundColor: "#ede0d4" }}>
                    <th className="border border-stone-300 px-3 py-2 text-left">Categoria de Dado</th>
                    <th className="border border-stone-300 px-3 py-2 text-left">Período de Retenção</th>
                    <th className="border border-stone-300 px-3 py-2 text-left">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-stone-300 px-3 py-2">Dados de conta (paciente/profissional)</td>
                    <td className="border border-stone-300 px-3 py-2">Até solicitação de exclusão</td>
                    <td className="border border-stone-300 px-3 py-2">Manutenção do serviço</td>
                  </tr>
                  <tr style={{ backgroundColor: "#faf7f4" }}>
                    <td className="border border-stone-300 px-3 py-2">Registros de visitas</td>
                    <td className="border border-stone-300 px-3 py-2">90 dias</td>
                    <td className="border border-stone-300 px-3 py-2">Estatísticas de uso</td>
                  </tr>
                  <tr>
                    <td className="border border-stone-300 px-3 py-2">Respostas de questionários</td>
                    <td className="border border-stone-300 px-3 py-2">30 dias</td>
                    <td className="border border-stone-300 px-3 py-2">Análise anônima de bem-estar</td>
                  </tr>
                  <tr style={{ backgroundColor: "#faf7f4" }}>
                    <td className="border border-stone-300 px-3 py-2">Logs de segurança</td>
                    <td className="border border-stone-300 px-3 py-2">180 dias</td>
                    <td className="border border-stone-300 px-3 py-2">Segurança e prevenção de fraudes</td>
                  </tr>
                  <tr>
                    <td className="border border-stone-300 px-3 py-2">Tokens de redefinição de senha</td>
                    <td className="border border-stone-300 px-3 py-2">1 hora (expiração automática)</td>
                    <td className="border border-stone-300 px-3 py-2">Segurança no reset de senha</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              7. Seus Direitos como Titular (Art. 17 a 22 da LGPD)
            </h2>
            <p className="mb-3">
              Você tem os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="ml-4 space-y-2 list-disc">
              <li><strong>Confirmação e acesso (Art. 18, I e II):</strong> Confirmar a existência de tratamento e acessar seus dados.</li>
              <li><strong>Correção (Art. 18, III):</strong> Corrigir dados incompletos, inexatos ou desatualizados diretamente no seu perfil.</li>
              <li><strong>Anonimização, bloqueio ou eliminação (Art. 18, IV):</strong> Solicitar a eliminação de dados desnecessários ou excessivos.</li>
              <li><strong>Portabilidade (Art. 18, V):</strong> Exportar seus dados em formato JSON estruturado a qualquer momento pelo seu perfil.</li>
              <li><strong>Revogação do consentimento (Art. 18, IX):</strong> Revogar o consentimento a qualquer tempo, solicitando a exclusão da conta.</li>
              <li><strong>Eliminação (Art. 18, VI):</strong> Solicitar a exclusão definitiva dos seus dados pessoais.</li>
              <li><strong>Informação sobre compartilhamento (Art. 18, VII):</strong> Saber com quais entidades compartilhamos seus dados.</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos, acesse as configurações do seu perfil ou entre em contato
              pelo e-mail <strong>privacidade@calmamente.com.br</strong>. Responderemos em até
              15 dias corridos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              8. Segurança dos Dados
            </h2>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Senhas armazenadas exclusivamente como hash bcrypt (fator de custo 10)</li>
              <li>Cookies de sessão com flags HttpOnly, SameSite=Strict e Secure em produção</li>
              <li>Proteção contra ataques de temporização (timing attacks) na verificação de credenciais</li>
              <li>Rate limiting nas rotas de autenticação e cadastro</li>
              <li>CPF mascarado nas respostas de API (formato: XXX.***.***-XX)</li>
              <li>Tokens de sessão com validade de 7 dias e mecanismo de revogação no logout</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              9. Cookies e Armazenamento Local
            </h2>
            <p className="mb-3">Utilizamos os seguintes mecanismos de armazenamento:</p>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Cookies (essenciais):</p>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li><code className="bg-stone-100 px-1 rounded">session</code> — Sessão autenticada do paciente (7 dias)</li>
                  <li><code className="bg-stone-100 px-1 rounded">session_prof</code> — Sessão autenticada do profissional (7 dias)</li>
                </ul>
                <p className="mt-1 text-xs" style={{ color: "#7a6352" }}>
                  Esses cookies são estritamente necessários para o funcionamento do sistema de login.
                </p>
              </div>
              <div>
                <p className="font-medium">localStorage:</p>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li><code className="bg-stone-100 px-1 rounded">saude_mensagem_diaria_v3</code> — Controle de mensagens de bem-estar já exibidas (histórico local, sem envio ao servidor)</li>
                  <li><code className="bg-stone-100 px-1 rounded">lgpd-consent</code> — Registro do aceite desta política de privacidade</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">sessionStorage:</p>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li><code className="bg-stone-100 px-1 rounded">visitaRegistrada</code> — Flag temporário para evitar múltiplos registros de visita por sessão</li>
                </ul>
              </div>
            </div>
            <p className="mt-3">
              Não utilizamos cookies de rastreamento, analytics de terceiros (Google Analytics,
              Facebook Pixel etc.) ou qualquer tecnologia de publicidade comportamental.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              10. Incidentes de Segurança
            </h2>
            <p>
              Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos
              titulares, notificaremos a Autoridade Nacional de Proteção de Dados (ANPD) e os
              titulares afetados no prazo razoável, conforme exige o Art. 48 da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              11. Alterações nesta Política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente. Alterações significativas serão
              comunicadas com destaque na plataforma. A data da última atualização sempre estará
              indicada no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#4a6741" }}>
              12. Contato e DPO
            </h2>
            <p>
              Para exercer seus direitos, apresentar dúvidas ou reclamações relacionadas ao
              tratamento dos seus dados pessoais:
            </p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li><strong>E-mail do DPO:</strong> privacidade@calmamente.com.br</li>
              <li><strong>ANPD:</strong> <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#4a6741" }}>www.gov.br/anpd</a></li>
            </ul>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="hover:underline" style={{ color: "#4a6741" }}>
            Página inicial
          </Link>
          <Link href="/termos-servico" className="hover:underline" style={{ color: "#4a6741" }}>
            Termos de Uso
          </Link>
        </div>
      </div>
    </main>
  );
}
