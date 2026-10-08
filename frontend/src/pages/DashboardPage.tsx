import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Dashboard } from '../types'

const initial: Dashboard = {
  processosAtivos: 0,
  processosConcluidos: 0,
  tarefasEmAtraso: 0,
  naoConformidades: 0,
}

export default function DashboardPage() {
  const [data, setData] = useState(initial)

  useEffect(() => {
    api.get<Dashboard>('/dashboard').then(({ data }) => setData(data))
  }, [])

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h2>Dashboard</h2>
          <p>Acompanhe processos, prazos e itens de conformidade.</p>
        </div>
      </header>

      <section className="cards">
        <article className="card"><strong>{data.processosAtivos}</strong><span>Processos ativos</span></article>
        <article className="card"><strong>{data.processosConcluidos}</strong><span>Concluídos</span></article>
        <article className="card danger"><strong>{data.tarefasEmAtraso}</strong><span>Tarefas em atraso</span></article>
        <article className="card warning"><strong>{data.naoConformidades}</strong><span>Não conformidades</span></article>
      </section>

      <section className="panel">
        <h3>Sobre o projeto</h3>
        <p>
          Aplicação de portfólio para gestão de processos internos, tarefas e conformidade.
          O backend expõe uma API REST em PHP/Symfony e o frontend utiliza React com TypeScript.
        </p>
      </section>
    </>
  )
}
