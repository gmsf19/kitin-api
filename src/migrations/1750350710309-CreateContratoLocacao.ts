import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContratoLocacao1750350710309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "status_contrato_enum" AS ENUM ('Ativo', 'Encerrado', 'Renovado', 'Cancelado');
        `);

    await queryRunner.query(`
          CREATE TABLE "contrato_locacao" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "kitnet_id" uuid NOT NULL,
            "inquilino_id" uuid NOT NULL,
            "data_inicio" date NOT NULL,
            "data_termino_previsto" date NOT NULL,
            "data_termino_real" date,
            "valor_aluguel" decimal(10,2) NOT NULL,
            "valor_deposito" decimal(10,2),
            "dia_vencimento" integer NOT NULL DEFAULT 10,
            "observacoes" text,
            "clausulas_especiais" text,
            "status_contrato" "status_contrato_enum" NOT NULL DEFAULT 'Ativo',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_contrato_locacao" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_CONTRATO_KITNET" ON "contrato_locacao" ("kitnet_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_CONTRATO_INQUILINO" ON "contrato_locacao" ("inquilino_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_CONTRATO_STATUS" ON "contrato_locacao" ("status_contrato");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_CONTRATO_INICIO" ON "contrato_locacao" ("data_inicio");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_CONTRATO_TERMINO" ON "contrato_locacao" ("data_termino_previsto");
        `);

    await queryRunner.query(`
          ALTER TABLE "contrato_locacao" 
          ADD CONSTRAINT "FK_contrato_kitnet" 
          FOREIGN KEY ("kitnet_id") 
          REFERENCES "kitnet"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "contrato_locacao" 
          ADD CONSTRAINT "FK_contrato_inquilino" 
          FOREIGN KEY ("inquilino_id") 
          REFERENCES "inquilino"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "kitnet" 
          ADD CONSTRAINT "FK_kitnet_contrato_atual" 
          FOREIGN KEY ("contrato_atual_id") 
          REFERENCES "contrato_locacao"("id") 
          ON DELETE SET NULL ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kitnet" DROP CONSTRAINT "FK_kitnet_contrato_atual"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contrato_locacao" DROP CONSTRAINT "FK_contrato_inquilino"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contrato_locacao" DROP CONSTRAINT "FK_contrato_kitnet"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_CONTRATO_TERMINO"`);
    await queryRunner.query(`DROP INDEX "IDX_CONTRATO_INICIO"`);
    await queryRunner.query(`DROP INDEX "IDX_CONTRATO_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_CONTRATO_INQUILINO"`);
    await queryRunner.query(`DROP INDEX "IDX_CONTRATO_KITNET"`);
    await queryRunner.query(`DROP TABLE "contrato_locacao"`);
    await queryRunner.query(`DROP TYPE "status_contrato_enum"`);
  }
}
