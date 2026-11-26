# Plano de Testes — Achei!

## Como executar
1. `npm install` · 2. `npm test` (testes automatizados da API, usam banco temporário e a porta 3399) · 3. testes manuais da interface com `npm run dev`.

## Status honesto da execução
- **Verificado de verdade (parcial):** a camada SQLite (esquema e consultas idênticos aos do servidor) foi executada com o módulo `node:sqlite` do Node 22. Resultado abaixo, em "Evidência 1".
- **Ainda NÃO executado:** a API Express real, o front-end e os testes manuais. O ambiente onde o projeto foi revisado não tinha acesso à internet para instalar as dependências. **Os campos "Resultado obtido" abaixo ficam em branco até alguém executar.**
- **Ação:** rode `npm test`, cole a saída em "Evidência 2" e preencha a coluna "Obtido".

## A. Testes automatizados da API (`tests/api.test.mjs`)
| ID | Caso de teste | Resultado esperado | Obtido |
|---|---|---|---|
| TC01 | GET /api/health | 200 `{ok:true}` | |
| TC02 | GET /api/items em banco novo | 200, 3 registros iniciais | |
| TC03 | POST com dados válidos | 201, `id`, status "Aberto"; lista passa a ter 4 | |
| TC04 | POST com título em branco | 400 com `error` | |
| TC05 | POST com tipo "Roubado" | 400 | |
| TC06 | POST com data inexistente (2026-02-31), data fora do formato, categoria inexistente | 400 nos três casos | |
| TC07 | Busca `q=garrafa` e `q=xyzinexistente` | ≥1 resultado coerente; lista vazia | |
| TC08 | Filtros `kind=Encontrado` e `status=Devolvido` | só itens do tipo/status pedido | |
| TC09 | PATCH status válido, inválido, id inexistente, id "abc" | 200 / 400 / 404 / 400 | |
| TC10 | DELETE existente, depois repetir | 204 e some da lista; depois 404 | |
| TC11 | Cadastrar, reiniciar o servidor, listar | registro continua no banco | |
| TC12 | POST com JSON malformado | 400 em JSON | |
| TC13 | Busca `q=%` | lista vazia (sem curinga) | |

## B. Testes manuais da interface
| ID | Passos | Esperado | Obtido |
|---|---|---|---|
| TM01 | `npm run dev` e abrir http://localhost:5173 | página carrega, mostra 3 cartões e "Sistema ativo" | |
| TM02 | Clicar em "Novo registro", preencher, salvar | mensagem de sucesso e cartão novo no topo | |
| TM03 | Enviar o formulário com campo obrigatório vazio | navegador/ API impedem o envio, nada é gravado | |
| TM04 | Digitar "garrafa" na busca | só cartões compatíveis | |
| TM05 | Filtrar por tipo e por status | lista muda conforme filtro | |
| TM06 | Abrir detalhes e mudar status para "Devolvido" | "Status atualizado." e cartão com novo status | |
| TM07 | Excluir um registro e confirmar | "Registro excluído." e cartão some | |
| TM08 | Atualizar a página (F5) | os dados continuam | |
| TM09 | Parar (Ctrl+C) e subir de novo com `npm run dev` | os dados continuam | |
| TM10 | Reduzir a janela / abrir no celular | layout se adapta | |
| TM11 | Parar só a API e recarregar o front | aviso "Não foi possível conectar à API" | |

## Evidência 1 — camada SQLite (executada pelo assistente, Node 22, `node:sqlite`)
```
OK   INSERT retorna lastInsertRowid
OK   CHECK rejeita kind inválido
OK   NOT NULL rejeita title nulo
OK   busca "garrafa" acha 1
OK   busca "xyz" acha 0
OK   busca "%" literal acha 0
OK   busca "_" literal acha 0
OK   filtro kind=Encontrado
OK   UPDATE status altera 1 linha
OK   UPDATE id inexistente altera 0
OK   dados persistem após fechar/reabrir o arquivo
OK   DELETE remove 1 linha
```
Também foram verificadas: sintaxe de `server/index.js` e de `tests/api.test.mjs` (`node --check`) e compilação do JSX de `src/App.jsx` (esbuild). Isso **não** substitui executar a aplicação.

## Evidência 2 — saída de `npm test` na máquina do aluno
(colar aqui)

## Evidência 3 — testes manuais
(anotar data, o que foi feito e, se possível, anexar prints em `docs/evidencias/`)
