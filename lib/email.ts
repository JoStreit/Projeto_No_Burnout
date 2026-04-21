import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function escapeHtml(str: string): string {
  return str.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

export async function enviarEmailResetSenha(
  para: string,
  nome: string,
  link: string
) {
  const nomeSafe = escapeHtml(nome);
  const linkSafe = encodeURI(link);
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "Calma mente <noreply@saudeconnect.com>",
    to: para,
    subject: "Redefinição de senha — Calma mente",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px">
        <h2 style="color:#5C8A3C;margin-bottom:8px">Redefinição de senha</h2>
        <p style="color:#374151">Olá, <strong>${nomeSafe}</strong>.</p>
        <p style="color:#374151">Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Calma mente</strong>.</p>
        <p style="color:#374151">Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>1 hora</strong>.</p>
        <a href="${linkSafe}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#5C8A3C;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Redefinir senha
        </a>
        <p style="color:#9ca3af;font-size:13px">Se você não solicitou a redefinição, ignore este e-mail. Sua senha permanece a mesma.</p>
        <p style="color:#9ca3af;font-size:12px">Link alternativo: <a href="${linkSafe}" style="color:#5C8A3C">${linkSafe}</a></p>
      </div>
    `,
  });
}
