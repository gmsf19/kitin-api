import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDespesa1750350726490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "categoria_despesa_enum" AS ENUM ('Manutencao', 'Impostos', 'Condominio', 'Servicos', 'Marketing', 'Outros');
        `);

    await queryRunner.query(`
          CREATE TYPE "periodicidade_despesa_enum" AS ENUM ('Unica', 'Mensal', 'Trimestral', 'Semestral', 'Anual');
        `);

    await queryRunner.query(`
          CREATE TABLE "despesa" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "empresa_id" uuid NOT NULL,
            "kitnet_id" uuid,
            "descricao" character varying(200) NOT NULL,
            "categoria" "categoria_despesa_enum" NOT NULL,
            "valor" decimal(10,2) NOT NULL,
            "data_despesa" date NOT NULL,
            "periodicidade" "periodicidade_despesa_enum" NOT NULL DEFAULT 'Unica',
            "data_proximo_vencimento" date,
            "fornecedor" character varying(150),
            "numero_documento" character varying(50),
            "observacoes" text,
            "comprovante_url" character varying(500),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_despesa" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_DESPESA_EMPRESA" ON "despesa" ("empresa_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_DESPESA_KITNET" ON "despesa" ("kitnet_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_DESPESA_CATEGORIA" ON "despesa" ("categoria");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_DESPESA_DATA" ON "despesa" ("data_despesa");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_DESPESA_VALOR" ON "despesa" ("valor");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_DESPESA_PROXIMO_VENCIMENTO" ON "despesa" ("data_proximo_vencimento");
        `);

    await queryRunner.query(`
          ALTER TABLE "despesa" 
          ADD CONSTRAINT "FK_despesa_empresa" 
          FOREIGN KEY ("empresa_id") 
          REFERENCES "empresa"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "despesa" 
          ADD CONSTRAINT "FK_despesa_kitnet" 
          FOREIGN KEY ("kitnet_id") 
          REFERENCES "kitnet"("id") 
          ON DELETE SET NULL ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "despesa" DROP CONSTRAINT "FK_despesa_kitnet"`,
    );
    await queryRunner.query(
      `ALTER TABLE "despesa" DROP CONSTRAINT "FK_despesa_empresa"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_DESPESA_PROXIMO_VENCIMENTO"`);
    await queryRunner.query(`DROP INDEX "IDX_DESPESA_VALOR"`);
    await queryRunner.query(`DROP INDEX "IDX_DESPESA_DATA"`);
    await queryRunner.query(`DROP INDEX "IDX_DESPESA_CATEGORIA"`);
    await queryRunner.query(`DROP INDEX "IDX_DESPESA_KITNET"`);
    await queryRunner.query(`DROP INDEX "IDX_DESPESA_EMPRESA"`);
    await queryRunner.query(`DROP TABLE "despesa"`);
    await queryRunner.query(`DROP TYPE "periodicidade_despesa_enum"`);
    await queryRunner.query(`DROP TYPE "categoria_despesa_enum"`);
  }
}
