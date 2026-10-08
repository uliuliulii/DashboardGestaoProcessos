<?php

namespace App\Service;

use App\Entity\Processo;
use Doctrine\ORM\EntityManagerInterface;

class ProcessoService
{
    public function __construct(private EntityManagerInterface $entityManager) {}

    public function criar(string $titulo, string $descricao, string $responsavel, string $status): Processo
    {
        $processo = (new Processo())
            ->setTitulo($titulo)
            ->setDescricao($descricao)
            ->setResponsavel($responsavel)
            ->setStatus($status);

        $this->entityManager->persist($processo);
        $this->entityManager->flush();

        return $processo;
    }

    public function atualizar(Processo $processo, array $dados): Processo
    {
        if (array_key_exists('titulo', $dados)) $processo->setTitulo((string) $dados['titulo']);
        if (array_key_exists('descricao', $dados)) $processo->setDescricao((string) $dados['descricao']);
        if (array_key_exists('responsavel', $dados)) $processo->setResponsavel((string) $dados['responsavel']);
        if (array_key_exists('status', $dados)) $processo->setStatus((string) $dados['status']);

        $this->entityManager->flush();

        return $processo;
    }

    public function remover(Processo $processo): void
    {
        $this->entityManager->remove($processo);
        $this->entityManager->flush();
    }
}
