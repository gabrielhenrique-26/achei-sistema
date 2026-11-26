# Documentação da API REST — Achei!

Base: `http://localhost:3333` · Formato: JSON · Sem autenticação (PoC).
No desenvolvimento o front acessa `/api/...` pelo proxy do Vite (porta 5173 → 3333).

Erros sempre vêm em JSON: `{ "error": "mensagem" }`.

## GET /api/items
Lista registros, do mais recente ao mais antigo.
- **Query (opcionais):** `q` (texto; busca em título, categoria e local), `kind` (`Perdido` | `Encontrado` | `Todos`), `status` (`Aberto` | `Em contato` | `Devolvido` | `Todos`).
- **200:** array de itens. Sem resultados: `[]`.

## POST /api/items
Cadastra um registro (status inicial `Aberto`).
- **Corpo:**
```json
{ "title": "Fone de ouvido preto", "category": "Eletrônicos", "kind": "Perdido",
  "location": "Sala 5", "date": "2026-11-25", "description": "Com case", "contact": "a@b.com" }
```
Obrigatórios: title, category, kind, location, date, contact. `description` é opcional.
- **201:** o registro criado (com `id`, `status`, `created_at`).
- **400:** campo obrigatório ausente/vazio, tipo ou categoria inválidos, data inválida, texto acima do limite, JSON malformado.

## PATCH /api/items/:id/status
Atualiza o status.
- **Parâmetro:** `id` inteiro positivo. **Corpo:** `{ "status": "Em contato" }`.
- **200:** registro atualizado. **400:** id ou status inválido. **404:** registro inexistente.

## DELETE /api/items/:id
Remove o registro.
- **204:** removido (sem corpo). **400:** id inválido. **404:** registro inexistente.

## GET /api/health
Verifica se a API está no ar. **200:** `{ "ok": true, "service": "Achei API" }`.

## Códigos de erro usados
| Código | Significado no Achei! |
|---|---|
| 400 | Requisição inválida (validação) |
| 404 | Registro não encontrado |
| 500 | Erro interno inesperado (`{"error":"Erro interno do servidor."}`) |
