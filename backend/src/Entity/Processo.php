<?php

namespace App\Entity;

use App\Repository\ProcessoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProcessoRepository::class)]
#[ORM\Table(name: 'processos')]
class Processo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 150)]
    private string $titulo = '';

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    private string $descricao = '';

    #[ORM\Column(length: 80)]
    #[Assert\NotBlank]
    private string $responsavel = '';

    #[ORM\Column(length: 30)]
    #[Assert\Choice(choices: ['PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO'])]
    private string $status = 'PLANEJADO';

    #[ORM\Column]
    private \DateTimeImmutable $criadoEm;

    /** @var Collection<int, Tarefa> */
    #[ORM\OneToMany(mappedBy: 'processo', targetEntity: Tarefa::class, orphanRemoval: true)]
    private Collection $tarefas;

    /** @var Collection<int, Conformidade> */
    #[ORM\OneToMany(mappedBy: 'processo', targetEntity: Conformidade::class, orphanRemoval: true)]
    private Collection $conformidades;

    public function __construct()
    {
        $this->criadoEm = new \DateTimeImmutable();
        $this->tarefas = new ArrayCollection();
        $this->conformidades = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitulo(): string { return $this->titulo; }
    public function setTitulo(string $titulo): self { $this->titulo = trim($titulo); return $this; }
    public function getDescricao(): string { return $this->descricao; }
    public function setDescricao(string $descricao): self { $this->descricao = trim($descricao); return $this; }
    public function getResponsavel(): string { return $this->responsavel; }
    public function setResponsavel(string $responsavel): self { $this->responsavel = trim($responsavel); return $this; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = strtoupper($status); return $this; }
    public function getCriadoEm(): \DateTimeImmutable { return $this->criadoEm; }
}
