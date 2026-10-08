import { FormEvent, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Conformidade, Processo } from '../types'
import StatusBadge from '../components/StatusBadge'

export default function ConformidadesPage() {
  const [itens, setItens] = useState<Conformidade[]>([])
  const [processos, setProcessos] = useState<Processo[]>([])
  const [form, setForm] = useState({ processoId: '', item: '', observacao: '' })

  const carregar = async () => {
    const [c, p] = await Promise.all([
      api.get<Conformidade[]>('/conformidades'),
      api.get<Processo[]>('/processos'),
    ])
    setItens(c.data)
    setProcessos(p.data)
  }

  useEffect(() => {
    carregar()
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    await api.post('/conformidades', { ...form, processoId: Number(form.processoId) })
    setForm({ processoId: '', item: '', observacao: '' })
    await carregar()
  }

  async function mudar(id: number, status: string) {
    await api.patch(`/conformidades/${id}/status`, { status })
    await carregar()
  }

  return (
    <>
      <header className="page-header">
        <div><span className="eyebrow">QUALIDADE E CONTROLE</span><h2>Conformidades</h2></div>
      </header>

      <section className="grid-two">
        <form className="panel form" onSubmit={submit}>
          <h3>Novo item</h3>

          <label>
            Processo
            <select
              required
              value={form.processoId}
              onChange={e => setForm({ ...form, processoId: e.target.value })}
            >
              <option value="">Selecione</option>
              {processos.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
            </select>
          </label>

          <label>
            Item
            <input
              required
              value={form.item}
              onChange={e => setForm({ ...form, item: e.target.value })}
            />
          </label>

          <label>
            Observação
            <textarea
              value={form.observacao}
              onChange={e => setForm({ ...form, observacao: e.target.value })}
            />
          </label>

          <button>Cadastrar item</button>
        </form>

        <section className="panel">
          <h3>Checklist de conformidade</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Item</th><th>Processo</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {itens.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.item}</strong><small>{c.observacao}</small></td>
                    <td>{c.processo}</td>
                    <td><StatusBadge value={c.status} /></td>
                    <td>
                      <div className="actions">
                        <button className="link" onClick={() => mudar(c.id, 'CONFORME')}>Conforme</button>
                        <button className="link danger-text" onClick={() => mudar(c.id, 'NAO_CONFORME')}>Não conforme</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  )
}
