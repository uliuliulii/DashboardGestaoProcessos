<?php

namespace App\Controller;

use App\Entity\Processo;
use App\Repository\ProcessoRepository;
use App\Service\ProcessoService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/processos')]
class ProcessoController extends ApiController
{
    public function __construct(
        private ProcessoRepository $repository,
        private ProcessoService $service,
        private ValidatorInterface $validator,
    ) {}

    #[Route('', methods: ['GET'])]
    public function listar(): JsonResponse
    {
        return $this->json(array_map(
            fn (Processo $p) => $this->toArray($p),
            $this->repository->findBy([], ['id' => 'DESC'])
        ));
    }

    #[Route('', methods: ['POST'])]
    public function criar(Request $request): JsonResponse
    {
        try {
            $dados = $this->body($request->getContent());
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        $processo = (new Processo())
            ->setTitulo((string) ($dados['titulo'] ?? ''))
            ->setDescricao((string) ($dados['descricao'] ?? ''))
            ->setResponsavel((string) ($dados['responsavel'] ?? ''))
            ->setStatus((string) ($dados['status'] ?? 'PLANEJADO'));

        $errors = $this->validator->validate($processo);
        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        $processo = $this->service->criar(
            $processo->getTitulo(),
            $processo->getDescricao(),
            $processo->getResponsavel(),
            $processo->getStatus()
        );

        return $this->json($this->toArray($processo), 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function atualizar(Processo $processo, Request $request): JsonResponse
    {
        try {
            $dados = $this->body($request->getContent());
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        $this->service->atualizar($processo, $dados);

        $errors = $this->validator->validate($processo);
        if (count($errors) > 0) {
            return $this->validationErrors($errors);
        }

        return $this->json($this->toArray($processo));
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function remover(Processo $processo): JsonResponse
    {
        $this->service->remover($processo);
        return new JsonResponse(null, 204);
    }

    private function toArray(Processo $processo): array
    {
        return [
            'id' => $processo->getId(),
            'titulo' => $processo->getTitulo(),
            'descricao' => $processo->getDescricao(),
            'responsavel' => $processo->getResponsavel(),
            'status' => $processo->getStatus(),
            'criadoEm' => $processo->getCriadoEm()->format(DATE_ATOM),
        ];
    }
}
