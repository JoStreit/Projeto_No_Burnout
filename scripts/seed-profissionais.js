const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "../data/db.json");
const SENHA = "Senha@123";
const VIGENCIA_FIM = "2026-07-10T23:59:59.000Z";
const VIGENCIA_INICIO = "2026-06-09T10:00:00.000Z";
const CRIADO_EM = "2026-06-09T10:00:00.000Z";
const CONSENTIMENTO = "2026-06-09T10:00:00.000Z";

console.log("Gerando hash de senha...");
const senhaHash = bcrypt.hashSync(SENHA, 10);
console.log("Hash gerado.");

const profissionais = [
  // ── Canoas / RS (10) ─────────────────────────────────────────────────────
  {
    nome: "Ana Paula Silva",
    cpf: "11122233301",
    carteirinha: "06/112233",
    ramo: "Psicólogo",
    estado: "RS", cidade: "Canoas",
    email: "ana.silva.psi@email.com",
    telefone: "(51) 99111-2233",
    atendimento: ["Presencial"],
    planosAtendidos: ["Unimed", "Bradesco Saúde"],
  },
  {
    nome: "Carlos Eduardo Mendes",
    cpf: "22233344402",
    carteirinha: "2/223344-F",
    ramo: "Fisioterapeuta",
    estado: "RS", cidade: "Canoas",
    email: "carlos.mendes.fisio@email.com",
    telefone: "(51) 98222-3344",
    atendimento: ["Presencial", "Online"],
    planosAtendidos: ["Amil"],
  },
  {
    nome: "Beatriz Santos",
    cpf: "33344455503",
    carteirinha: "3 33445",
    ramo: "Nutricionista",
    estado: "RS", cidade: "Canoas",
    email: "beatriz.santos.nutri@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },
  {
    nome: "Rafael Lima",
    cpf: "44455566604",
    carteirinha: "044455-G/RS",
    ramo: "Personal Trainer",
    estado: "RS", cidade: "Canoas",
    email: "rafael.lima.pt@email.com",
    telefone: "(51) 97444-5566",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },
  {
    nome: "Mariana Costa",
    cpf: "55566677705",
    carteirinha: "06/556677",
    ramo: "Psicólogo",
    estado: "RS", cidade: "Canoas",
    email: "mariana.costa.psi@email.com",
    atendimento: ["Online"],
    planosAtendidos: ["Unimed"],
  },
  {
    nome: "Fernando Oliveira",
    cpf: "66677788806",
    carteirinha: "2/667788-F",
    ramo: "Fisioterapeuta",
    estado: "RS", cidade: "Canoas",
    email: "fernando.oliveira.fisio@email.com",
    telefone: "(51) 99666-7788",
    atendimento: ["Presencial"],
    planosAtendidos: ["Porto Saúde", "SulAmérica"],
  },
  {
    nome: "Juliana Rocha",
    cpf: "77788899907",
    carteirinha: "3 77889",
    ramo: "Nutricionista",
    estado: "RS", cidade: "Canoas",
    email: "juliana.rocha.nutri@email.com",
    atendimento: ["Presencial", "Online"],
    planosAtendidos: ["Bradesco Saúde"],
  },
  {
    nome: "Diego Martins",
    cpf: "88899900008",
    carteirinha: "088900-G/RS",
    ramo: "Personal Trainer",
    estado: "RS", cidade: "Canoas",
    email: "diego.martins.pt@email.com",
    telefone: "(51) 98889-9000",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },
  {
    nome: "Patrícia Gomes",
    cpf: "99900011109",
    carteirinha: "06/990011",
    ramo: "Psicólogo",
    estado: "RS", cidade: "Canoas",
    email: "patricia.gomes.psi@email.com",
    atendimento: ["Online"],
    planosAtendidos: ["Amil", "Unimed"],
  },
  {
    nome: "Lucas Ferreira",
    cpf: "10011122210",
    carteirinha: "2/100112-F",
    ramo: "Fisioterapeuta",
    estado: "RS", cidade: "Canoas",
    email: "lucas.ferreira.fisio@email.com",
    telefone: "(51) 97100-1122",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },

  // ── Outras cidades do RS (4) ──────────────────────────────────────────────
  {
    nome: "Camila Dias",
    cpf: "11122211111",
    carteirinha: "3 11221",
    ramo: "Nutricionista",
    estado: "RS", cidade: "Porto Alegre",
    email: "camila.dias.nutri@email.com",
    telefone: "(51) 99112-2111",
    atendimento: ["Presencial"],
    planosAtendidos: ["Unimed"],
  },
  {
    nome: "Paulo Souza",
    cpf: "22233322212",
    carteirinha: "022332-G/RS",
    ramo: "Personal Trainer",
    estado: "RS", cidade: "Novo Hamburgo",
    email: "paulo.souza.pt@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },
  {
    nome: "Amanda Ribeiro",
    cpf: "33344433313",
    carteirinha: "06/334443",
    ramo: "Psicólogo",
    estado: "RS", cidade: "Caxias do Sul",
    email: "amanda.ribeiro.psi@email.com",
    telefone: "(54) 99334-4333",
    atendimento: ["Online"],
    planosAtendidos: ["SulAmérica"],
  },
  {
    nome: "Thiago Nunes",
    cpf: "44455544414",
    carteirinha: "2/445554-F",
    ramo: "Fisioterapeuta",
    estado: "RS", cidade: "São Leopoldo",
    email: "thiago.nunes.fisio@email.com",
    atendimento: ["Presencial", "Online"],
    planosAtendidos: ["Bradesco Saúde"],
  },

  // ── Restante do Brasil (16) ───────────────────────────────────────────────
  {
    nome: "Isabela Freitas",
    cpf: "55566655515",
    carteirinha: "06/556665",
    ramo: "Psicólogo",
    estado: "SP", cidade: "São Paulo",
    email: "isabela.freitas.psi@email.com",
    telefone: "(11) 99556-6555",
    atendimento: ["Online"],
    planosAtendidos: ["Amil", "Bradesco Saúde"],
  },
  {
    nome: "Roberto Alves",
    cpf: "66677766616",
    carteirinha: "2/667776-F",
    ramo: "Fisioterapeuta",
    estado: "RJ", cidade: "Rio de Janeiro",
    email: "roberto.alves.fisio@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: ["Unimed"],
  },
  {
    nome: "Fernanda Carvalho",
    cpf: "77788877717",
    carteirinha: "3 77889",
    ramo: "Nutricionista",
    estado: "PR", cidade: "Curitiba",
    email: "fernanda.carvalho.nutri@email.com",
    telefone: "(41) 99778-8777",
    atendimento: ["Online"],
    planosAtendidos: ["Porto Saúde"],
  },
  {
    nome: "Mateus Pereira",
    cpf: "88899988818",
    carteirinha: "088998-G/MG",
    ramo: "Personal Trainer",
    estado: "MG", cidade: "Belo Horizonte",
    email: "mateus.pereira.pt@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },
  {
    nome: "Larissa Melo",
    cpf: "99900099919",
    carteirinha: "06/990009",
    ramo: "Psicólogo",
    estado: "BA", cidade: "Salvador",
    email: "larissa.melo.psi@email.com",
    telefone: "(71) 99900-0999",
    atendimento: ["Online"],
    planosAtendidos: ["SulAmérica"],
  },
  {
    nome: "Henrique Barros",
    cpf: "10011110020",
    carteirinha: "2/100111-F",
    ramo: "Fisioterapeuta",
    estado: "CE", cidade: "Fortaleza",
    email: "henrique.barros.fisio@email.com",
    atendimento: ["Presencial", "Online"],
    planosAtendidos: ["Amil"],
  },
  {
    nome: "Giovanna Leal",
    cpf: "11122221121",
    carteirinha: "3 11222",
    ramo: "Nutricionista",
    estado: "AM", cidade: "Manaus",
    email: "giovanna.leal.nutri@email.com",
    telefone: "(92) 99112-2211",
    atendimento: ["Online"],
    planosAtendidos: [],
  },
  {
    nome: "Vinicius Cruz",
    cpf: "22233332222",
    carteirinha: "022333-G/PE",
    ramo: "Personal Trainer",
    estado: "PE", cidade: "Recife",
    email: "vinicius.cruz.pt@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: ["Bradesco Saúde"],
  },
  {
    nome: "Natália Pinto",
    cpf: "33344443323",
    carteirinha: "06/334444",
    ramo: "Psicólogo",
    estado: "GO", cidade: "Goiânia",
    email: "natalia.pinto.psi@email.com",
    telefone: "(62) 99334-4443",
    atendimento: ["Online"],
    planosAtendidos: ["Unimed"],
  },
  {
    nome: "Eduardo Castro",
    cpf: "44455554424",
    carteirinha: "2/445555-F",
    ramo: "Fisioterapeuta",
    estado: "DF", cidade: "Brasília",
    email: "eduardo.castro.fisio@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: ["Porto Saúde"],
  },
  {
    nome: "Carolina Teixeira",
    cpf: "55566665525",
    carteirinha: "3 55667",
    ramo: "Nutricionista",
    estado: "SC", cidade: "Florianópolis",
    email: "carolina.teixeira.nutri@email.com",
    telefone: "(48) 99556-6655",
    atendimento: ["Presencial", "Online"],
    planosAtendidos: [],
  },
  {
    nome: "Gabriel Ramos",
    cpf: "66677776626",
    carteirinha: "066777-G/SP",
    ramo: "Personal Trainer",
    estado: "SP", cidade: "Campinas",
    email: "gabriel.ramos.pt@email.com",
    atendimento: ["Online"],
    planosAtendidos: ["SulAmérica"],
  },
  {
    nome: "Priscila Moura",
    cpf: "77788887727",
    carteirinha: "06/778888",
    ramo: "Psicólogo",
    estado: "PA", cidade: "Belém",
    email: "priscila.moura.psi@email.com",
    telefone: "(91) 99778-8887",
    atendimento: ["Online"],
    planosAtendidos: ["Amil"],
  },
  {
    nome: "Rodrigo Borges",
    cpf: "88899998828",
    carteirinha: "2/889999-F",
    ramo: "Fisioterapeuta",
    estado: "MT", cidade: "Cuiabá",
    email: "rodrigo.borges.fisio@email.com",
    atendimento: ["Presencial"],
    planosAtendidos: [],
  },
  {
    nome: "Vanessa Azevedo",
    cpf: "99900009929",
    carteirinha: "3 99000",
    ramo: "Nutricionista",
    estado: "AL", cidade: "Maceió",
    email: "vanessa.azevedo.nutri@email.com",
    telefone: "(82) 99900-0099",
    atendimento: ["Presencial"],
    planosAtendidos: ["Unimed"],
  },
  {
    nome: "Alexandre Cunha",
    cpf: "10000010030",
    carteirinha: "010000-G/RN",
    ramo: "Personal Trainer",
    estado: "RN", cidade: "Natal",
    email: "alexandre.cunha.pt@email.com",
    atendimento: ["Online"],
    planosAtendidos: [],
  },
];

const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const existingCpfs = new Set(db.profissionais.map((p) => p.cpf));
let inseridos = 0;

for (const dados of profissionais) {
  if (existingCpfs.has(dados.cpf)) {
    console.log(`CPF já existe, pulando: ${dados.cpf} (${dados.nome})`);
    continue;
  }

  const prof = {
    id: crypto.randomUUID(),
    nome: dados.nome,
    cpf: dados.cpf,
    carteirinha: dados.carteirinha,
    ramo: dados.ramo,
    estado: dados.estado,
    cidade: dados.cidade,
    email: dados.email,
    ...(dados.telefone ? { telefone: dados.telefone } : {}),
    atendimento: dados.atendimento,
    ...(dados.planosAtendidos && dados.planosAtendidos.length > 0
      ? { planosAtendidos: dados.planosAtendidos }
      : {}),
    senhaHash,
    vigenciaInicio: VIGENCIA_INICIO,
    vigenciaFim: VIGENCIA_FIM,
    status: "Ativo",
    criadoEm: CRIADO_EM,
    consentimentoLGPD: CONSENTIMENTO,
    vezesSugerido: 0,
    cliquesContato: 0,
  };

  db.profissionais.push(prof);
  existingCpfs.add(dados.cpf);
  inseridos++;
  console.log(`✓ ${dados.nome} (${dados.ramo} - ${dados.cidade}/${dados.estado})`);
}

const tmp = DB_PATH + ".tmp";
fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf-8");
fs.renameSync(tmp, DB_PATH);

console.log(`\n✅ ${inseridos} profissionais inseridos com sucesso.`);
console.log(`Total de profissionais no banco: ${db.profissionais.length}`);
