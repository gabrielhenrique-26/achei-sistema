# Especificação de Requisitos — Achei!

## 1. Visão geral
O Achei! é uma aplicação web para centralizar o registro e a consulta de objetos perdidos e encontrados em um ambiente institucional, como uma faculdade.

## 2. Problema
A comunicação informal sobre objetos perdidos pode dispersar informações e dificultar a localização do responsável por um item. A proposta é reunir os registros em um único local pesquisável.

## 3. Objetivo
Facilitar o registro, a consulta e o acompanhamento de objetos perdidos e encontrados.

## 4. Atores
- Usuário/colaborador: registra um objeto perdido ou encontrado e consulta os registros.
- Responsável pela gestão: acompanha os registros, atualiza seu status e remove cadastros inadequados. Nesta PoC, as ações administrativas estão abertas na interface; autenticação e perfis são evolução futura.

## 5. Requisitos funcionais
- RF01: O sistema deve permitir cadastrar um objeto como perdido ou encontrado.
- RF02: O sistema deve exigir nome, categoria, tipo, local, data e contato.
- RF03: O sistema deve listar os registros cadastrados.
- RF04: O sistema deve permitir pesquisar por nome, categoria ou local.
- RF05: O sistema deve filtrar registros por tipo e status.
- RF06: O sistema deve exibir detalhes de um registro.
- RF07: O sistema deve permitir atualizar o status para Aberto, Em contato ou Devolvido.
- RF08: O sistema deve permitir excluir um registro.

## 6. Requisitos não funcionais
- RNF01: A interface deve ser responsiva para desktop e dispositivos móveis.
- RNF02: A aplicação deve persistir os dados em banco SQLite.
- RNF03: A comunicação entre interface e API deve utilizar HTTP e JSON.
- RNF04: Campos obrigatórios devem ser validados antes da gravação.
- RNF05: A interface deve apresentar mensagens de retorno após operações.
- RNF06: O sistema deve ser executável localmente com Node.js.

## 7. Regras de negócio
- RN01: Todo registro deve ser classificado como Perdido ou Encontrado.
- RN02: Um registro deve possuir um status: Aberto, Em contato ou Devolvido.
- RN03: Apenas registros existentes podem ter status alterado ou ser excluídos.
- RN04: Um registro deve possuir uma forma de contato para permitir o retorno.
- RN05: A pesquisa considera título, categoria e local.

## 8. Casos de uso
- UC01 — Cadastrar objeto: informar os dados e salvar o registro.
- UC02 — Consultar objetos: visualizar a lista de registros.
- UC03 — Pesquisar e filtrar: informar termo e selecionar filtros.
- UC04 — Visualizar detalhes: selecionar um cartão e consultar seus dados.
- UC05 — Atualizar status: alterar a situação do registro.
- UC06 — Excluir registro: remover um cadastro.

## 9. Limitações da PoC
Não há autenticação, autorização por perfil, upload de imagens, notificações ou integração com serviços externos. O sistema é uma demonstração local e não deve receber dados pessoais reais sem controles adicionais.

## 10. Regras de negócio adicionadas na revisão (validações da API)
- RN06: a categoria deve ser uma das categorias oferecidas (Eletrônicos, Acessórios, Material escolar, Documentos, Chaves, Roupas, Outros).
- RN07: a data deve estar no formato AAAA-MM-DD e existir no calendário; título, local e contato aceitam até 100 caracteres e a descrição até 500.
- RN08: a busca trata `%` e `_` como texto comum.

## 11. Status de implementação
RF01–RF08 e RNF01–RNF06 estão **implementados no código**. A verificação de execução está em `docs/plano-de-testes.md`. Autenticação, perfis, imagens, notificações e histórico são **evolução futura** (não implementados).
