import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateManutencao1750350739744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "tipo_manutencao_enum" AS ENUM ('Corretiva', 'Preventiva');
        `);

    await queryRunner.query(`
          CREATE TYPE "categoria_manutencao_enum" AS ENUM ('Eletrica', 'Hidraulica', 'Estrutural', 'Pintura', 'Limpeza', 'Outros');
        `);

    await queryRunner.query(`
          CREATE TYPE "prioridade_manutencao_enum" AS ENUM ('Baixa', 'Media', 'Alta', 'Urgente');
        `);

    await queryRunner.query(`
          CREATE TYPE "status_manutencao_enum" AS ENUM ('Aberta', 'Agendada', 'Em_Andamento', 'Concluida', 'Cancelada');
        `);

    await queryRunner.query(`
          CREATE TABLE "manutencao" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "kitnet_id" uuid NOT NULL,
            "tipo_manutencao" "tipo_manutencao_enum" NOT NULL,
            "categoria" "categoria_manutencao_enum" NOT NULL,
            "prioridade" "prioridade_manutencao_enum" NOT NULL DEFAULT 'Media',
            "titulo" character varying(200) NOT NULL,
            "descricao" text NOT NULL,
            "data_abertura" TIMESTAMP NOT NULL DEFAULT now(),
            "data_agendamento" TIMESTAMP,
            "data_inicio" TIMESTAMP,
            "data_conclusao" TIMESTAMP,
            "custo_estimado" decimal(10,2),
            "custo_real" decimal(10,2),
            "responsavel_execucao" character varying(150),
            "telefone_responsavel" character varying(20),
            "observacoes" text,
            "fotos_antes_urls" text,
            "fotos_depois_urls" text,
            "status_manutencao" "status_manutencao_enum" NOT NULL DEFAULT 'Aberta',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_manutencao" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_KITNET" ON "manutencao" ("kitnet_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_TIPO" ON "manutencao" ("tipo_manutencao");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_CATEGORIA" ON "manutencao" ("categoria");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_PRIORIDADE" ON "manutencao" ("prioridade");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_STATUS" ON "manutencao" ("status_manutencao");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_DATA_ABERTURA" ON "manutencao" ("data_abertura");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_MANUTENCAO_DATA_AGENDAMENTO" ON "manutencao" ("data_agendamento");
        `);

    await queryRunner.query(`
          ALTER TABLE "manutencao" 
          ADD CONSTRAINT "FK_manutencao_kitnet" 
          FOREIGN KEY ("kitnet_id") 
          REFERENCES "kitnet"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manutencao" DROP CONSTRAINT "FK_manutencao_kitnet"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_DATA_AGENDAMENTO"`);
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_DATA_ABERTURA"`);
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_PRIORIDADE"`);
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_CATEGORIA"`);
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_TIPO"`);
    await queryRunner.query(`DROP INDEX "IDX_MANUTENCAO_KITNET"`);
    await queryRunner.query(`DROP TABLE "manutencao"`);
    await queryRunner.query(`DROP TYPE "status_manutencao_enum"`);
    await queryRunner.query(`DROP TYPE "prioridade_manutencao_enum"`);
    await queryRunner.query(`DROP TYPE "categoria_manutencao_enum"`);
    await queryRunner.query(`DROP TYPE "tipo_manutencao_enum"`);
  }
}
