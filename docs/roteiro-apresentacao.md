# Roteiro de fala — Achei! (≈ 13 min)

Fale devagar, em tom natural. Os tempos somam cerca de 13 minutos e deixam folga para a arguição. A numeração segue os 13 tópicos pedidos para a apresentação.

**1. Capa (0:20)** — "Boa tarde, professor. Eu sou [seu nome] e vou apresentar o Achei!, um sistema de objetos perdidos e encontrados."

**2. Problema (1:00)** — "Quando alguém perde ou acha um objeto na faculdade, a informação se espalha em grupos de WhatsApp, cartazes e avisos. Não existe um lugar único para consultar, pesquisar por local ou saber se o item já foi devolvido."

**3. Objetivo (0:40)** — "O objetivo é centralizar esses registros: cadastrar, consultar, pesquisar e acompanhar o status de cada objeto até a devolução."

**4. Proposta de solução (0:50)** — "Uma aplicação web em que qualquer pessoa registra um objeto como perdido ou encontrado, e quem gerencia atualiza o status: Aberto, Em contato ou Devolvido."

**5. Requisitos (1:15)** — "São 8 requisitos funcionais: cadastrar, listar, pesquisar, filtrar, ver detalhes, atualizar status e excluir. Entre os não funcionais: interface responsiva, persistência em SQLite e validação dos campos. Tudo está em docs/requisitos.md."

**6. Casos de uso (1:00)** — "Temos seis casos de uso, de UC01 a UC06. Dois papéis: o usuário, que cadastra e consulta, e o responsável pela gestão, que atualiza e exclui. Como é uma prova de conceito, ainda não há login: isso é evolução futura."

**7. Arquitetura (1:30)** — "É cliente-servidor. O React, no navegador, conversa por HTTP e JSON com a API em Express, que grava e lê no SQLite. Fiz essa separação para que a interface possa mudar sem mexer nos dados."

**8. Tecnologias (1:00)** — "React e Vite na interface, Node e Express na API, SQLite como banco. Escolhi JavaScript nas duas pontas para ter uma única linguagem, e SQLite porque não exige instalar servidor de banco."

**9. MER (1:00)** — "O modelo tem uma entidade, Item, com id como chave primária, título, categoria, tipo, local, data, descrição, contato, status e data de criação. Como o escopo é enxuto, não há relacionamentos; usuário e histórico de status ficam como evolução."

**10. Demonstração (2:30)** — Siga esta ordem: (1) mostrar a lista inicial; (2) buscar "garrafa" e filtrar por tipo; (3) cadastrar um objeto encontrado; (4) abrir os detalhes e mudar o status para "Devolvido"; (5) apertar F5 e mostrar que os dados continuam. *Plano B: se a demo falhar, mostre os prints/vídeo e o banco aberto.* Dica: teste tudo 1 hora antes.

**11. Testes (0:50)** — "Fiz testes automatizados da API que sobem o servidor com um banco temporário e verificam cadastro, busca, filtros, status, exclusão e persistência após reiniciar." (Só diga os números quando tiver rodado `npm test` e anotado o resultado em docs/plano-de-testes.md.)

**12. Limitações e melhorias (0:50)** — "É uma prova de conceito: sem autenticação, sem fotos, sem notificações. As próximas etapas seriam login e perfis, histórico de status e separar melhor o código do back-end."

**13. Conclusão (0:30)** — "O Achei! entrega o fluxo completo de ponta a ponta com banco real. Obrigado, fico à disposição para perguntas."

**Git:** se o professor perguntar, abra o GitHub/`git log` e explique o histórico.
