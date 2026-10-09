import { NavLink, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ProcessosPage from './pages/ProcessosPage'
import TarefasPage from './pages/TarefasPage'
import ConformidadesPage from './pages/ConformidadesPage'

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <span className="eyebrow">PROJETO PORTFÓLIO</span>
          <h1>Painel de Gestão de Processos</h1>
        </div>

        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/processos">Processos</NavLink>
          <NavLink to="/tarefas">Tarefas</NavLink>
          <NavLink to="/conformidades">Conformidades</NavLink>
        </nav>

        <div className="sidebar-stack">
          <span>Stack utilizada</span>
          <small>PHP • Symfony • React • PostgreSQL</small>
        </div>

      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/processos" element={<ProcessosPage />} />
          <Route path="/tarefas" element={<TarefasPage />} />
          <Route path="/conformidades" element={<ConformidadesPage />} />
        </Routes>
      </main>
    </div>
  )
}
