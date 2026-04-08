@AGENTS.md

Orientações do projeto:

1 - Toda implementação e alteração deverá subir para o repositório no Guthub:

2 - Todo ajuste, tela nova, funcionalidade nova deverá ser criada no padrão de layout, fonte e cores da página principal. 

3 - o sistema possui 3 tipos de perfis: paciente, profissional e administrador.

4 - Tecnologias:
Next.js 16 (App Router)
React
TypeScript
Tailwind CSS
shadcn/ui
bcryptjs — hash de senhas

5 - Inicie o servidor de desenvolvimento:
npm run dev

6 - O banco de dados é um arquivo JSON local (data/db.json), adequado para desenvolvimento. Em produção, substituir por PostgreSQL com Prisma.

7 - O arquivo data/db.json está no .gitignore por conter dados sensíveis.

8 - Evitar SQL injection/XSS pelo sistema. E tente utilizar sempre bibliotecas atualizadas.
