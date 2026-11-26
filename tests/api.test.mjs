// Testes automatizados da API do Achei! (executam o servidor real com um banco temporário)
// Uso: npm test   (requer `npm install` feito antes)
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 3399
const BASE = `http://localhost:${PORT}`
const dir = mkdtempSync(path.join(tmpdir(), 'achei-'))
const dbFile = path.join(dir, 'test.db')
let proc

function start() {
  return new Promise((resolve, reject) => {
    proc = spawn(process.execPath, ['server/index.js'], {
      cwd: root,
      env: { ...process.env, PORT: String(PORT), ACHEI_DB: dbFile },
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let err = ''
    proc.stderr.on('data', d => { err += d })
    proc.once('exit', () => reject(new Error('Servidor encerrou ao iniciar:\n' + err)))
    const t0 = Date.now()
    const poll = async () => {
      try { const r = await fetch(BASE + '/api/health'); if (r.ok) return resolve() } catch {}
      if (Date.now() - t0 > 10000) return reject(new Error('Timeout ao iniciar o servidor'))
      setTimeout(poll, 200)
    }
    poll()
  })
}

function stop() {
  return new Promise(resolve => {
    if (!proc || proc.exitCode !== null) return resolve()
    proc.removeAllListeners('exit')
    proc.once('exit', () => resolve())
    proc.kill()
  })
}

async function call(method, url, body, raw) {
  const r = await fetch(BASE + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: raw !== undefined ? raw : body === undefined ? undefined : JSON.stringify(body)
  })
  const text = await r.text()
  return { status: r.status, body: text ? JSON.parse(text) : null }
}

const valid = {
  title: 'Fone de ouvido preto', category: 'Eletrônicos', kind: 'Perdido',
  location: 'Sala 5', date: '2026-11-25', description: 'Com case', contact: 'teste@exemplo.com'
}
let createdId

before(start)
after(async () => { await stop(); rmSync(dir, { recursive: true, force: true }) })

test('TC01 - API responde no health check', async () => {
  const r = await call('GET', '/api/health')
  assert.equal(r.status, 200)
  assert.equal(r.body.ok, true)
})

test('TC02 - listagem retorna os 3 registros iniciais do banco', async () => {
  const r = await call('GET', '/api/items')
  assert.equal(r.status, 200)
  assert.equal(r.body.length, 3)
})

test('TC03 - cadastro válido retorna 201, id e status Aberto', async () => {
  const r = await call('POST', '/api/items', valid)
  assert.equal(r.status, 201)
  assert.ok(r.body.id > 0)
  assert.equal(r.body.status, 'Aberto')
  createdId = r.body.id
  const list = await call('GET', '/api/items')
  assert.equal(list.body.length, 4)
})

test('TC04 - cadastro sem campo obrigatório retorna 400', async () => {
  const r = await call('POST', '/api/items', { ...valid, title: '  ' })
  assert.equal(r.status, 400)
  assert.ok(r.body.error)
})

test('TC05 - cadastro com tipo inválido retorna 400', async () => {
  const r = await call('POST', '/api/items', { ...valid, kind: 'Roubado' })
  assert.equal(r.status, 400)
})

test('TC06 - cadastro com data ou categoria inválida retorna 400', async () => {
  assert.equal((await call('POST', '/api/items', { ...valid, date: '2026-02-31' })).status, 400)
  assert.equal((await call('POST', '/api/items', { ...valid, date: '25/11/2026' })).status, 400)
  assert.equal((await call('POST', '/api/items', { ...valid, category: 'Inexistente' })).status, 400)
})

test('TC07 - busca por texto encontra e não encontra', async () => {
  const hit = await call('GET', '/api/items?q=garrafa')
  assert.ok(hit.body.length >= 1)
  assert.ok(hit.body.every(i => /garrafa/i.test(i.title + i.category + i.location)))
  const miss = await call('GET', '/api/items?q=xyzinexistente')
  assert.deepEqual(miss.body, [])
})

test('TC08 - filtros por tipo e status', async () => {
  const found = await call('GET', '/api/items?kind=Encontrado')
  assert.ok(found.body.length >= 1 && found.body.every(i => i.kind === 'Encontrado'))
  const done = await call('GET', '/api/items?status=Devolvido')
  assert.ok(done.body.length >= 1 && done.body.every(i => i.status === 'Devolvido'))
})

test('TC09 - atualização de status: válido, inválido e inexistente', async () => {
  const ok = await call('PATCH', `/api/items/${createdId}/status`, { status: 'Em contato' })
  assert.equal(ok.status, 200)
  assert.equal(ok.body.status, 'Em contato')
  assert.equal((await call('PATCH', `/api/items/${createdId}/status`, { status: 'Qualquer' })).status, 400)
  assert.equal((await call('PATCH', '/api/items/999999/status', { status: 'Aberto' })).status, 404)
  assert.equal((await call('PATCH', '/api/items/abc/status', { status: 'Aberto' })).status, 400)
})

test('TC10 - exclusão remove o registro; repetir retorna 404', async () => {
  const del = await call('DELETE', `/api/items/${createdId}`)
  assert.equal(del.status, 204)
  const list = await call('GET', '/api/items')
  assert.ok(!list.body.some(i => i.id === createdId))
  assert.equal((await call('DELETE', `/api/items/${createdId}`)).status, 404)
})

test('TC11 - dados persistem após reiniciar o servidor', async () => {
  const created = await call('POST', '/api/items', { ...valid, title: 'Item de persistência' })
  assert.equal(created.status, 201)
  await stop()
  await start()
  const list = await call('GET', '/api/items')
  assert.ok(list.body.some(i => i.title === 'Item de persistência'))
})

test('TC12 - JSON malformado retorna 400 em JSON', async () => {
  const r = await call('POST', '/api/items', undefined, '{ quebrado')
  assert.equal(r.status, 400)
  assert.ok(r.body.error)
})

test('TC13 - caractere % na busca é tratado como texto, não como curinga', async () => {
  const r = await call('GET', '/api/items?q=%25')
  assert.deepEqual(r.body, [])
})
