import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAvaliacao1750350749630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "tipo_avaliacao_enum" AS ENUM ('Inquilino_Avalia_Kitnet', 'Proprietario_Avalia_Inquilino');
        `);

    await queryRunner.query(`
          CREATE TYPE "status_avaliacao_enum" AS ENUM ('Pendente', 'Concluida', 'Expirada');
        `);

    await queryRunner.query(`
          CREATE TABLE "avaliacao" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "contrato_id" uuid NOT NULL,
            "tipo_avaliacao" "tipo_avaliacao_enum" NOT NULL,
            "nota" integer NOT NULL,
            "comentario" text,
            "aspectos_positivos" text,
            "aspectos_negativos" text,
            "recomendaria" boolean,
            "data_avaliacao" TIMESTAMP NOT NULL DEFAULT now(),
            "status_avaliacao" "status_avaliacao_enum" NOT NULL DEFAULT 'Concluida',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_avaliacao" PRIMARY KEY ("id"),
            CONSTRAINT "CHK_avaliacao_nota" CHECK ("nota" >= 1 AND "nota" <= 5)
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_AVALIACAO_CONTRATO" ON "avaliacao" ("contrato_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_AVALIACAO_TIPO" ON "avaliacao" ("tipo_avaliacao");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_AVALIACAO_NOTA" ON "avaliacao" ("nota");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_AVALIACAO_DATA" ON "avaliacao" ("data_avaliacao");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_AVALIACAO_STATUS" ON "avaliacao" ("status_avaliacao");
        `);

    await queryRunner.query(`
          ALTER TABLE "avaliacao" 
          ADD CONSTRAINT "FK_avaliacao_contrato" 
          FOREIGN KEY ("contrato_id") 
          REFERENCES "contrato_locacao"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "avaliacao" DROP CONSTRAINT "FK_avaliacao_contrato"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_AVALIACAO_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_AVALIACAO_DATA"`);
    await queryRunner.query(`DROP INDEX "IDX_AVALIACAO_NOTA"`);
    await queryRunner.query(`DROP INDEX "IDX_AVALIACAO_TIPO"`);
    await queryRunner.query(`DROP INDEX "IDX_AVALIACAO_CONTRATO"`);
    await queryRunner.query(`DROP TABLE "avaliacao"`);
    await queryRunner.query(`DROP TYPE "status_avaliacao_enum"`);
    await queryRunner.query(`DROP TYPE "tipo_avaliacao_enum"`);
  }
}
