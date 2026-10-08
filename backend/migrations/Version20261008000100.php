<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261008000100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Cria tabelas de processos, tarefas e conformidades';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE processos (
            id SERIAL NOT NULL,
            titulo VARCHAR(150) NOT NULL,
            descricao TEXT NOT NULL,
            responsavel VARCHAR(80) NOT NULL,
            status VARCHAR(30) NOT NULL,
            criado_em TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            PRIMARY KEY(id)
        )');

        $this->addSql('CREATE TABLE tarefas (
            id SERIAL NOT NULL,
            processo_id INT NOT NULL,
            titulo VARCHAR(150) NOT NULL,
            status VARCHAR(30) NOT NULL,
            prazo DATE DEFAULT NULL,
            PRIMARY KEY(id)
        )');

        $this->addSql('CREATE INDEX IDX_TAREFA_PROCESSO ON tarefas (processo_id)');
        $this->addSql('ALTER TABLE tarefas ADD CONSTRAINT FK_TAREFA_PROCESSO FOREIGN KEY (processo_id) REFERENCES processos (id) ON DELETE CASCADE');

        $this->addSql('CREATE TABLE conformidades (
            id SERIAL NOT NULL,
            processo_id INT NOT NULL,
            item VARCHAR(180) NOT NULL,
            status VARCHAR(30) NOT NULL,
            observacao TEXT DEFAULT NULL,
            PRIMARY KEY(id)
        )');

        $this->addSql('CREATE INDEX IDX_CONFORMIDADE_PROCESSO ON conformidades (processo_id)');
        $this->addSql('ALTER TABLE conformidades ADD CONSTRAINT FK_CONFORMIDADE_PROCESSO FOREIGN KEY (processo_id) REFERENCES processos (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE conformidades');
        $this->addSql('DROP TABLE tarefas');
        $this->addSql('DROP TABLE processos');
    }
}
