import { DataSource } from 'typeorm';

export class DespesaSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir despesas
      await queryRunner.query(`
        INSERT INTO despesa (
          id, empresa_associada_id, kitnet_associada_id, descricao,
          categoria, valor, data_despesa, comprovante_url,
          recorrente, periodicidade, observacoes
        ) VALUES 
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d479',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'k47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Reparo no chuveiro elétrico',
          'Manutencao',
          150.00,
          '2024-06-05',
          'https://exemplo.com/nota_fiscal1.pdf',
          false,
          NULL,
          'Serviço realizado pelo eletricista João'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d480',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          NULL,
          'IPTU anual dos imóveis',
          'Impostos',
          2500.00,
          '2024-01-15',
          'https://exemplo.com/iptu2024.pdf',
          true,
          'Anual',
          'Pagamento do IPTU referente a todos os imóveis'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d481',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'k47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Pintura da kitnet',
          'Manutencao',
          800.00,
          '2024-05-20',
          'https://exemplo.com/nota_pintura.pdf',
          false,
          NULL,
          'Pintura completa realizada antes da locação'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d482',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          NULL,
          'Taxa de condomínio - Edifício Copacabana',
          'Condominio',
          450.00,
          '2024-06-01',
          'https://exemplo.com/condominio_junho.pdf',
          true,
          'Mensal',
          'Taxa mensal do condomínio'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d483',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'k47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Desentupimento da pia',
          'Manutencao',
          120.00,
          '2024-06-10',
          'https://exemplo.com/servico_desentupimento.pdf',
          false,
          NULL,
          'Serviço emergencial de desentupimento'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d484',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          NULL,
          'Seguro dos imóveis',
          'Servicos',
          1200.00,
          '2024-03-01',
          'https://exemplo.com/seguro_anual.pdf',
          true,
          'Anual',
          'Seguro contra incêndio e roubo'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d485',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'k47ac10b-58cc-4372-a567-0e02b2c3d486',
          'Troca da fechadura',
          'Manutencao',
          80.00,
          '2024-01-10',
          'https://exemplo.com/fechadura.pdf',
          false,
          NULL,
          'Troca solicitada pelo inquilino anterior'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d486',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          NULL,
          'Contador para administração',
          'Servicos',
          500.00,
          '2024-06-01',
          'https://exemplo.com/honorarios_contador.pdf',
          true,
          'Mensal',
          'Honorários mensais do contador'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d487',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'k47ac10b-58cc-4372-a567-0e02b2c3d484',
          'Limpeza pós-mudança',
          'Servicos',
          200.00,
          '2024-02-28',
          'https://exemplo.com/limpeza.pdf',
          false,
          NULL,
          'Limpeza após saída do inquilino anterior'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d488',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          'k47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Manutenção do ar condicionado',
          'Manutencao',
          250.00,
          '2024-04-15',
          'https://exemplo.com/manutencao_ar.pdf',
          false,
          NULL,
          'Limpeza e recarga do gás'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d489',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          NULL,
          'Alvará de funcionamento',
          'Impostos',
          300.00,
          '2024-01-20',
          'https://exemplo.com/alvara.pdf',
          true,
          'Anual',
          'Renovação anual do alvará'
        ),
        (
          'de7ac10b-58cc-4372-a567-0e02b2c3d490',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'k47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Reparo no piso do banheiro',
          'Manutencao',
          400.00,
          '2024-05-10',
          'https://exemplo.com/reparo_piso.pdf',
          false,
          NULL,
          'Troca de azulejos danificados'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ DespesaSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar DespesaSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

