import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInquilino1750350700774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "status_inquilino_enum" AS ENUM ('Ativo', 'Inativo', 'Bloqueado', 'Pendente');
        `);

    await queryRunner.query(`
          CREATE TABLE "inquilino" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "nome_completo" character varying(200) NOT NULL,
            "cpf" character varying(14) NOT NULL,
            "rg" character varying(20),
            "data_nascimento" date,
            "email" character varying(255) NOT NULL,
            "telefone" character varying(20),
            "profissao" character varying(100),
            "local_trabalho" character varying(200),
            "renda_mensal" decimal(10,2),
            "comprovante_renda_url" character varying(500),
            "foto_url" character varying(500),
            "empresa_associada_id" uuid NOT NULL,
            "usuario_acesso_id" uuid,
            "status_inquilino" "status_inquilino_enum" NOT NULL DEFAULT 'Ativo',
            "nota_media_inquilino" decimal(3,2) DEFAULT 0,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_inquilino" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_inquilino_cpf" UNIQUE ("cpf"),
            CONSTRAINT "UQ_inquilino_email" UNIQUE ("email")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_INQUILINO_CPF" ON "inquilino" ("cpf");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_INQUILINO_EMAIL" ON "inquilino" ("email");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_INQUILINO_EMPRESA" ON "inquilino" ("empresa_associada_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_INQUILINO_STATUS" ON "inquilino" ("status_inquilino");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_INQUILINO_NOTA" ON "inquilino" ("nota_media_inquilino");
        `);

    await queryRunner.query(`
          ALTER TABLE "inquilino" 
          ADD CONSTRAINT "FK_inquilino_empresa" 
          FOREIGN KEY ("empresa_associada_id") 
          REFERENCES "empresa"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
          ALTER TABLE "inquilino" 
          ADD CONSTRAINT "FK_inquilino_usuario" 
          FOREIGN KEY ("usuario_acesso_id") 
          REFERENCES "user"("id") 
          ON DELETE SET NULL ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inquilino" DROP CONSTRAINT "FK_inquilino_usuario"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inquilino" DROP CONSTRAINT "FK_inquilino_empresa"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_INQUILINO_NOTA"`);
    await queryRunner.query(`DROP INDEX "IDX_INQUILINO_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_INQUILINO_EMPRESA"`);
    await queryRunner.query(`DROP INDEX "IDX_INQUILINO_EMAIL"`);
    await queryRunner.query(`DROP INDEX "IDX_INQUILINO_CPF"`);
    await queryRunner.query(`DROP TABLE "inquilino"`);
    await queryRunner.query(`DROP TYPE "status_inquilino_enum"`);
  }
}
