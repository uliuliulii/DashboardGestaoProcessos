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
            fn ($t) => $t->getPrazo()
                && $t->getPrazo() < $hoje
                && $t->getStatus() !== 'CONCLUIDA'
        );

        return $this->json([
            'processosAtivos' => $processos->count(['status' => 'EM_ANDAMENTO']),
            'processosConcluidos' => $processos->count(['status' => 'CONCLUIDO']),
            'tarefasEmAtraso' => count($tarefasEmAtraso),
            'naoConformidades' => $conformidades->count(['status' => 'NAO_CONFORME']),
        ]);
    }
}
