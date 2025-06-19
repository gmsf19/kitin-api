import { DataSource } from 'typeorm';

export class ConfiguracoesEmpresaSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir configurações para cada empresa
      await queryRunner.query(`
        INSERT INTO configuracoes_empresa (
          id, empresa_id, percentual_multa_atraso, percentual_juros_mensal,
          dias_tolerancia_atraso, valor_kwh_energia, valor_m3_gas,
          template_contrato, notificacoes_email, notificacoes_sms,
          dias_antecedencia_vencimento
        ) VALUES 
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d479',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          2.00,
          1.00,
          5,
          0.7500,
          3.5000,
          'CONTRATO DE LOCAÇÃO RESIDENCIAL\n\nLocador: {{nome_empresa}}\nLocatário: {{nome_inquilino}}\nImóvel: {{endereco_kitnet}}\nValor: R$ {{valor_aluguel}}\nVencimento: Todo dia {{dia_vencimento}} de cada mês',
          true,
          false,
          3
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d480',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          3.00,
          1.50,
          3,
          0.8200,
          4.2000,
          'CONTRATO DE LOCAÇÃO\n\nEste contrato é celebrado entre {{nome_empresa}} e {{nome_inquilino}} para locação do imóvel situado em {{endereco_kitnet}}.',
          true,
          true,
          5
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d481',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          2.50,
          1.20,
          7,
          0.7800,
          3.8000,
          'TERMO DE LOCAÇÃO RESIDENCIAL\n\nPartes: {{nome_empresa}} e {{nome_inquilino}}\nObjeto: Locação da kitnet {{nome_kitnet}}',
          true,
          false,
          2
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d482',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          1.50,
          0.80,
          10,
          0.7200,
          3.2000,
          'CONTRATO DE LOCAÇÃO HABITACIONAL\n\nLocador: {{nome_empresa}}\nInquilino: {{nome_inquilino}}\nImóvel: {{endereco_completo}}',
          true,
          false,
          7
        ),
        (
          'c47ac10b-58cc-4372-a567-0e02b2c3d483',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          2.20,
          1.10,
          5,
          0.7600,
          3.6000,
          'CONTRATO DE LOCAÇÃO ESTUDANTIL\n\nEste contrato destina-se à locação de imóvel para fins estudantis.',
          true,
          true,
          4
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ ConfiguracoesEmpresaSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar ConfiguracoesEmpresaSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

