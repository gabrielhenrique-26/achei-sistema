# Dicionário de Dados — Achei!

Banco: SQLite, arquivo `server/achei.db` (criado automaticamente). Tabela única: **`items`**.

| Coluna | Tipo | Nulo? | Padrão | Restrições / regras |
|---|---|---|---|---|
| `id` | INTEGER | não | autoincremento | **Chave primária** |
| `title` | TEXT | não | — | Nome do objeto; máx. 100 caracteres (validado na API) |
| `category` | TEXT | não | — | Uma de: Eletrônicos, Acessórios, Material escolar, Documentos, Chaves, Roupas, Outros (validado na API) |
| `kind` | TEXT | não | — | `CHECK (kind IN ('Perdido','Encontrado'))` — restrição no banco |
| `location` | TEXT | não | — | Local; máx. 100 caracteres (API) |
| `date` | TEXT | não | — | Data do fato, formato `AAAA-MM-DD`, data válida (API) |
| `description` | TEXT | sim | `''` | Máx. 500 caracteres (API) |
| `contact` | TEXT | não | — | E-mail ou telefone; máx. 100 caracteres (API) |
| `status` | TEXT | não | `'Aberto'` | Valores aceitos pela API: Aberto, Em contato, Devolvido |
| `created_at` | TEXT | sim | `CURRENT_TIMESTAMP` | Data/hora de criação (UTC) |

- **Chaves estrangeiras:** nenhuma (tabela única).
- **Onde cada regra vive:** `NOT NULL`, `PRIMARY KEY` e `CHECK(kind)` estão no **banco**; categoria, formato de data, tamanhos e valores de `status` estão na **API** (`server/index.js`). O banco não tem `CHECK` para `status`; a API garante.
- **Índices:** apenas o da chave primária. Para o volume da PoC não são necessários.
