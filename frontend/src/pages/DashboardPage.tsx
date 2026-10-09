import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../services/api'
import type { Dashboard } from '../types'

const initial: Dashboard = {
  processosAtivos: 0,
  processosConcluidos: 0,
  tarefasEmAtraso: 0,
  naoConformidades: 0,

  processosPorStatus: {
    planejados: 0,
    emAndamento: 0,
    concluidos: 0,
  },

  conformidadesPorStatus: {
    pendentes: 0,
    conformes: 0,
    naoConformes: 0,
  },

  tarefasPorStatus: {
    pendentes: 0,
    emAndamento: 0,
    concluidas: 0,
  },
}

const CORES_PROCESSOS = [
  '#7F9BCF', // Planejados
  '#3563E9', // Em andamento
  '#3FA36C', // Concluídos
]

const CORES_CONFORMIDADES = [
  '#7F9BCF', // Pendentes
  '#3FA36C', // Conformes
  '#D94F5C', // Não conformes
]

const CORES_TAREFAS = [
  '#7F9BCF', // Pendentes
  '#3563E9', // Em andamento
  '#3FA36C', // Concluídas
]


export default function DashboardPage() {
  const [data, setData] = useState(initial)

  useEffect(() => {
    api.get<Dashboard>('/dashboard').then(({ data }) => {
      setData(data)
    })
  }, [])

  const processos = useMemo(
    () => [
      {
        status: 'Planejados',
        quantidade: data.processosPorStatus.planejados,
      },
      {
        status: 'Em andamento',
        quantidade: data.processosPorStatus.emAndamento,
      },
      {
        status: 'Concluídos',
        quantidade: data.processosPorStatus.concluidos,
      },
    ],
    [data]
  )

  const conformidades = useMemo(
    () => [
      {
        name: 'Pendentes',
        value: data.conformidadesPorStatus.pendentes,
      },
      {
        name: 'Conformes',
        value: data.conformidadesPorStatus.conformes,
      },
      {
        name: 'Não conformes',
        value: data.conformidadesPorStatus.naoConformes,
      },
    ],
    [data]
  )

  const tarefas = useMemo(
    () => [
      {
        status: 'Pendentes',
        quantidade: data.tarefasPorStatus.pendentes,
      },
      {
        status: 'Em andamento',
        quantidade: data.tarefasPorStatus.emAndamento,
      },
      {
        status: 'Concluídas',
        quantidade: data.tarefasPorStatus.concluidas,
      },
    ],
    [data]
  )

  const totalConformidades = conformidades.reduce(
    (total, item) => total + item.value,
    0
  )

  const totalTarefas = tarefas.reduce(
    (total, item) => total + item.quantidade,
    0
  )

  return (
    <>
      <header className="page-header dashboard-header">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h2>Dashboard</h2>
          <p>
            Acompanhe processos, tarefas e conformidades em um só lugar.
          </p>
        </div>
      </header>

      <section className="cards dashboard-kpis">
        <article className="card kpi-card">
          <div className="kpi-icon kpi-blue">↗</div>

          <div>
            <span>Processos ativos</span>
            <strong>{data.processosAtivos}</strong>
          </div>
        </article>

        <article className="card kpi-card">
          <div className="kpi-icon kpi-green">✓</div>

          <div>
            <span>Processos concluídos</span>
            <strong>{data.processosConcluidos}</strong>
          </div>
        </article>

        <article className="card kpi-card">
          <div className="kpi-icon kpi-red">!</div>

          <div>
            <span>Tarefas em atraso</span>
            <strong>{data.tarefasEmAtraso}</strong>
          </div>
        </article>

        <article className="card kpi-card">
          <div className="kpi-icon kpi-yellow">⚠</div>

          <div>
            <span>Não conformidades</span>
            <strong>{data.naoConformidades}</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-charts">
        <article className="panel chart-panel modern-chart-card">
          <div className="chart-title">
            <div>
              <span className="eyebrow">PROCESSOS</span>
              <h3>Processos por status</h3>
              <p>Distribuição atual dos processos cadastrados.</p>
            </div>
          </div>

          <div className="chart-container chart-container-medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processos}
                margin={{
                  top: 12,
                  right: 8,
                  left: -12,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e8ebf2"
                />

                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: '#667085',
                    fontSize: 12,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: '#8a94a8',
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: 'rgba(70, 102, 200, 0.05)',
                  }}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #e4e8f0',
                    boxShadow:
                      '0 8px 24px rgba(31, 42, 68, 0.08)',
                  }}
                />

                <Bar
                  dataKey="quantidade"
                  name="Quantidade"
                  radius={[9, 9, 3, 3]}
                  maxBarSize={64}
                >
                  {processos.map((item, index) => (
                    <Cell
                      key={item.status}
                      fill={
                        CORES_PROCESSOS[
                          index % CORES_PROCESSOS.length
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel chart-panel modern-chart-card">
          <div className="chart-title">
            <div>
              <span className="eyebrow">CONFORMIDADE</span>
              <h3>Conformidades por status</h3>
              <p>Visão rápida dos itens avaliados.</p>
            </div>
          </div>

          <div className="chart-container chart-container-medium donut-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conformidades}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={64}
                  outerRadius={96}
                  paddingAngle={4}
                  stroke="none"
                >
                  {conformidades.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={
                        CORES_CONFORMIDADES[
                          index % CORES_CONFORMIDADES.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #e4e8f0',
                    boxShadow:
                      '0 8px 24px rgba(31, 42, 68, 0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>{totalConformidades}</strong>
              <span>itens</span>
            </div>
          </div>

          <div className="custom-legend">
            {conformidades.map((item, index) => (
              <div
                key={item.name}
                className="custom-legend-item"
              >
                <span
                  className="custom-legend-dot"
                  style={{
                    backgroundColor:
                      CORES_CONFORMIDADES[
                        index % CORES_CONFORMIDADES.length
                      ],
                  }}
                />

                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel chart-panel modern-chart-card task-chart-card">
        <div className="chart-title chart-title-row">
          <div>
            <span className="eyebrow">EXECUÇÃO</span>
            <h3>Distribuição das tarefas</h3>
            <p>Quantidade de tarefas por estágio de execução.</p>
          </div>

          <div className="task-summary">
            <span>
              Total: <strong>{totalTarefas}</strong>
            </span>
          </div>
        </div>

        <div className="chart-container chart-container-task">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tarefas}
              layout="vertical"
              margin={{
                top: 8,
                right: 22,
                left: 12,
                bottom: 8,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                horizontal={false}
                stroke="#e8ebf2"
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: '#8a94a8',
                  fontSize: 12,
                }}
              />

              <YAxis
                type="category"
                dataKey="status"
                width={115}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: '#667085',
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(96, 123, 189, 0.05)',
                }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #e4e8f0',
                  boxShadow:
                    '0 8px 24px rgba(31, 42, 68, 0.08)',
                }}
              />

              <Bar
                dataKey="quantidade"
                name="Quantidade"
                radius={[0, 9, 9, 0]}
                maxBarSize={28}
              >
                {tarefas.map((item, index) => (
                  <Cell
                    key={item.status}
                    fill={
                      CORES_TAREFAS[
                        index % CORES_TAREFAS.length
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )
}