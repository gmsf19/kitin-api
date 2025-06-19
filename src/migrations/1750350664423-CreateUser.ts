import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1750350664423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "tipo_usuario_enum" AS ENUM ('SuperAdmin', 'AdminEmpresa', 'Inquilino');
        `);

    await queryRunner.query(`
          CREATE TYPE "status_conta_enum" AS ENUM ('Ativa', 'Inativa', 'Bloqueada', 'Pendente');
        `);

    await queryRunner.query(`
          CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying(255) NOT NULL,
            "senha" character varying(255) NOT NULL,
            "nome_completo" character varying(200) NOT NULL,
            "tipo_usuario" "tipo_usuario_enum" NOT NULL,
            "empresa_associada_id" uuid,
            "inquilino_associado_id" uuid,
            "data_criacao" TIMESTAMP NOT NULL DEFAULT now(),
            "ultimo_login" TIMESTAMP,
            "status_conta" "status_conta_enum" NOT NULL DEFAULT 'Ativa',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_user_email" UNIQUE ("email")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_USER_EMAIL" ON "user" ("email");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_USER_TIPO" ON "user" ("tipo_usuario");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_USER_EMPRESA" ON "user" ("empresa_associada_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_USER_STATUS" ON "user" ("status_conta");
        `);

    await queryRunner.query(`
          ALTER TABLE "user" 
          ADD CONSTRAINT "FK_user_empresa" 
          FOREIGN KEY ("empresa_associada_id") 
          REFERENCES "empresa"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_empresa"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_USER_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_USER_EMPRESA"`);
    await queryRunner.query(`DROP INDEX "IDX_USER_TIPO"`);
    await queryRunner.query(`DROP INDEX "IDX_USER_EMAIL"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "status_conta_enum"`);
    await queryRunner.query(`DROP TYPE "tipo_usuario_enum"`);
  }
}
