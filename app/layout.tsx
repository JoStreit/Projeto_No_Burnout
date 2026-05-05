import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

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
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
