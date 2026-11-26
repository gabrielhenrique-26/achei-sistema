# Achei! — Sistema de Perdidos e Encontrados

Projeto acadêmico demonstrativo. A aplicação permite cadastrar objetos perdidos/encontrados, pesquisar registros, visualizar detalhes, atualizar status e excluir registros.

## Tecnologias
- React 18 + Vite
- Node.js + Express
- SQLite (`better-sqlite3`)
- CSS responsivo

## Requisitos
Node.js 18 ou superior e npm.

## Como executar
1. Extraia o ZIP.
2. Abra a pasta `achei_projeto` no VS Code.
3. Abra o terminal nessa pasta.
4. Execute `npm install`.
5. Execute `npm run dev`.
6. Acesse `http://localhost:5173`.

A API fica em `http://localhost:3333/api/health`. O banco `server/achei.db` é criado automaticamente na primeira execução.

## Funcionalidades implementadas
- Listagem dos registros.
- Busca por nome, categoria ou local.
- Filtros por tipo e status.
- Cadastro com validação dos campos obrigatórios.
- Visualização de detalhes.
- Atualização do status (Aberto, Em contato, Devolvido).
- Exclusão de registro.
- Persistência em SQLite.
- Registros iniciais para demonstração.

## Escopo e limitações
Esta versão é uma prova de conceito. Não possui autenticação, recuperação de senha, envio de notificações, upload de imagens ou verificação de identidade. O contato é exibido conforme informado no cadastro. Em uma versão de produção, seriam necessários controle de acesso, proteção de dados pessoais, validação de contatos, logs, testes automatizados e política de retenção.

## Estrutura
- `src/App.jsx`: interface e interação.
- `src/style.css`: identidade visual e responsividade.
- `server/index.js`: API REST e banco SQLite.
- `docs/`: documentação de requisitos e modelo de dados.
