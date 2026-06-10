import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AuthProvider from "@/components/AuthProvider";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://calmamente.com.br"),
  title: {
    default: "Calma mente — Encontre o profissional de saúde certo para você",
    template: "%s | Calma mente",
  },
  description:
    "Plataforma gratuita que conecta pacientes a psicólogos, nutricionistas, personal trainers e fisioterapeutas. Responda algumas perguntas e encontre o profissional ideal para o seu momento.",
  keywords: [
    "saúde mental", "burnout", "esgotamento profissional", "psicólogo",
    "nutricionista", "fisioterapeuta", "personal trainer", "saúde", "bem-estar",
  ],
  authors: [{ name: "Calma mente" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Calma mente",
    title: "Calma mente — Encontre o profissional de saúde certo para você",
    description:
      "Plataforma gratuita que conecta pacientes a psicólogos, nutricionistas, personal trainers e fisioterapeutas.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calma mente — Encontre o profissional de saúde certo para você",
    description:
      "Plataforma gratuita que conecta pacientes a psicólogos, nutricionistas, personal trainers e fisioterapeutas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <footer className="mt-auto border-t py-4 px-4" style={{ backgroundColor: "#faf7f4", borderColor: "#ede0d4" }}>
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs" style={{ color: "#7a6352" }}>
            <Link href="/politica-privacidade" className="hover:underline">Política de Privacidade</Link>
            <Link href="/termos-servico" className="hover:underline">Termos de Uso</Link>
            <span>© {new Date().getFullYear()} Calma Mente · LGPD (Lei 13.709/2018)</span>
          </div>
        </footer>
        <CookieBanner />
      </body>
    </html>
  );
}
