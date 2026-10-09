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

        return $this->json(
            array_map(
                fn (Conformidade $item) => $this->toArray($item),
                $itens
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

        $item = (new Conformidade())
            ->setProcesso($processo)
            ->setItem((string) ($dados['item'] ?? ''))
            ->setStatus((string) ($dados['status'] ?? 'PENDENTE'))
            ->setObservacao($dados['observacao'] ?? null);

        $errors = $this->validator->validate($item);

        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $this->entityManager->persist($item);
        $this->entityManager->flush();

        return $this->json(
            $this->toArray($item),
            201
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function atualizar(
        Conformidade $item,
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

            $item->setProcesso($processo);
        }

        if (array_key_exists('item', $dados)) {
            $item->setItem((string) $dados['item']);
        }

        if (array_key_exists('status', $dados)) {
            $item->setStatus((string) $dados['status']);
        }

        if (array_key_exists('observacao', $dados)) {
            $item->setObservacao(
                $dados['observacao'] ?: null
            );
        }

        $errors = $this->validator->validate($item);

        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $this->entityManager->flush();

        return $this->json(
            $this->toArray($item)
        );
    }

    #[Route('/{id}/status', methods: ['PATCH'])]
    public function status(
        Conformidade $item,
        Request $request
    ): JsonResponse {
        try {
            $dados = $this->body($request->getContent());
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        $item->setStatus(
            (string) ($dados['status'] ?? '')
        );

        if (array_key_exists('observacao', $dados)) {
            $item->setObservacao(
                $dados['observacao'] ?: null
            );
        }

        $errors = $this->validator->validate($item);

        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $this->entityManager->flush();

        return $this->json(
            $this->toArray($item)
        );
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function remover(Conformidade $item): JsonResponse
    {
        $this->entityManager->remove($item);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function toArray(Conformidade $item): array
    {
        return [
            'id' => $item->getId(),
            'processoId' => $item->getProcesso()?->getId(),
            'processo' => $item->getProcesso()?->getTitulo(),
            'item' => $item->getItem(),
            'status' => $item->getStatus(),
            'observacao' => $item->getObservacao(),
        ];
    }
}