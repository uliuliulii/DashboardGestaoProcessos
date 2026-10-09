export type Processo = {
  id: number
  titulo: string
  descricao: string
  responsavel: string
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO'
  criadoEm: string
}

export type Tarefa = {
  id: number
  processoId: number
  processo: string
  titulo: string
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'
  prazo: string | null
}

export type Conformidade = {
  id: number
  processoId: number
  processo: string
  item: string
  status: 'PENDENTE' | 'CONFORME' | 'NAO_CONFORME'
  observacao: string | null
}

export type Dashboard = {
  processosAtivos: number
  processosConcluidos: number
  tarefasEmAtraso: number
  naoConformidades: number
  processosPorStatus: {
    planejados: number
    emAndamento: number
    concluidos: number
  }
  conformidadesPorStatus: {
    pendentes: number
    conformes: number
    naoConformes: number
  }
  tarefasPorStatus: {
    pendentes: number
    emAndamento: number
    concluidas: number
  }
}
