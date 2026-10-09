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

        return $this->json(
            array_map(
                fn (Tarefa $tarefa) => $this->toArray($tarefa),
                $tarefas
            )
        );
    }

    #[Route('', methods: ['POST'])]
    public function criar(Request $request): JsonResponse
    {
        try {
            $dados = $this->body($request->getContent());
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        $processo = $this->processoRepository->find(
            (int) ($dados['processoId'] ?? 0)
        );

        if (!$processo) {
            return $this->json(
                ['message' => 'Processo não encontrado.'],
                404
            );
        }

        $tarefa = (new Tarefa())
            ->setProcesso($processo)
            ->setTitulo((string) ($dados['titulo'] ?? ''))
            ->setStatus((string) ($dados['status'] ?? 'PENDENTE'));

        try {
            $tarefa->setPrazo(
                !empty($dados['prazo'])
                    ? new \DateTimeImmutable((string) $dados['prazo'])
                    : null
            );
        } catch (\Exception) {
            return $this->json(
                ['message' => 'Prazo inválido.'],
                422
            );
        }

        $errors = $this->validator->validate($tarefa);

        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $this->entityManager->persist($tarefa);
        $this->entityManager->flush();

        return $this->json(
            $this->toArray($tarefa),
            201
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function atualizar(
        Tarefa $tarefa,
        Request $request
    ): JsonResponse {
        try {
            $dados = $this->body($request->getContent());
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        if (array_key_exists('processoId', $dados)) {
            $processo = $this->processoRepository->find(
                (int) $dados['processoId']
            );

            if (!$processo) {
                return $this->json(
                    ['message' => 'Processo não encontrado.'],
                    404
                );
            }

            $tarefa->setProcesso($processo);
        }

        if (array_key_exists('titulo', $dados)) {
            $tarefa->setTitulo((string) $dados['titulo']);
        }

        if (array_key_exists('status', $dados)) {
            $tarefa->setStatus((string) $dados['status']);
        }

        if (array_key_exists('prazo', $dados)) {
            try {
                $tarefa->setPrazo(
                    !empty($dados['prazo'])
                        ? new \DateTimeImmutable((string) $dados['prazo'])
                        : null
                );
            } catch (\Exception) {
                return $this->json(
                    ['message' => 'Prazo inválido.'],
                    422
                );
            }
        }

        $errors = $this->validator->validate($tarefa);

        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $this->entityManager->flush();

        return $this->json(
            $this->toArray($tarefa)
        );
    }

    #[Route('/{id}/status', methods: ['PATCH'])]
    public function status(
        Tarefa $tarefa,
        Request $request
    ): JsonResponse {
        try {
            $dados = $this->body($request->getContent());
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        $tarefa->setStatus(
            (string) ($dados['status'] ?? '')
        );

        $errors = $this->validator->validate($tarefa);

        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $this->entityManager->flush();

        return $this->json(
            $this->toArray($tarefa)
        );
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function remover(Tarefa $tarefa): JsonResponse
    {
        $this->entityManager->remove($tarefa);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function toArray(Tarefa $tarefa): array
    {
        return [
            'id' => $tarefa->getId(),
            'processoId' => $tarefa->getProcesso()?->getId(),
            'processo' => $tarefa->getProcesso()?->getTitulo(),
            'titulo' => $tarefa->getTitulo(),
            'status' => $tarefa->getStatus(),
            'prazo' => $tarefa->getPrazo()?->format('Y-m-d'),
        ];
    }
}