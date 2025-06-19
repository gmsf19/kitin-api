import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFatura1750350720001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "status_pagamento_enum" AS ENUM ('Pendente', 'Pago', 'Vencido', 'Cancelado');
        `);

    await queryRunner.query(`
          CREATE TABLE "fatura" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "contrato_id" uuid NOT NULL,
            "mes_referencia" date NOT NULL,
            "valor_aluguel" decimal(10,2) NOT NULL,
            "consumo_energia_kwh" decimal(10,3) DEFAULT 0,
            "valor_energia" decimal(10,2) DEFAULT 0,
            "consumo_gas_m3" decimal(10,3) DEFAULT 0,
            "valor_gas" decimal(10,2) DEFAULT 0,
            "outras_taxas" decimal(10,2) DEFAULT 0,
            "descricao_outras_taxas" text,
            "valor_total" decimal(10,2) NOT NULL,
            "data_vencimento" date NOT NULL,
            "data_pagamento" TIMESTAMP,
            "valor_pago" decimal(10,2),
            "multa_atraso" decimal(10,2) DEFAULT 0,
            "juros_atraso" decimal(10,2) DEFAULT 0,
            "desconto_aplicado" decimal(10,2) DEFAULT 0,
            "observacoes" text,
            "comprovante_pagamento_url" character varying(500),
            "status_pagamento" "status_pagamento_enum" NOT NULL DEFAULT 'Pendente',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_fatura" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_FATURA_CONTRATO" ON "fatura" ("contrato_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_FATURA_MES" ON "fatura" ("mes_referencia");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_FATURA_STATUS" ON "fatura" ("status_pagamento");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_FATURA_VENCIMENTO" ON "fatura" ("data_vencimento");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_FATURA_VALOR" ON "fatura" ("valor_total");
        `);

    await queryRunner.query(`
          ALTER TABLE "fatura" 
          ADD CONSTRAINT "FK_fatura_contrato" 
          FOREIGN KEY ("contrato_id") 
          REFERENCES "contrato_locacao"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
          CREATE OR REPLACE FUNCTION calcular_valor_total_fatura()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.valor_total = NEW.valor_aluguel + 
                             COALESCE(NEW.valor_energia, 0) + 
                             COALESCE(NEW.valor_gas, 0) + 
                             COALESCE(NEW.outras_taxas, 0) + 
                             COALESCE(NEW.multa_atraso, 0) + 
                             COALESCE(NEW.juros_atraso, 0) - 
                             COALESCE(NEW.desconto_aplicado, 0);
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
          CREATE TRIGGER trigger_calcular_valor_total_fatura
          BEFORE INSERT OR UPDATE ON "fatura"
          FOR EACH ROW
          EXECUTE FUNCTION calcular_valor_total_fatura();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER trigger_calcular_valor_total_fatura ON "fatura"`,
    );
    await queryRunner.query(`DROP FUNCTION calcular_valor_total_fatura()`);
    await queryRunner.query(
      `ALTER TABLE "fatura" DROP CONSTRAINT "FK_fatura_contrato"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_FATURA_VALOR"`);
    await queryRunner.query(`DROP INDEX "IDX_FATURA_VENCIMENTO"`);
    await queryRunner.query(`DROP INDEX "IDX_FATURA_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_FATURA_MES"`);
    await queryRunner.query(`DROP INDEX "IDX_FATURA_CONTRATO"`);
    await queryRunner.query(`DROP TABLE "fatura"`);
    await queryRunner.query(`DROP TYPE "status_pagamento_enum"`);
  }
}
