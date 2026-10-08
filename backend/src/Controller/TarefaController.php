<?php

namespace App\Controller;

use App\Entity\Tarefa;
use App\Repository\ProcessoRepository;
use App\Repository\TarefaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/tarefas')]
class TarefaController extends ApiController
{
    public function __construct(
        private TarefaRepository $repository,
        private ProcessoRepository $processoRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
    ) {}

    #[Route('', methods: ['GET'])]
    public function listar(): JsonResponse
    {
        $tarefas = $this->repository->findBy([], ['id' => 'DESC']);
        return $this->json(array_map(fn (Tarefa $t) => $this->toArray($t), $tarefas));
    }

    #[Route('', methods: ['POST'])]
    public function criar(Request $request): JsonResponse
    {
        $dados = $this->body($request->getContent());
        $processo = $this->processoRepository->find((int) ($dados['processoId'] ?? 0));

        if (!$processo) {
            return $this->json(['message' => 'Processo não encontrado.'], 404);
        }

        $tarefa = (new Tarefa())
            ->setProcesso($processo)
            ->setTitulo((string) ($dados['titulo'] ?? ''))
            ->setStatus((string) ($dados['status'] ?? 'PENDENTE'));

        if (!empty($dados['prazo'])) {
            $tarefa->setPrazo(new \DateTimeImmutable((string) $dados['prazo']));
        }

        $errors = $this->validator->validate($tarefa);
        if (count($errors) > 0) return $this->validationErrors($errors);

        $this->entityManager->persist($tarefa);
        $this->entityManager->flush();

        return $this->json($this->toArray($tarefa), 201);
    }

    #[Route('/{id}/status', methods: ['PATCH'])]
    public function status(Tarefa $tarefa, Request $request): JsonResponse
    {
        $dados = $this->body($request->getContent());
        $tarefa->setStatus((string) ($dados['status'] ?? ''));

        $errors = $this->validator->validate($tarefa);
        if (count($errors) > 0) return $this->validationErrors($errors);

        $this->entityManager->flush();

        return $this->json($this->toArray($tarefa));
    }

    private function toArray(Tarefa $t): array
    {
        return [
            'id' => $t->getId(),
            'processoId' => $t->getProcesso()?->getId(),
            'processo' => $t->getProcesso()?->getTitulo(),
            'titulo' => $t->getTitulo(),
            'status' => $t->getStatus(),
            'prazo' => $t->getPrazo()?->format('Y-m-d'),
        ];
    }
}
