import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Profissionais de Saúde",
  description:
    "Cadastre-se na plataforma Calma mente e conecte-se com pacientes que precisam do seu perfil. Psicólogos, nutricionistas, fisioterapeutas e personal trainers.",
  robots: { index: true, follow: true },
};

export default function ProfissionalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
