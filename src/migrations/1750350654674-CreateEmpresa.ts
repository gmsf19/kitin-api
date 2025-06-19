import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmpresa1750350654674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "status_conta_saas_enum" AS ENUM ('Ativa', 'Teste', 'Suspensa', 'Pagamento_Pendente', 'Cancelada');
        `);

    await queryRunner.query(`
          CREATE TABLE "empresa" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "plano_assinatura_id" uuid NOT NULL,
            "nome_empresa" character varying(200) NOT NULL,
            "cnpj" character varying(18),
            "email_contato" character varying(255) NOT NULL,
            "telefone" character varying(20),
            "endereco_completo" text,
            "cidade" character varying(100),
            "estado" character varying(2),
            "cep" character varying(10),
            "data_cadastro" TIMESTAMP NOT NULL DEFAULT now(),
            "status_conta_saas" "status_conta_saas_enum" NOT NULL DEFAULT 'Teste',
            "data_vencimento_plano" date,
            "observacoes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_empresa" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_empresa_cnpj" UNIQUE ("cnpj"),
            CONSTRAINT "UQ_empresa_email" UNIQUE ("email_contato")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_EMPRESA_PLANO" ON "empresa" ("plano_assinatura_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_EMPRESA_STATUS" ON "empresa" ("status_conta_saas");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_EMPRESA_CIDADE" ON "empresa" ("cidade");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_EMPRESA_VENCIMENTO" ON "empresa" ("data_vencimento_plano");
        `);

    await queryRunner.query(`
          ALTER TABLE "empresa" 
          ADD CONSTRAINT "FK_empresa_plano_assinatura" 
          FOREIGN KEY ("plano_assinatura_id") 
          REFERENCES "plano_assinatura"("id") 
          ON DELETE RESTRICT ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresa" DROP CONSTRAINT "FK_empresa_plano_assinatura"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_EMPRESA_VENCIMENTO"`);
    await queryRunner.query(`DROP INDEX "IDX_EMPRESA_CIDADE"`);
    await queryRunner.query(`DROP INDEX "IDX_EMPRESA_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_EMPRESA_PLANO"`);
    await queryRunner.query(`DROP TABLE "empresa"`);
    await queryRunner.query(`DROP TYPE "status_conta_saas_enum"`);
  }
}
