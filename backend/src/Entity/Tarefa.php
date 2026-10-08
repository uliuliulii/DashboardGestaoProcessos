<?php

namespace App\Entity;

use App\Repository\TarefaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TarefaRepository::class)]
#[ORM\Table(name: 'tarefas')]
class Tarefa
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Processo::class, inversedBy: 'tarefas')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Processo $processo = null;

    #[ORM\Column(length: 150)]
    #[Assert\NotBlank]
    private string $titulo = '';

    #[ORM\Column(length: 30)]
    #[Assert\Choice(choices: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'])]
    private string $status = 'PENDENTE';

    #[ORM\Column(type: 'date_immutable', nullable: true)]
    private ?\DateTimeImmutable $prazo = null;

    public function getId(): ?int { return $this->id; }
    public function getProcesso(): ?Processo { return $this->processo; }
    public function setProcesso(Processo $processo): self { $this->processo = $processo; return $this; }
    public function getTitulo(): string { return $this->titulo; }
    public function setTitulo(string $titulo): self { $this->titulo = trim($titulo); return $this; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = strtoupper($status); return $this; }
    public function getPrazo(): ?\DateTimeImmutable { return $this->prazo; }
    public function setPrazo(?\DateTimeImmutable $prazo): self { $this->prazo = $prazo; return $this; }
}
