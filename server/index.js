const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const app = express()
// ACHEI_DB permite usar um banco separado nos testes automatizados
const db = new Database(process.env.ACHEI_DB || path.join(__dirname, 'achei.db'))
app.use(cors())
app.use(express.json())

const CATEGORIES = ['Eletrônicos', 'Acessórios', 'Material escolar', 'Documentos', 'Chaves', 'Roupas', 'Outros']
const KINDS = ['Perdido', 'Encontrado']
const STATUSES = ['Aberto', 'Em contato', 'Devolvido']
const LIMITS = { title: 100, location: 100, description: 500, contact: 100 }

db.exec(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('Perdido','Encontrado')),
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT DEFAULT '',
  contact TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aberto',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`)

const count = db.prepare('SELECT COUNT(*) AS total FROM items').get().total
if (!count) {
  const insert = db.prepare(`INSERT INTO items (title,category,kind,location,date,description,contact,status)
    VALUES (@title,@category,@kind,@location,@date,@description,@contact,@status)`)
  ;[
    {title:'Garrafa térmica azul',category:'Acessórios',kind:'Perdido',location:'Biblioteca - Bloco A',date:'2026-11-24',description:'Garrafa azul-marinho com adesivo branco.',contact:'aluno@exemplo.com',status:'Aberto'},
    {title:'Estojo preto',category:'Material escolar',kind:'Encontrado',location:'Sala 12',date:'2026-11-23',description:'Estojo preto com canetas e marca-texto.',contact:'secretaria@exemplo.com',status:'Aberto'},
    {title:'Chaveiro com duas chaves',category:'Chaves',kind:'Encontrado',location:'Estacionamento',date:'2026-11-22',description:'Chaveiro de tecido vermelho.',contact:'portaria@exemplo.com',status:'Devolvido'}
  ].forEach(x => insert.run(x))
}

// Valida uma data no formato AAAA-MM-DD que realmente exista no calendário
function isValidDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(s + 'T00:00:00Z')
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

// Retorna a mensagem de erro (string) ou null se o corpo é válido
function validateItem(body) {
  const { title, category, kind, location, date, description = '', contact } = body || {}
  if (![title, category, kind, location, date, contact].every(v => typeof v === 'string' && v.trim())) {
    return 'Preencha todos os campos obrigatórios.'
  }
  if (typeof description !== 'string') return 'Descrição inválida.'
  if (!KINDS.includes(kind)) return 'Tipo inválido.'
  if (!CATEGORIES.includes(category)) return 'Categoria inválida.'
  if (!isValidDate(date)) return 'Data inválida. Use o formato AAAA-MM-DD.'
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = body[field]
    if (typeof value === 'string' && value.trim().length > max) return `O campo "${field}" excede ${max} caracteres.`
  }
  return null
}

function parseId(raw) {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

app.get('/api/items', (req, res) => {
  const q = String(req.query.q ?? '')
  const kind = String(req.query.kind ?? 'Todos')
  const status = String(req.query.status ?? 'Todos')
  // escapa % e _ para que sejam tratados como texto comum na busca
  const term = '%' + q.replace(/[\\%_]/g, c => '\\' + c) + '%'
  let sql = `SELECT * FROM items WHERE (title LIKE ? ESCAPE '\\' OR category LIKE ? ESCAPE '\\' OR location LIKE ? ESCAPE '\\')`
  const params = [term, term, term]
  if (kind !== 'Todos') { sql += ' AND kind = ?'; params.push(kind) }
  if (status !== 'Todos') { sql += ' AND status = ?'; params.push(status) }
  sql += ' ORDER BY created_at DESC, id DESC'
  res.json(db.prepare(sql).all(...params))
})

app.post('/api/items', (req, res) => {
  const error = validateItem(req.body)
  if (error) return res.status(400).json({ error })
  const { title, category, kind, location, date, description = '', contact } = req.body
  const result = db.prepare(`INSERT INTO items (title,category,kind,location,date,description,contact)
    VALUES (?,?,?,?,?,?,?)`).run(title.trim(), category, kind, location.trim(), date, description.trim(), contact.trim())
  res.status(201).json(db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid))
})

app.patch('/api/items/:id/status', (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido.' })
  const status = req.body && req.body.status
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Status inválido.' })
  const result = db.prepare('UPDATE items SET status = ? WHERE id = ?').run(status, id)
  if (!result.changes) return res.status(404).json({ error: 'Registro não encontrado.' })
  res.json(db.prepare('SELECT * FROM items WHERE id = ?').get(id))
})

app.delete('/api/items/:id', (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido.' })
  const result = db.prepare('DELETE FROM items WHERE id = ?').run(id)
  if (!result.changes) return res.status(404).json({ error: 'Registro não encontrado.' })
  res.status(204).end()
})

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'Achei API' }))

const dist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html')))
}

// Tratamento global de erros: sempre responde em JSON
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' })
  console.error(err)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`API Achei! em http://localhost:${PORT}`))
