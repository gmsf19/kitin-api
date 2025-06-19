import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UserSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hash das senhas (senha padrão: 123456)
      const hashedPassword = await bcrypt.hash('123456', 10);

      // Inserir usuários
      await queryRunner.query(`
        INSERT INTO "user" (
          id, email, senha, nome_completo, tipo_usuario, empresa_associada_id, 
          ultimo_login, status_conta
        ) VALUES 
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d479',
          'admin@sistema.com.br',
          '${hashedPassword}',
          'Administrador do Sistema',
          'SuperAdmin',
          NULL,
          '2024-06-18 10:30:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d480',
          'joao@imoveissilva.com.br',
          '${hashedPassword}',
          'João Silva',
          'AdminEmpresa',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          '2024-06-18 09:15:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d481',
          'maria@residencialsantos.com.br',
          '${hashedPassword}',
          'Maria Santos',
          'AdminEmpresa',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          '2024-06-17 14:20:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d482',
          'carlos@kitnetscentro.com.br',
          '${hashedPassword}',
          'Carlos Oliveira',
          'AdminEmpresa',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          '2024-06-18 08:45:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d483',
          'ana@habitacaomoderna.com.br',
          '${hashedPassword}',
          'Ana Costa',
          'AdminEmpresa',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          '2024-06-16 16:10:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d484',
          'pedro@estudantilresidence.com.br',
          '${hashedPassword}',
          'Pedro Almeida',
          'AdminEmpresa',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          '2024-06-15 11:30:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d485',
          'lucas.ferreira@email.com',
          '${hashedPassword}',
          'Lucas Ferreira',
          'Inquilino',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          '2024-06-18 07:20:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d486',
          'juliana.costa@email.com',
          '${hashedPassword}',
          'Juliana Costa',
          'Inquilino',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          '2024-06-17 19:45:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d487',
          'rafael.santos@email.com',
          '${hashedPassword}',
          'Rafael Santos',
          'Inquilino',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          '2024-06-18 06:30:00',
          'Ativa'
        ),
        (
          'd47ac10b-58cc-4372-a567-0e02b2c3d488',
          'fernanda.silva@email.com',
          '${hashedPassword}',
          'Fernanda Silva',
          'Inquilino',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          '2024-06-16 20:15:00',
          'Ativa'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ UserSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar UserSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

