import { useEffect, useMemo, useState } from 'react'

const empty = { title:'', category:'Eletrônicos', kind:'Perdido', location:'', date:new Date().toISOString().slice(0,10), description:'', contact:'' }
const categories = ['Eletrônicos','Acessórios','Material escolar','Documentos','Chaves','Roupas','Outros']
const moneyDate = d => d ? new Date(d+'T12:00:00').toLocaleDateString('pt-BR') : '—'

export default function App() {
  const [items,setItems] = useState([])
  const [query,setQuery] = useState('')
  const [kind,setKind] = useState('Todos')
  const [status,setStatus] = useState('Todos')
  const [modal,setModal] = useState(false)
  const [form,setForm] = useState(empty)
  const [busy,setBusy] = useState(false)
  const [notice,setNotice] = useState('')
  const [selected,setSelected] = useState(null)

  async function load() {
    const p = new URLSearchParams({q:query,kind,status})
    const r = await fetch('/api/items?'+p)
    setItems(await r.json())
  }
  useEffect(()=>{ load().catch(()=>setNotice('Não foi possível conectar à API. Verifique se o servidor está ativo.')) },[query,kind,status])
  const stats = useMemo(()=>({
    total:items.length,
    lost:items.filter(x=>x.kind==='Perdido' && x.status!=='Devolvido').length,
    found:items.filter(x=>x.kind==='Encontrado' && x.status!=='Devolvido').length,
    returned:items.filter(x=>x.status==='Devolvido').length
  }),[items])

  async function submit(e) {
    e.preventDefault(); setBusy(true); setNotice('')
    try {
      const r = await fetch('/api/items',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Erro ao cadastrar')
      setForm(empty); setModal(false); setNotice('Registro cadastrado com sucesso!'); await load()
    } catch(err) { setNotice(err.message) } finally { setBusy(false) }
  }
  async function changeStatus(item,next) {
    const r = await fetch(`/api/items/${item.id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:next})})
    if (r.ok) { setSelected(null); await load(); setNotice('Status atualizado.') }
  }
  async function remove(item) {
    if (!confirm(`Excluir "${item.title}"?`)) return
    await fetch(`/api/items/${item.id}`,{method:'DELETE'})
    setSelected(null); await load(); setNotice('Registro excluído.')
  }

  return <div className="app">
    <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Achei<span>!</span></b><small>PERDIDOS & ENCONTRADOS</small></div></div><div className="top-actions"><span className="live"><i/> Sistema ativo</span><button className="primary" onClick={()=>setModal(true)}>＋ Novo registro</button></div></header>
    <main>
      <section className="hero"><div><div className="eyebrow">CONECTANDO PESSOAS E OBJETOS</div><h1>Perdeu algo?<br/><em>Vamos encontrar.</em></h1><p>Registre um objeto perdido ou encontrado e ajude a devolver o que importa ao seu dono.</p><button className="hero-btn" onClick={()=>setModal(true)}>＋ Cadastrar objeto</button></div><div className="hero-art"><div className="orbit orbit1"/><div className="orbit orbit2"/><div className="pin">⌖</div><div className="float-card"><span>✦</span><div><b>Pequenas coisas,</b><small>grandes reencontros.</small></div></div></div></section>
      <section className="stats">
        <Stat icon="▤" label="Registros exibidos" value={stats.total} tone="blue"/>
        <Stat icon="⌕" label="Objetos perdidos" value={stats.lost} tone="orange"/>
        <Stat icon="✓" label="Objetos encontrados" value={stats.found} tone="green"/>
        <Stat icon="♡" label="Devolvidos" value={stats.returned} tone="purple"/>
      </section>
      <section className="section-head"><div><div className="eyebrow dark">CENTRAL DE REGISTROS</div><h2>Explore os registros</h2><p>Pesquise e acompanhe objetos cadastrados na plataforma.</p></div><span className="count">{items.length} registros</span></section>
      {notice && <div className="notice" onClick={()=>setNotice('')}>{notice} <b>×</b></div>}
      <section className="filters"><div className="search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por objeto, categoria ou local..."/></div><select value={kind} onChange={e=>setKind(e.target.value)}><option>Todos</option><option>Perdido</option><option>Encontrado</option></select><select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option><option>Aberto</option><option>Em contato</option><option>Devolvido</option></select></section>
      <section className="cards">{items.map(item=><article className="item-card" key={item.id} onClick={()=>setSelected(item)}><div className="card-top"><span className={`type ${item.kind==='Perdido'?'lost':'found'}`}>{item.kind==='Perdido'?'⌕':'✓'} {item.kind}</span><span className="id">#{String(item.id).padStart(4,'0')}</span></div><div className="item-icon">{iconFor(item.category)}</div><h3>{item.title}</h3><div className="category">{item.category}</div><div className="meta"><span>⌖ {item.location}</span><span>▦ {moneyDate(item.date)}</span></div><div className="card-bottom"><span className={`status ${item.status==='Devolvido'?'done':''}`}>{item.status}</span><button onClick={e=>{e.stopPropagation();setSelected(item)}}>Ver detalhes →</button></div></article>)}</section>
      {!items.length && <div className="empty"><div>⌕</div><b>Nenhum registro encontrado</b><p>Tente mudar os filtros ou cadastre um novo objeto.</p></div>}
      <footer><b>Achei!</b> · Projeto acadêmico de demonstração <span>Organização que aproxima. ♡</span></footer>
    </main>
    {modal && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><form className="dialog" onSubmit={submit}><div className="dialog-head"><div><div className="eyebrow dark">NOVO CADASTRO</div><h2>Registrar objeto</h2></div><button type="button" className="close" onClick={()=>setModal(false)}>×</button></div><label>Nome do objeto *<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ex.: Fone de ouvido preto"/></label><div className="form-row"><label>Categoria *<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Tipo de registro *<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}><option>Perdido</option><option>Encontrado</option></select></label></div><div className="form-row"><label>Local *<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Onde foi visto?"/></label><label>Data *<input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label></div><label>Descrição<textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Cor, marca, características..."/></label><label>Contato para retorno *<input required value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="E-mail ou telefone"/></label><div className="dialog-actions"><button type="button" className="secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="primary" disabled={busy}>{busy?'Salvando...':'Salvar registro'}</button></div></form></div>}
    {selected && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><div className="dialog detail"><div className="dialog-head"><div><div className="eyebrow dark">DETALHES DO REGISTRO</div><h2>{selected.title}</h2></div><button className="close" onClick={()=>setSelected(null)}>×</button></div><div className="detail-grid"><span>Tipo</span><b>{selected.kind}</b><span>Categoria</span><b>{selected.category}</b><span>Local</span><b>{selected.location}</b><span>Data</span><b>{moneyDate(selected.date)}</b><span>Contato</span><b>{selected.contact}</b><span>Status</span><b>{selected.status}</b></div><p className="description">{selected.description || 'Sem descrição adicional.'}</p><label>Atualizar status<select value={selected.status} onChange={e=>changeStatus(selected,e.target.value)}><option>Aberto</option><option>Em contato</option><option>Devolvido</option></select></label><div className="dialog-actions"><button className="danger" onClick={()=>remove(selected)}>Excluir registro</button><button className="primary" onClick={()=>setSelected(null)}>Fechar</button></div></div></div>}
  </div>
}
function Stat({icon,label,value,tone}) { return <div className="stat"><div className={'stat-icon '+tone}>{icon}</div><div><b>{value}</b><span>{label}</span></div></div> }
function iconFor(c) { return ({'Eletrônicos':'◉','Acessórios':'◇','Material escolar':'✎','Documentos':'▤','Chaves':'⚿','Roupas':'♧','Outros':'✦'})[c] || '✦' }
