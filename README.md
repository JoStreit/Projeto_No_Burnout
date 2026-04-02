# SaúdeConnect

Plataforma web para conectar pacientes aos profissionais de saúde ideais para o seu perfil.

## Funcionalidades

- **Análise Gratuita** — formulário de 5 perguntas que recomenda o profissional ideal (sem necessidade de login)
- **Cadastro de Paciente** — com CPF validado, senha e login automático após o cadastro
- **Cadastro de Profissional** — com nome, CPF, ramo de atuação e cidade
- **Busca de Profissionais** — filtros por ramo e cidade (disponível para pacientes logados)
- **Autenticação** — login e logout via sessão segura (cookie httpOnly)

## Tecnologias

- [Next.js 16](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — hash de senhas

## Como rodar localmente

1. Clone o repositório:

```bash
git clone https://github.com/JoStreit/Projeto_No_Burnout.git
cd Projeto_No_Burnout
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo de banco de dados local:

```bash
echo '{ "pacientes": [], "profissionais": [] }' > data/db.json
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do projeto

```
app/
  page.tsx                      # Página inicial
  api/
    auth/login/route.ts         # Login
    auth/logout/route.ts        # Logout
    auth/me/route.ts            # Sessão atual
    pacientes/route.ts          # CRUD de pacientes
    profissionais/route.ts      # CRUD de profissionais
components/
  AnaliseGratuitaModal.tsx      # Formulário de análise
  CadastroPacienteModal.tsx     # Cadastro de paciente
  CadastroProfissionalModal.tsx # Cadastro de profissional
  LoginModal.tsx                # Login
  BuscarProfissionaisModal.tsx  # Busca de profissionais
  AuthProvider.tsx              # Contexto de autenticação
lib/
  cpf.ts                        # Validação e formatação de CPF
  db.ts                         # Persistência em JSON
  auth.ts                       # Tokens de sessão
data/
  db.json                       # Banco de dados local (não versionado)
```

## Observações

- O banco de dados é um arquivo JSON local (`data/db.json`), adequado para desenvolvimento. Em produção, substituir por PostgreSQL com Prisma.
- O arquivo `data/db.json` está no `.gitignore` por conter dados sensíveis.
