import { FormEvent, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Processo } from '../types'
import StatusBadge from '../components/StatusBadge'

const initialForm = {
  titulo: '',
  descricao: '',
  responsavel: '',
  status: 'PLANEJADO',
}

export default function ProcessosPage() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [form, setForm] = useState(initialForm)
  const [erro, setErro] = useState('')

  const carregar = () =>
    api.get<Processo[]>('/processos').then(({ data }) => setProcessos(data))

  useEffect(() => {
    carregar()
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setErro('')

    try {
      await api.post('/processos', form)
      setForm(initialForm)
      await carregar()
    } catch {
      setErro('Não foi possível cadastrar. Revise os dados e tente novamente.')
    }
  }

  async function remover(id: number) {
    if (!confirm('Deseja remover este processo?')) return
    await api.delete(`/processos/${id}`)
    await carregar()
  }

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">CADASTRO E ACOMPANHAMENTO</span>
          <h2>Processos</h2>
        </div>
      </header>

      <section className="grid-two">
        <form className="panel form" onSubmit={submit}>
          <h3>Novo processo</h3>

          <label>
            Título
            <input
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </label>

          <label>
            Responsável
            <input
              value={form.responsavel}
              onChange={e => setForm({ ...form, responsavel: e.target.value })}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
              required
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="PLANEJADO">Planejado</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
          </label>

          {erro && <p className="error">{erro}</p>}
          <button type="submit">Cadastrar processo</button>
        </form>

        <section className="panel">
          <h3>Processos cadastrados</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Processo</th><th>Responsável</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {processos.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.titulo}</strong><small>{p.descricao}</small></td>
                    <td>{p.responsavel}</td>
                    <td><StatusBadge value={p.status} /></td>
                    <td><button className="link danger-text" onClick={() => remover(p.id)}>Excluir</button></td>
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
