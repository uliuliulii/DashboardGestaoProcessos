import { FormEvent, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Conformidade, Processo } from '../types'
import StatusBadge from '../components/StatusBadge'

const formularioInicial = {
  processoId: '',
  item: '',
  observacao: '',
  status: 'PENDENTE',
}

export default function ConformidadesPage() {
  const [itens, setItens] = useState<Conformidade[]>([])
  const [processos, setProcessos] = useState<Processo[]>([])
  const [form, setForm] = useState(formularioInicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [erro, setErro] = useState('')

  const carregar = async () => {
    const [conformidadesResponse, processosResponse] =
      await Promise.all([
        api.get<Conformidade[]>('/conformidades'),
        api.get<Processo[]>('/processos'),
      ])

    setItens(conformidadesResponse.data)
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
      item: form.item,
      observacao: form.observacao,
      status: form.status,
    }

    try {
      if (editandoId !== null) {
        await api.put(
          `/conformidades/${editandoId}`,
          dados
        )
      } else {
        await api.post('/conformidades', dados)
      }

      limparFormulario()
      await carregar()
    } catch {
      setErro(
        editandoId !== null
          ? 'Não foi possível atualizar a conformidade.'
          : 'Não foi possível cadastrar a conformidade.'
      )
    }
  }

  function editar(conformidade: Conformidade) {
    setEditandoId(conformidade.id)

    setForm({
      processoId: String(conformidade.processoId),
      item: conformidade.item,
      observacao: conformidade.observacao ?? '',
      status: conformidade.status,
    })

    setErro('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function mudarStatus(
    id: number,
    status: 'CONFORME' | 'NAO_CONFORME'
  ) {
    try {
      await api.patch(
        `/conformidades/${id}/status`,
        { status }
      )

      await carregar()
    } catch {
      alert(
        'Não foi possível alterar o status da conformidade.'
      )
    }
  }

  async function excluir(
    conformidade: Conformidade
  ) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o item "${conformidade.item}"?`
    )

    if (!confirmou) return

    try {
      await api.delete(
        `/conformidades/${conformidade.id}`
      )

      if (editandoId === conformidade.id) {
        limparFormulario()
      }

      await carregar()
    } catch {
      alert(
        'Não foi possível excluir a conformidade.'
      )
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">
            QUALIDADE E CONTROLE
          </span>

          <h2>Conformidades</h2>
        </div>
      </header>

      <section className="grid-two">
        <form
          className="panel form"
          onSubmit={submit}
        >
          <h3>
            {editandoId !== null
              ? 'Editar conformidade'
              : 'Novo item'}
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
              <option value="">
                Selecione
              </option>

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
            Item

            <input
              required
              value={form.item}
              onChange={event =>
                setForm({
                  ...form,
                  item: event.target.value,
                })
              }
            />
          </label>

          <label>
            Observação

            <textarea
              value={form.observacao}
              onChange={event =>
                setForm({
                  ...form,
                  observacao: event.target.value,
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

                <option value="CONFORME">
                  Conforme
                </option>

                <option value="NAO_CONFORME">
                  Não conforme
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
              : 'Cadastrar item'}
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
          <h3>
            Checklist de conformidade
          </h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Processo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {itens.map(conformidade => (
                  <tr key={conformidade.id}>
                    <td>
                      <strong>
                        {conformidade.item}
                      </strong>

                      {conformidade.observacao && (
                        <small>
                          {conformidade.observacao}
                        </small>
                      )}
                    </td>

                    <td>
                      {conformidade.processo}
                    </td>

                    <td>
                      <StatusBadge
                        value={conformidade.status}
                      />
                    </td>

                    <td className="actions-cell">
                      <div className="actions-clean">
                        <div className="actions-secondary">
                          <button
                            type="button"
                            className="action-link"
                            onClick={() =>
                              editar(conformidade)
                            }
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            className="action-link action-link-danger"
                            onClick={() =>
                              excluir(conformidade)
                            }
                          >
                            🗑 Excluir
                          </button>
                        </div>

                        <div>
                          {conformidade.status ===
                          'CONFORME' ? (
                            <button
                              type="button"
                              className="status-action status-action-danger"
                              onClick={() =>
                                mudarStatus(
                                  conformidade.id,
                                  'NAO_CONFORME'
                                )
                              }
                            >
                              ⚠ Marcar não conforme
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="status-action status-action-success"
                              onClick={() =>
                                mudarStatus(
                                  conformidade.id,
                                  'CONFORME'
                                )
                              }
                            >
                              ✓ Marcar como conforme
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {itens.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      Nenhum item de conformidade cadastrado.
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