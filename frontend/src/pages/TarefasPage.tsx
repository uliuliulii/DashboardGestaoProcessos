import { FormEvent, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Processo, Tarefa } from '../types'
import StatusBadge from '../components/StatusBadge'

function formatarData(data: string | null) {
  if (!data) return 'Sem prazo'

  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

const formularioInicial = {
  processoId: '',
  titulo: '',
  prazo: '',
  status: 'PENDENTE',
}

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [processos, setProcessos] = useState<Processo[]>([])
  const [form, setForm] = useState(formularioInicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [erro, setErro] = useState('')

  const carregar = async () => {
    const [tarefasResponse, processosResponse] = await Promise.all([
      api.get<Tarefa[]>('/tarefas'),
      api.get<Processo[]>('/processos'),
    ])

    setTarefas(tarefasResponse.data)
    setProcessos(processosResponse.data)
  }

  useEffect(() => {
    carregar()
  }, [])

  function limparFormulario() {
    setForm(formularioInicial)
    setEditandoId(null)
    setErro('')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setErro('')

    const dados = {
      processoId: Number(form.processoId),
      titulo: form.titulo,
      prazo: form.prazo,
      status: form.status,
    }

    try {
      if (editandoId !== null) {
        await api.put(`/tarefas/${editandoId}`, dados)
      } else {
        await api.post('/tarefas', dados)
      }

      limparFormulario()
      await carregar()
    } catch {
      setErro(
        editandoId !== null
          ? 'Não foi possível atualizar a tarefa.'
          : 'Não foi possível cadastrar a tarefa.'
      )
    }
  }

  function editar(tarefa: Tarefa) {
    setEditandoId(tarefa.id)

    setForm({
      processoId: String(tarefa.processoId),
      titulo: tarefa.titulo,
      prazo: tarefa.prazo ?? '',
      status: tarefa.status,
    })

    setErro('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function alterarStatus(
    id: number,
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'
  ) {
    try {
      await api.patch(`/tarefas/${id}/status`, {
        status,
      })

      await carregar()
    } catch {
      alert('Não foi possível alterar o status da tarefa.')
    }
  }

  async function excluir(tarefa: Tarefa) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`
    )

    if (!confirmou) return

    try {
      await api.delete(`/tarefas/${tarefa.id}`)

      if (editandoId === tarefa.id) {
        limparFormulario()
      }

      await carregar()
    } catch {
      alert('Não foi possível excluir a tarefa.')
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">PRAZOS E EXECUÇÃO</span>
          <h2>Tarefas</h2>
        </div>
      </header>

      <section className="grid-two">
        <form className="panel form" onSubmit={submit}>
          <h3>
            {editandoId !== null
              ? 'Editar tarefa'
              : 'Nova tarefa'}
          </h3>

          <label>
            Processo

            <select
              required
              value={form.processoId}
              onChange={event =>
                setForm({
                  ...form,
                  processoId: event.target.value,
                })
              }
            >
              <option value="">Selecione</option>

              {processos.map(processo => (
                <option
                  key={processo.id}
                  value={processo.id}
                >
                  {processo.titulo}
                </option>
              ))}
            </select>
          </label>

          <label>
            Título

            <input
              required
              value={form.titulo}
              onChange={event =>
                setForm({
                  ...form,
                  titulo: event.target.value,
                })
              }
            />
          </label>

          <label>
            Prazo

            <input
              type="date"
              value={form.prazo}
              onChange={event =>
                setForm({
                  ...form,
                  prazo: event.target.value,
                })
              }
            />
          </label>

          {editandoId !== null && (
            <label>
              Status

              <select
                value={form.status}
                onChange={event =>
                  setForm({
                    ...form,
                    status: event.target.value,
                  })
                }
              >
                <option value="PENDENTE">
                  Pendente
                </option>

                <option value="EM_ANDAMENTO">
                  Em andamento
                </option>

                <option value="CONCLUIDA">
                  Concluída
                </option>
              </select>
            </label>
          )}

          {erro && (
            <p className="error">
              {erro}
            </p>
          )}

          <button type="submit">
            {editandoId !== null
              ? 'Salvar alterações'
              : 'Cadastrar tarefa'}
          </button>

          {editandoId !== null && (
            <button
              type="button"
              className="secondary-button"
              onClick={limparFormulario}
            >
              Cancelar edição
            </button>
          )}
        </form>

        <section className="panel">
          <h3>Tarefas cadastradas</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Processo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {tarefas.map(tarefa => (
                  <tr key={tarefa.id}>
                    <td>
                      <strong>
                        {tarefa.titulo}
                      </strong>

                      <small>
                        {formatarData(tarefa.prazo)}
                      </small>
                    </td>

                    <td>
                      {tarefa.processo}
                    </td>

                    <td>
                      <StatusBadge
                        value={tarefa.status}
                      />
                    </td>

                    <td className="actions-cell">
                      <div className="actions-clean">
                        <div className="actions-secondary">
                          <button
                            type="button"
                            className="action-link"
                            onClick={() => editar(tarefa)}
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            className="action-link action-link-danger"
                            onClick={() => excluir(tarefa)}
                          >
                            🗑 Excluir
                          </button>
                        </div>

                        <div>
                          {tarefa.status === 'PENDENTE' && (
                            <button
                              type="button"
                              className="status-action status-action-primary"
                              onClick={() =>
                                alterarStatus(
                                  tarefa.id,
                                  'EM_ANDAMENTO'
                                )
                              }
                            >
                              ▶ Iniciar tarefa
                            </button>
                          )}

                          {tarefa.status === 'EM_ANDAMENTO' && (
                            <button
                              type="button"
                              className="status-action status-action-success"
                              onClick={() =>
                                alterarStatus(
                                  tarefa.id,
                                  'CONCLUIDA'
                                )
                              }
                            >
                              ✓ Concluir tarefa
                            </button>
                          )}

                          {tarefa.status === 'CONCLUIDA' && (
                            <span className="task-finished">
                              ✓ Finalizada
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {tarefas.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      Nenhuma tarefa cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  )
}