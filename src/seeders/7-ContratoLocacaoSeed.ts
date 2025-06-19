import { DataSource } from 'typeorm';

export class ContratoLocacaoSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir contratos de locação
      await queryRunner.query(`
        INSERT INTO contrato_locacao (
          id, kitnet_alugada_id, inquilino_id, data_inicio, data_termino_previsto,
          valor_aluguel, dia_vencimento, valor_deposito_caucao, percentual_multa_atraso,
          percentual_multa_quebra_contrato, documento_contrato_url, status_contrato,
          observacoes
        ) VALUES 
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d479',
          'k47ac10b-58cc-4372-a567-0e02b2c3d479',
          'i47ac10b-58cc-4372-a567-0e02b2c3d479',
          '2024-01-01',
          '2024-12-31',
          800.00,
          10,
          800.00,
          2.00,
          300.00,
          'https://exemplo.com/contrato1.pdf',
          'Ativo',
          'Contrato renovado automaticamente por mais 12 meses'
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d480',
          'k47ac10b-58cc-4372-a567-0e02b2c3d481',
          'i47ac10b-58cc-4372-a567-0e02b2c3d481',
          '2024-02-15',
          '2025-02-14',
          1500.00,
          15,
          3000.00,
          3.00,
          300.00,
          'https://exemplo.com/contrato2.pdf',
          'Ativo',
          'Inquilino com excelente histórico de pagamentos'
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d481',
          'k47ac10b-58cc-4372-a567-0e02b2c3d484',
          'i47ac10b-58cc-4372-a567-0e02b2c3d482',
          '2024-03-01',
          '2025-02-28',
          750.00,
          5,
          750.00,
          2.50,
          300.00,
          'https://exemplo.com/contrato3.pdf',
          'Ativo',
          'Contrato com desconto especial para professora'
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d482',
          'k47ac10b-58cc-4372-a567-0e02b2c3d486',
          'i47ac10b-58cc-4372-a567-0e02b2c3d483',
          '2024-01-15',
          '2024-12-15',
          600.00,
          20,
          600.00,
          2.20,
          300.00,
          'https://exemplo.com/contrato4.pdf',
          'Ativo',
          'Contrato estudantil com condições especiais'
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d483',
          'k47ac10b-58cc-4372-a567-0e02b2c3d480',
          'i47ac10b-58cc-4372-a567-0e02b2c3d480',
          '2023-06-01',
          '2024-05-31',
          1200.00,
          1,
          2400.00,
          2.00,
          300.00,
          'https://exemplo.com/contrato5.pdf',
          'Encerrado',
          'Contrato encerrado no prazo previsto'
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d484',
          'k47ac10b-58cc-4372-a567-0e02b2c3d483',
          'i47ac10b-58cc-4372-a567-0e02b2c3d484',
          '2023-11-01',
          '2024-10-31',
          900.00,
          25,
          1800.00,
          2.50,
          300.00,
          'https://exemplo.com/contrato6.pdf',
          'Renovado',
          'Contrato renovado por mais 12 meses com reajuste'
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d485',
          'k47ac10b-58cc-4372-a567-0e02b2c3d482',
          'i47ac10b-58cc-4372-a567-0e02b2c3d485',
          '2023-08-15',
          '2024-08-14',
          1800.00,
          10,
          3600.00,
          3.00,
          300.00,
          'https://exemplo.com/contrato7.pdf',
          'Cancelado',
          'Contrato cancelado por mudança de cidade do inquilino'
        );
      `);

      // Atualizar referências de contrato atual nas kitnets e inquilinos
      await queryRunner.query(`
        UPDATE kitnet SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d479' 
        WHERE id = 'k47ac10b-58cc-4372-a567-0e02b2c3d479';
      `);

      await queryRunner.query(`
        UPDATE kitnet SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d480' 
        WHERE id = 'k47ac10b-58cc-4372-a567-0e02b2c3d481';
      `);

      await queryRunner.query(`
        UPDATE kitnet SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d481' 
        WHERE id = 'k47ac10b-58cc-4372-a567-0e02b2c3d484';
      `);

      await queryRunner.query(`
        UPDATE kitnet SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d482' 
        WHERE id = 'k47ac10b-58cc-4372-a567-0e02b2c3d486';
      `);

      await queryRunner.query(`
        UPDATE inquilino SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d479' 
        WHERE id = 'i47ac10b-58cc-4372-a567-0e02b2c3d479';
      `);

      await queryRunner.query(`
        UPDATE inquilino SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d480' 
        WHERE id = 'i47ac10b-58cc-4372-a567-0e02b2c3d481';
      `);

      await queryRunner.query(`
        UPDATE inquilino SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d481' 
        WHERE id = 'i47ac10b-58cc-4372-a567-0e02b2c3d482';
      `);

      await queryRunner.query(`
        UPDATE inquilino SET contrato_atual_id = 'c47ac10b-58cc-4372-a567-0e02b2c3d482' 
        WHERE id = 'i47ac10b-58cc-4372-a567-0e02b2c3d483';
      `);

      // Atualizar referência de inquilino associado nos usuários
      await queryRunner.query(`
        UPDATE "user" SET inquilino_associado_id = 'i47ac10b-58cc-4372-a567-0e02b2c3d479' 
        WHERE id = 'd47ac10b-58cc-4372-a567-0e02b2c3d485';
      `);

      await queryRunner.query(`
        UPDATE "user" SET inquilino_associado_id = 'i47ac10b-58cc-4372-a567-0e02b2c3d480' 
        WHERE id = 'd47ac10b-58cc-4372-a567-0e02b2c3d486';
      `);

      await queryRunner.query(`
        UPDATE "user" SET inquilino_associado_id = 'i47ac10b-58cc-4372-a567-0e02b2c3d481' 
        WHERE id = 'd47ac10b-58cc-4372-a567-0e02b2c3d487';
      `);

      await queryRunner.query(`
        UPDATE "user" SET inquilino_associado_id = 'i47ac10b-58cc-4372-a567-0e02b2c3d482' 
        WHERE id = 'd47ac10b-58cc-4372-a567-0e02b2c3d488';
      `);

      await queryRunner.commitTransaction();
      console.log('✅ ContratoLocacaoSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar ContratoLocacaoSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

