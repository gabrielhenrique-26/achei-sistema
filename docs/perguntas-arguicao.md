# Perguntas prováveis da arguição — Achei!

Respostas curtas e com exemplos do próprio projeto. Releia o código (server/index.js e src/App.jsx) antes — você precisa conseguir apontar onde cada coisa está.

**1. Qual o problema que o Achei! resolve?**
Objetos perdidos ficam em avisos e conversas soltas. O Achei! centraliza os registros em um lugar pesquisável, com status até a devolução.

**2. Por que React?**
Porque a tela muda conforme o estado (lista, filtros, janelas). No `App.jsx`, ao digitar na busca, o estado `query` muda e a lista é refeita sem recarregar a página.

**3. O que é e para que serve o Node.js?**
Ambiente que executa JavaScript fora do navegador. Aqui ele roda a API (`server/index.js`).

**4. O que o Express faz?**
Cria o servidor HTTP e define as rotas. Ex.: `app.post('/api/items', ...)` recebe o cadastro.

**5. Por que SQLite e não MySQL/PostgreSQL?**
SQLite é um banco relacional em arquivo (`achei.db`), sem servidor para instalar — ideal para PoC e demonstração. Para muitos usuários simultâneos eu migraria para um banco cliente–servidor; só as consultas SQL mudariam.

**6. O que é uma API REST? O seu projeto é REST?**
É uma API que expõe recursos por URLs e usa os verbos HTTP. Aqui o recurso é `/api/items`: GET lista, POST cria, PATCH altera o status, DELETE remove, com códigos 200/201/204/400/404. Segue o estilo REST de forma simples (sem autenticação nem paginação).

**7. Por que PATCH no status e não PUT?**
PATCH altera parte do recurso (só o status). PUT substituiria o registro inteiro.

**8. Como o front conversa com o back?**
Por `fetch` com JSON. No desenvolvimento o Vite redireciona `/api` para a porta 3333 (proxy em `vite.config.js`), evitando problemas de CORS.

**9. Como os dados persistem?**
O servidor grava no arquivo `server/achei.db`. Fechar o navegador ou reiniciar a API não apaga nada, porque o banco é um arquivo em disco.

**10. Como você protege contra SQL Injection?**
Uso consultas parametrizadas (`?` com `.run(...)`/`.all(...)`) do better-sqlite3: o valor nunca é concatenado no SQL. No filtro por `kind` e `status`, também.

**11. E contra XSS?**
O React escapa o texto que renderiza em JSX; eu não uso `dangerouslySetInnerHTML`.

**12. Que validações existem e onde?**
No front, campos `required`. Na API, `validateItem` confere obrigatórios, tipo, categoria, data real e tamanhos. No banco, `NOT NULL` e `CHECK(kind)`. Validar no servidor é essencial porque o front pode ser contornado.

**13. Por que um MER com uma só entidade?**
É o que o escopo exige: cada registro é independente. Reconheço que é simples; evoluiria com `Usuario`, `Categoria` e `HistoricoStatus`. Por exemplo, a categoria hoje é texto repetido; normalizada viraria tabela com chave estrangeira.

**14. O banco está normalizado?**
Está em 1FN (valores atômicos, chave primária). A repetição do texto da categoria é o ponto que uma 3FN/tabela própria resolveria, mas não foi necessário para a PoC.

**15. Qual a diferença entre requisito funcional e não funcional?**
Funcional é o que o sistema faz (RF01: cadastrar objeto). Não funcional é como ele deve ser (RNF01: interface responsiva; RNF02: persistir em SQLite).

**16. Que arquitetura você usou? É em camadas?**
Cliente–servidor com três partes lógicas: interface, API e dados. No código do back-end, porém, rotas, validação e acesso a dados ficam no mesmo arquivo; separar em módulos é melhoria futura. Prefiro dizer isso a exagerar.

**17. O que acontece se dois usuários cadastrarem ao mesmo tempo?**
O better-sqlite3 é síncrono e o SQLite serializa as escritas, então as duas gravações ocorrem uma após a outra sem corromper o banco. Para alta concorrência, usaria outro SGBD.

**18. Como você testou?**
Testes automatizados da API em `tests/api.test.mjs` (`npm test`): sobem o servidor com banco temporário e conferem cadastro, validações, busca, filtros, status, exclusão e persistência após reiniciar. A interface foi testada manualmente conforme o plano em `docs/plano-de-testes.md`. *(Diga só o que você realmente executou.)*

**19. Qual a maior limitação?**
Não há autenticação: qualquer pessoa pode excluir. Por isso é PoC e não deve receber dados pessoais reais.

**20. Como funciona o versionamento com Git?**
Cada alteração coerente vira um commit com mensagem descritiva; o histórico mostra a evolução (`git log --oneline`). O `.gitignore` evita versionar `node_modules` e o banco `achei.db`.

**21. Como colocar em produção?**
`npm run build` gera o front em `dist/`, e `npm start` faz o Express servir o front e a API na mesma porta. Em produção real: HTTPS, autenticação e banco apropriado.

**22. O que você faria com mais tempo?**
Login e perfis, upload de foto, notificação ao dono, histórico de status e testes de interface.
