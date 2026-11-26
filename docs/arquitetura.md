# Documentação Técnica — Achei!

## 1. Status: planejado × implementado × futuro
| Item | Situação |
|---|---|
| Cadastro, listagem, busca, filtros, detalhes, troca de status, exclusão, persistência SQLite, validação, mensagens de retorno, layout responsivo | **Implementado no código** (RF01–RF08, RNF01–RNF06) |
| Testes automatizados da API (`npm test`) | **Escritos**; execução ponta a ponta a registrar em [plano-de-testes.md](plano-de-testes.md) |
| Autenticação e perfis, upload de fotos, notificações, histórico de alterações, auditoria, implantação em servidor | **Futuro** (não implementado) |

## 2. Arquitetura
Cliente–servidor em três partes lógicas (ver [diagramas.md](diagramas.md)):
1. **Interface** — React 18 (SPA), roda no navegador, guarda o estado e chama a API com `fetch`.
2. **API REST** — Node.js + Express: rotas, validação e respostas em JSON.
3. **Dados** — SQLite acessado por `better-sqlite3`; os dados ficam no arquivo `server/achei.db`.

Observação honesta: as três partes existem logicamente, mas no back-end rotas, validação e acesso a dados estão no mesmo arquivo (`server/index.js`). Separar em módulos (rotas / serviços / repositório) é melhoria futura.

**Fluxo de dados (cadastro):** formulário → `POST /api/items` (JSON) → validação → `INSERT` no SQLite → resposta 201 → o front recarrega a lista com `GET`.

## 3. Justificativa da stack
| Tecnologia | Por quê |
|---|---|
| React + Vite | Interface por componentes e estado; Vite inicia rápido e tem proxy para a API |
| Node.js + Express | Mesma linguagem (JavaScript) no front e no back; API REST simples e conhecida |
| SQLite | Banco relacional em arquivo, sem instalar servidor; suficiente para uma PoC e fácil de demonstrar |
| better-sqlite3 | Driver síncrono, simples e rápido para SQLite em Node |
| API REST + JSON | Padrão de mercado; separa interface e dados |

Alternativa (MySQL/PostgreSQL) exigiria servidor de banco, sem ganho para o escopo atual; a troca seria localizada nas consultas SQL.

## 4. Estrutura de diretórios
```
achei_projeto/
├── server/index.js        API REST + SQLite
├── src/                   App.jsx, main.jsx, style.css (front-end)
├── tests/api.test.mjs     testes automatizados da API
├── docs/                  documentação, diagramas e material da apresentação
├── index.html · vite.config.js · package.json · README.md · .gitignore
```

## 5. Instalação, configuração e execução
Pré-requisitos: Node.js 18+ e npm (verifique com `node -v`).
```
npm install       # instala dependências
npm run dev       # sobe API (3333) e front (5173)
npm test          # testes automatizados da API
```
Configuração opcional por variáveis de ambiente: `PORT` (porta da API) e `ACHEI_DB` (caminho do banco; usado nos testes).
Modo único: `npm run build` e depois `npm start` — o Express serve o front compilado em `http://localhost:3333`.

## 6. Limitações
Sem autenticação nem controle de acesso (qualquer pessoa pode excluir), sem paginação, sem upload de imagens, sem notificações, sem histórico de mudanças de status, contato exibido como digitado, não deve receber dados pessoais reais. Exclusão é definitiva. SQLite atende um usuário/poucos acessos simultâneos.

## 7. Melhorias futuras
Autenticação e perfis; entidades `Usuario`, `Categoria`, `Instituicao`, `HistoricoStatus`; fotos; notificações; paginação; modularizar o back-end; migrar para banco cliente–servidor se houver muitos usuários; implantação com HTTPS.
