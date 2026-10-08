<?php

namespace App\Controller;

use App\Entity\Conformidade;
use App\Repository\ConformidadeRepository;
use App\Repository\ProcessoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/conformidades')]
class ConformidadeController extends ApiController
{
    public function __construct(
        private ConformidadeRepository $repository,
        private ProcessoRepository $processoRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
    ) {}

    #[Route('', methods: ['GET'])]
    public function listar(): JsonResponse
    {
        $itens = $this->repository->findBy([], ['id' => 'DESC']);
        return $this->json(array_map(fn (Conformidade $c) => $this->toArray($c), $itens));
    }

    #[Route('', methods: ['POST'])]
    public function criar(Request $request): JsonResponse
    {
        $dados = $this->body($request->getContent());
        $processo = $this->processoRepository->find((int) ($dados['processoId'] ?? 0));

        if (!$processo) return $this->json(['message' => 'Processo não encontrado.'], 404);

        $item = (new Conformidade())
            ->setProcesso($processo)
            ->setItem((string) ($dados['item'] ?? ''))
            ->setStatus((string) ($dados['status'] ?? 'PENDENTE'))
            ->setObservacao($dados['observacao'] ?? null);

        $errors = $this->validator->validate($item);
        if (count($errors) > 0) return $this->validationErrors($errors);

        $this->entityManager->persist($item);
        $this->entityManager->flush();

        return $this->json($this->toArray($item), 201);
    }

    #[Route('/{id}/status', methods: ['PATCH'])]
    public function status(Conformidade $item, Request $request): JsonResponse
    {
        $dados = $this->body($request->getContent());

        $item
            ->setStatus((string) ($dados['status'] ?? ''))
            ->setObservacao($dados['observacao'] ?? $item->getObservacao());

        $errors = $this->validator->validate($item);
        if (count($errors) > 0) return $this->validationErrors($errors);

        $this->entityManager->flush();

        return $this->json($this->toArray($item));
    }

    private function toArray(Conformidade $c): array
    {
        return [
            'id' => $c->getId(),
            'processoId' => $c->getProcesso()?->getId(),
            'processo' => $c->getProcesso()?->getTitulo(),
            'item' => $c->getItem(),
            'status' => $c->getStatus(),
            'observacao' => $c->getObservacao(),
        ];
    }
}
