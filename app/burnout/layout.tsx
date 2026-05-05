import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entenda o Burnout",
  description:
    "Saiba o que é a Síndrome de Burnout, seus principais sintomas, como identificar e os tratamentos disponíveis: terapia, atividade física, fisioterapia e alimentação equilibrada.",
  keywords: [
    "burnout", "síndrome de burnout", "esgotamento profissional",
    "sintomas de burnout", "tratamento burnout", "o que é burnout",
    "burnout no trabalho", "como tratar burnout",
  ],
  openGraph: {
    title: "Entenda o Burnout | Calma mente",
    description:
      "Saiba o que é a Síndrome de Burnout, seus principais sintomas, como identificar e os tratamentos disponíveis.",
    url: "/burnout",
  },
  twitter: {
    title: "Entenda o Burnout | Calma mente",
    description:
      "Saiba o que é a Síndrome de Burnout, seus principais sintomas, como identificar e os tratamentos disponíveis.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Entenda o Burnout",
  description:
    "Informações sobre a Síndrome de Burnout: definição, sintomas, diagnóstico e abordagens terapêuticas.",
  about: {
    "@type": "MedicalCondition",
    name: "Síndrome de Burnout",
    alternateName: "Síndrome do Esgotamento Profissional",
    description:
      "Distúrbio emocional caracterizado por exaustão extrema causada pelo estresse crônico no trabalho.",
  },
  audience: { "@type": "Patient" },
  inLanguage: "pt-BR",
};

export default function BurnoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
