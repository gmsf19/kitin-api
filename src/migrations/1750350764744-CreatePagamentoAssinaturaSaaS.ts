import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePagamentoAssinaturaSaaS1750350764744
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "status_pagamento_saas_enum" AS ENUM ('Pendente', 'Processando', 'Aprovado', 'Rejeitado', 'Cancelado', 'Estornado');
        `);

    await queryRunner.query(`
          CREATE TYPE "metodo_pagamento_enum" AS ENUM ('Cartao_Credito', 'Cartao_Debito', 'PIX', 'Boleto', 'Transferencia');
        `);

    await queryRunner.query(`
          CREATE TYPE "tipo_pagamento_enum" AS ENUM ('Mensal', 'Anual');
        `);

    await queryRunner.query(`
          CREATE TABLE "pagamento_assinatura_saas" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "empresa_id" uuid NOT NULL,
            "plano_id" uuid NOT NULL,
            "valor_pagamento" decimal(10,2) NOT NULL,
            "tipo_pagamento" "tipo_pagamento_enum" NOT NULL,
            "metodo_pagamento" "metodo_pagamento_enum" NOT NULL,
            "data_vencimento" date NOT NULL,
            "data_pagamento" TIMESTAMP,
            "status_pagamento" "status_pagamento_saas_enum" NOT NULL DEFAULT 'Pendente',
            "id_transacao_gateway" character varying(200),
            "gateway_pagamento" character varying(100),
            "detalhes_pagamento" text,
            "comprovante_url" character varying(500),
            "observacoes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_pagamento_assinatura_saas" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PAGAMENTO_EMPRESA" ON "pagamento_assinatura_saas" ("empresa_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PAGAMENTO_PLANO" ON "pagamento_assinatura_saas" ("plano_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PAGAMENTO_STATUS" ON "pagamento_assinatura_saas" ("status_pagamento");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PAGAMENTO_DATA" ON "pagamento_assinatura_saas" ("data_pagamento");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PAGAMENTO_VENCIMENTO" ON "pagamento_assinatura_saas" ("data_vencimento");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_PAGAMENTO_GATEWAY" ON "pagamento_assinatura_saas" ("id_transacao_gateway");
        `);

    await queryRunner.query(`
          ALTER TABLE "pagamento_assinatura_saas" 
          ADD CONSTRAINT "FK_pagamento_empresa" 
          FOREIGN KEY ("empresa_id") 
          REFERENCES "empresa"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "pagamento_assinatura_saas" 
          ADD CONSTRAINT "FK_pagamento_plano" 
          FOREIGN KEY ("plano_id") 
          REFERENCES "plano_assinatura"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pagamento_assinatura_saas" DROP CONSTRAINT "FK_pagamento_plano"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pagamento_assinatura_saas" DROP CONSTRAINT "FK_pagamento_empresa"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_PAGAMENTO_GATEWAY"`);
    await queryRunner.query(`DROP INDEX "IDX_PAGAMENTO_VENCIMENTO"`);
    await queryRunner.query(`DROP INDEX "IDX_PAGAMENTO_DATA"`);
    await queryRunner.query(`DROP INDEX "IDX_PAGAMENTO_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_PAGAMENTO_PLANO"`);
    await queryRunner.query(`DROP INDEX "IDX_PAGAMENTO_EMPRESA"`);
    await queryRunner.query(`DROP TABLE "pagamento_assinatura_saas"`);
    await queryRunner.query(`DROP TYPE "tipo_pagamento_enum"`);
    await queryRunner.query(`DROP TYPE "metodo_pagamento_enum"`);
    await queryRunner.query(`DROP TYPE "status_pagamento_saas_enum"`);
  }
}
