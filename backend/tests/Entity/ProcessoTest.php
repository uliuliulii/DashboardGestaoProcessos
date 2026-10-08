<?php

namespace App\Tests\Entity;

use App\Entity\Processo;
use PHPUnit\Framework\TestCase;

class ProcessoTest extends TestCase
{
    public function testDeveNormalizarStatusParaMaiusculo(): void
    {
        $processo = (new Processo())->setStatus('em_andamento');

        self::assertSame('EM_ANDAMENTO', $processo->getStatus());
    }

    public function testDeveRemoverEspacosDoTitulo(): void
    {
        $processo = (new Processo())->setTitulo('  Auditoria interna  ');

        self::assertSame('Auditoria interna', $processo->getTitulo());
    }
}
