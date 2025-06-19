import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKitnet1750350689981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TYPE "status_kitnet_enum" AS ENUM ('Disponivel', 'Alugada', 'Em_Manutencao', 'Bloqueada');
        `);

    await queryRunner.query(`
          CREATE TABLE "kitnet" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "empresa_proprietaria_id" uuid NOT NULL,
            "nome_identificador" character varying(100) NOT NULL,
            "endereco_completo" text NOT NULL,
            "area_m2" decimal(8,2),
            "valor_aluguel_base" decimal(10,2) NOT NULL,
            "descricao" text,
            "caracteristicas" text,
            "fotos_urls" text,
            "status" "status_kitnet_enum" NOT NULL DEFAULT 'Disponivel',
            "data_aquisicao" date,
            "contrato_atual_id" uuid,
            "nota_media_kitnet" decimal(3,2) DEFAULT 0,
            "selo_melhor_imovel" boolean DEFAULT false,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_kitnet" PRIMARY KEY ("id")
          )
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_KITNET_EMPRESA" ON "kitnet" ("empresa_proprietaria_id");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_KITNET_STATUS" ON "kitnet" ("status");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_KITNET_VALOR" ON "kitnet" ("valor_aluguel_base");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_KITNET_AREA" ON "kitnet" ("area_m2");
        `);

    await queryRunner.query(`
          CREATE INDEX "IDX_KITNET_NOTA" ON "kitnet" ("nota_media_kitnet");
        `);

    await queryRunner.query(`
          ALTER TABLE "kitnet" 
          ADD CONSTRAINT "FK_kitnet_empresa" 
          FOREIGN KEY ("empresa_proprietaria_id") 
          REFERENCES "empresa"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kitnet" DROP CONSTRAINT "FK_kitnet_empresa"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_KITNET_NOTA"`);
    await queryRunner.query(`DROP INDEX "IDX_KITNET_AREA"`);
    await queryRunner.query(`DROP INDEX "IDX_KITNET_VALOR"`);
    await queryRunner.query(`DROP INDEX "IDX_KITNET_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_KITNET_EMPRESA"`);
    await queryRunner.query(`DROP TABLE "kitnet"`);
    await queryRunner.query(`DROP TYPE "status_kitnet_enum"`);
  }
}
