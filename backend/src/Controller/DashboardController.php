<?php

namespace App\Controller;

use App\Repository\ConformidadeRepository;
use App\Repository\ProcessoRepository;
use App\Repository\TarefaRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends ApiController
{
    #[Route('/api/dashboard', methods: ['GET'])]
    public function index(
        ProcessoRepository $processos,
        TarefaRepository $tarefas,
        ConformidadeRepository $conformidades,
    ): JsonResponse {
        $hoje = new \DateTimeImmutable('today');

        $tarefasEmAtraso = array_filter(
            $tarefas->findAll(),
            fn ($tarefa) =>
                $tarefa->getPrazo()
                && $tarefa->getPrazo() < $hoje
                && $tarefa->getStatus() !== 'CONCLUIDA'
        );

        return $this->json([
            'processosAtivos' => $processos->count(['status' => 'EM_ANDAMENTO']),
            'processosConcluidos' => $processos->count(['status' => 'CONCLUIDO']),
            'tarefasEmAtraso' => count($tarefasEmAtraso),
            'naoConformidades' => $conformidades->count(['status' => 'NAO_CONFORME']),
            'processosPorStatus' => [
                'planejados' => $processos->count(['status' => 'PLANEJADO']),
                'emAndamento' => $processos->count(['status' => 'EM_ANDAMENTO']),
                'concluidos' => $processos->count(['status' => 'CONCLUIDO']),
            ],
            'conformidadesPorStatus' => [
                'pendentes' => $conformidades->count(['status' => 'PENDENTE']),
                'conformes' => $conformidades->count(['status' => 'CONFORME']),
                'naoConformes' => $conformidades->count(['status' => 'NAO_CONFORME']),
            ],
            'tarefasPorStatus' => [
                'pendentes' => $tarefas->count(['status' => 'PENDENTE']),
                'emAndamento' => $tarefas->count(['status' => 'EM_ANDAMENTO']),
                'concluidas' => $tarefas->count(['status' => 'CONCLUIDA']),
            ],
        ]);
    }
}
