# Guia de estudo para a arguição — explicando com o Achei!

Estude em voz alta: tente explicar cada item em 30 segundos, sem olhar.

- **React** — biblioteca para montar a interface com componentes. No Achei!, `App.jsx` guarda o estado (`items`, `query`, `kind`, `status`) e a tela se atualiza sozinha quando o estado muda.
- **Node.js** — executa JavaScript no servidor. Roda `server/index.js`.
- **Express** — framework do Node para criar a API: define rotas (`GET /api/items`, `POST /api/items`...).
- **SQLite** — banco relacional que vive em um arquivo (`achei.db`). Sem servidor de banco para instalar.
- **API REST** — conjunto de URLs que representam recursos e usam verbos HTTP. Recurso: `/api/items`.
- **Full-stack** — projeto com front-end (React), back-end (Express) e banco (SQLite) trabalhando juntos.
- **MER** — desenho das entidades e seus relacionamentos. Achei!: entidade ITEM com 10 atributos, sem relacionamentos.
- **RF e RNF** — RF: o que o sistema faz (cadastrar, pesquisar, mudar status). RNF: qualidade/restrições (responsivo, SQLite, JSON, validação).
- **Caso de uso** — uma interação do ator com o sistema, com fluxo principal e alternativos. Ex.: UC01 Cadastrar objeto.
- **Arquitetura** — Achei! é cliente–servidor com 3 partes lógicas (interface, API, dados). Não afirme "MVC" nem "camadas completas": o back-end está em um arquivo só.

## Fluxo de dados (cadastro)
Usuário preenche o formulário → React envia `POST /api/items` com JSON → Express valida (`validateItem`) → `INSERT` no SQLite → resposta 201 → React faz `GET /api/items` e redesenha a lista.

## Como o banco persiste
Cada `INSERT` é gravado no arquivo `server/achei.db`. Reiniciar os serviços ou atualizar a página não apaga nada, porque os dados não ficam na memória do React nem do Node.

## Git
- `git init` cria o repositório; `git add` escolhe o que entra; `git commit -m "mensagem"` registra um ponto no histórico; `git log --oneline` mostra a história.
- `.gitignore` lista o que não deve ser versionado (`node_modules/`, `achei.db`).
- Commits pequenos e com mensagens claras mostram a evolução do projeto; é isso que o professor avalia.
- Para publicar no GitHub (só você decide quando): crie o repositório vazio, depois `git remote add origin <url>` e `git push -u origin main`.

## Checklist do dia
1. `node -v` e `npm install` funcionando. 2. `npm test` e anotar o resultado. 3. `npm run dev` e ensaiar a demo duas vezes. 4. Ter prints da aplicação como plano B. 5. Ler as 22 perguntas em voz alta.
