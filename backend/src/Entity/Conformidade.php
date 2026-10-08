<?php

namespace App\Entity;

use App\Repository\ConformidadeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ConformidadeRepository::class)]
#[ORM\Table(name: 'conformidades')]
class Conformidade
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Processo::class, inversedBy: 'conformidades')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Processo $processo = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    private string $item = '';

    #[ORM\Column(length: 30)]
    #[Assert\Choice(choices: ['PENDENTE', 'CONFORME', 'NAO_CONFORME'])]
    private string $status = 'PENDENTE';

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $observacao = null;

    public function getId(): ?int { return $this->id; }
    public function getProcesso(): ?Processo { return $this->processo; }
    public function setProcesso(Processo $processo): self { $this->processo = $processo; return $this; }
    public function getItem(): string { return $this->item; }
    public function setItem(string $item): self { $this->item = trim($item); return $this; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = strtoupper($status); return $this; }
    public function getObservacao(): ?string { return $this->observacao; }
    public function setObservacao(?string $observacao): self { $this->observacao = $observacao ? trim($observacao) : null; return $this; }
}
