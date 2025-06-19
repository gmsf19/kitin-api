import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyConstraints1750350805041
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      // 1. Verificar se as tabelas existem
      const tables = ['user', 'inquilino', 'kitnet', 'contrato_locacao'];
      for (const table of tables) {
        const exists = await queryRunner.hasTable(table);
        if (!exists) {
          throw new Error(
            `Tabela ${table} não encontrada. Execute as migrations anteriores primeiro.`,
          );
        }
      }

      // 2. Adicionar coluna contrato_atual_id na tabela inquilino se não existir
      const hasInquilinoContratoColumn = await queryRunner.hasColumn(
        'inquilino',
        'contrato_atual_id',
      );
      if (!hasInquilinoContratoColumn) {
        await queryRunner.query(`
              ALTER TABLE "inquilino" 
              ADD COLUMN "contrato_atual_id" uuid
            `);
        console.log(
          '✅ Coluna contrato_atual_id adicionada na tabela inquilino',
        );
      }

      // 3. Verificar e adicionar FK: user -> inquilino
      const hasUserInquilinoColumn = await queryRunner.hasColumn(
        'user',
        'inquilino_associado_id',
      );
      if (hasUserInquilinoColumn) {
        // Verificar se FK já existe
        const existingFK1 = await queryRunner.query(`
              SELECT constraint_name 
              FROM information_schema.table_constraints 
              WHERE table_name = 'user' 
              AND constraint_name = 'FK_user_inquilino_associado'
            `);

        if (existingFK1.length === 0) {
          await queryRunner.query(`
                ALTER TABLE "user" 
                ADD CONSTRAINT "FK_user_inquilino_associado" 
                FOREIGN KEY ("inquilino_associado_id") 
                REFERENCES "inquilino"("id") 
                ON DELETE SET NULL ON UPDATE CASCADE
              `);
          console.log('✅ FK user -> inquilino criada');
        }
      }

      // 4. Adicionar FK: inquilino -> contrato_locacao
      const existingFK2 = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'inquilino' 
            AND constraint_name = 'FK_inquilino_contrato_atual'
          `);

      if (existingFK2.length === 0) {
        await queryRunner.query(`
              ALTER TABLE "inquilino" 
              ADD CONSTRAINT "FK_inquilino_contrato_atual" 
              FOREIGN KEY ("contrato_atual_id") 
              REFERENCES "contrato_locacao"("id") 
              ON DELETE SET NULL ON UPDATE CASCADE
            `);
        console.log('✅ FK inquilino -> contrato_locacao criada');
      }

      // 5. Verificar e adicionar FK: kitnet -> contrato_locacao
      const existingFK3 = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'kitnet' 
            AND constraint_name = 'FK_kitnet_contrato_atual'
          `);

      if (existingFK3.length === 0) {
        await queryRunner.query(`
              ALTER TABLE "kitnet" 
              ADD CONSTRAINT "FK_kitnet_contrato_atual" 
              FOREIGN KEY ("contrato_atual_id") 
              REFERENCES "contrato_locacao"("id") 
              ON DELETE SET NULL ON UPDATE CASCADE
            `);
        console.log('✅ FK kitnet -> contrato_locacao criada');
      }

      // 6. Adicionar índices para performance
      await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_user_inquilino_associado" 
            ON "user" ("inquilino_associado_id")
          `);

      await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_inquilino_contrato_atual" 
            ON "inquilino" ("contrato_atual_id")
          `);

      console.log('✅ Índices criados para otimização');
      console.log(
        '🎉 Migration AddForeignKeyConstraints executada com sucesso!',
      );
    } catch (error) {
      console.error(
        '❌ Erro na migration AddForeignKeyConstraints:',
        error.message,
      );
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Remover índices
      await queryRunner.query(
        `DROP INDEX IF EXISTS "IDX_inquilino_contrato_atual"`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "IDX_user_inquilino_associado"`,
      );

      // Remover foreign keys
      await queryRunner.query(
        `ALTER TABLE "kitnet" DROP CONSTRAINT IF EXISTS "FK_kitnet_contrato_atual"`,
      );
      await queryRunner.query(
        `ALTER TABLE "inquilino" DROP CONSTRAINT IF EXISTS "FK_inquilino_contrato_atual"`,
      );
      await queryRunner.query(
        `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "FK_user_inquilino_associado"`,
      );

      // Remover coluna adicionada
      const hasInquilinoContratoColumn = await queryRunner.hasColumn(
        'inquilino',
        'contrato_atual_id',
      );
      if (hasInquilinoContratoColumn) {
        await queryRunner.query(
          `ALTER TABLE "inquilino" DROP COLUMN "contrato_atual_id"`,
        );
      }

      console.log(
        '✅ Rollback da migration AddForeignKeyConstraints executado com sucesso!',
      );
    } catch (error) {
      console.error('❌ Erro no rollback da migration:', error.message);
      throw error;
    }
  }
}
