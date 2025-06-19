import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanoAssinatura1750350632517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);

    await queryRunner.query(`
          CREATE TYPE "status_plano_enum" AS ENUM ('Ativo', 'Inativo', 'Descontinuado');
        `);

    await queryRunner.query(`
          CREATE TABLE "plano_assinatura" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "nome_plano" character varying(100) NOT NULL,
            "descricao" text,
            "preco_mensal" decimal(10,2) NOT NULL,
            "preco_anual" decimal(10,2),
            "limite_kitnets" integer NOT NULL DEFAULT 0,
            "limite_usuarios" integer NOT NULL DEFAULT 1,
            "recursos_inclusos" text,
            "status_plano" "status_plano_enum" NOT NULL DEFAULT 'Ativo',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_plano_assinatura" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PLANO_STATUS" ON "plano_assinatura" ("status_plano");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PLANO_PRECO" ON "plano_assinatura" ("preco_mensal");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_PLANO_PRECO"`);
    await queryRunner.query(`DROP INDEX "IDX_PLANO_STATUS"`);
    await queryRunner.query(`DROP TABLE "plano_assinatura"`);
    await queryRunner.query(`DROP TYPE "status_plano_enum"`);
  }
}
