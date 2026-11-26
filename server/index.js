const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')

const app = express()
const db = new Database(path.join(__dirname, 'achei.db'))
app.use(cors())
app.use(express.json())

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

app.get('/api/items', (req,res) => {
  const { q = '', kind = 'Todos', status = 'Todos' } = req.query
  let sql = `SELECT * FROM items WHERE (title LIKE ? OR category LIKE ? OR location LIKE ?)`
  const term = `%${q}%`, params = [term,term,term]
  if (kind !== 'Todos') { sql += ' AND kind = ?'; params.push(kind) }
  if (status !== 'Todos') { sql += ' AND status = ?'; params.push(status) }
  sql += ' ORDER BY created_at DESC, id DESC'
  res.json(db.prepare(sql).all(...params))
})
app.post('/api/items', (req,res) => {
  const {title,category,kind,location,date,description='',contact} = req.body
  if (![title,category,kind,location,date,contact].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({error:'Preencha todos os campos obrigatórios.'})
  }
  if (!['Perdido','Encontrado'].includes(kind)) return res.status(400).json({error:'Tipo inválido.'})
  const result = db.prepare(`INSERT INTO items (title,category,kind,location,date,description,contact)
    VALUES (?,?,?,?,?,?,?)`).run(title.trim(),category,kind,location.trim(),date,description.trim(),contact.trim())
  res.status(201).json(db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid))
})
app.patch('/api/items/:id/status', (req,res) => {
  const {status} = req.body
  if (!['Aberto','Em contato','Devolvido'].includes(status)) return res.status(400).json({error:'Status inválido.'})
  const result = db.prepare('UPDATE items SET status = ? WHERE id = ?').run(status,req.params.id)
  if (!result.changes) return res.status(404).json({error:'Registro não encontrado.'})
  res.json(db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id))
})
app.delete('/api/items/:id', (req,res) => {
  const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  if (!result.changes) return res.status(404).json({error:'Registro não encontrado.'})
  res.status(204).end()
})
app.get('/api/health', (_,res) => res.json({ok:true, service:'Achei API'}))

const dist = path.join(__dirname,'..','dist')
if (require('fs').existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_,res) => res.sendFile(path.join(dist,'index.html')))
}
const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`API Achei! em http://localhost:${PORT}`))
