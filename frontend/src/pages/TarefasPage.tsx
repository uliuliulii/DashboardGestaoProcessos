import { FormEvent, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Processo, Tarefa } from '../types'
import StatusBadge from '../components/StatusBadge'

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [processos, setProcessos] = useState<Processo[]>([])
  const [form, setForm] = useState({ processoId: '', titulo: '', prazo: '' })

  const carregar = async () => {
    const [t, p] = await Promise.all([
      api.get<Tarefa[]>('/tarefas'),
      api.get<Processo[]>('/processos'),
    ])
    setTarefas(t.data)
    setProcessos(p.data)
  }

  useEffect(() => {
    carregar()
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    await api.post('/tarefas', { ...form, processoId: Number(form.processoId) })
    setForm({ processoId: '', titulo: '', prazo: '' })
    await carregar()
  }

  async function concluir(id: number) {
    await api.patch(`/tarefas/${id}/status`, { status: 'CONCLUIDA' })
    await carregar()
  }

  return (
    <>
      <header className="page-header">
        <div><span className="eyebrow">PRAZOS E EXECUÇÃO</span><h2>Tarefas</h2></div>
      </header>

      <section className="grid-two">
        <form className="panel form" onSubmit={submit}>
          <h3>Nova tarefa</h3>
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
            Título
            <input
              required
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
            />
          </label>

          <label>
            Prazo
            <input
              type="date"
              value={form.prazo}
              onChange={e => setForm({ ...form, prazo: e.target.value })}
            />
          </label>

          <button>Cadastrar tarefa</button>
        </form>

        <section className="panel">
          <h3>Tarefas cadastradas</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tarefa</th><th>Processo</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {tarefas.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.titulo}</strong><small>{t.prazo ?? 'Sem prazo'}</small></td>
                    <td>{t.processo}</td>
                    <td><StatusBadge value={t.status} /></td>
                    <td>
                      {t.status !== 'CONCLUIDA' && (
                        <button className="link" onClick={() => concluir(t.id)}>Concluir</button>
                      )}
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
