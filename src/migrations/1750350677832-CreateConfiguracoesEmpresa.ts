import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfiguracoesEmpresa1750350677832
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "configuracoes_empresa" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "empresa_id" uuid NOT NULL,
            "taxa_multa_atraso" decimal(5,2) DEFAULT 2.00,
            "taxa_juros_mensal" decimal(5,2) DEFAULT 1.00,
            "dias_carencia_pagamento" integer DEFAULT 5,
            "valor_kwh_energia" decimal(8,4) DEFAULT 0.7500,
            "valor_m3_gas" decimal(8,4) DEFAULT 4.2500,
            "template_contrato" text,
            "politica_cancelamento" text,
            "observacoes_gerais" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_configuracoes_empresa" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_configuracoes_empresa" UNIQUE ("empresa_id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_CONFIG_EMPRESA" ON "configuracoes_empresa" ("empresa_id");
        `);

    await queryRunner.query(`
          ALTER TABLE "configuracoes_empresa" 
          ADD CONSTRAINT "FK_configuracoes_empresa" 
          FOREIGN KEY ("empresa_id") 
          REFERENCES "empresa"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "configuracoes_empresa" DROP CONSTRAINT "FK_configuracoes_empresa"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_CONFIG_EMPRESA"`);
    await queryRunner.query(`DROP TABLE "configuracoes_empresa"`);
  }
}
