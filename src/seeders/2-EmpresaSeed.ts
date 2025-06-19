import { DataSource } from 'typeorm';

export class EmpresaSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir empresas
      await queryRunner.query(`
        INSERT INTO empresa (
          id, nome_empresa, cnpj_cpf, responsavel_principal, email_principal, 
          telefone_principal, endereco, plano_assinado_id, status_conta_saas,
          data_proximo_vencimento, id_assinatura_gateway
        ) VALUES 
        (
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Imóveis Silva & Cia',
          '12.345.678/0001-90',
          'João Silva',
          'joao@imoveissilva.com.br',
          '(11) 99999-1234',
          'Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Ativa',
          '2024-07-15',
          'sub_1234567890'
        ),
        (
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Residencial Santos Ltda',
          '98.765.432/0001-10',
          'Maria Santos',
          'maria@residencialsantos.com.br',
          '(21) 88888-5678',
          'Av. Atlântica, 456 - Copacabana - Rio de Janeiro/RJ - CEP: 22070-001',
          'f47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Ativa',
          '2024-08-20',
          'sub_0987654321'
        ),
        (
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Kitnets do Centro',
          '456.789.123-45',
          'Carlos Oliveira',
          'carlos@kitnetscentro.com.br',
          '(31) 77777-9012',
          'Rua da Bahia, 789 - Centro - Belo Horizonte/MG - CEP: 30112-000',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Ativa',
          '2024-06-30',
          'sub_1122334455'
        ),
        (
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Habitação Moderna',
          '11.222.333/0001-44',
          'Ana Costa',
          'ana@habitacaomoderna.com.br',
          '(85) 66666-3456',
          'Rua Dragão do Mar, 321 - Praia de Iracema - Fortaleza/CE - CEP: 60060-390',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Teste',
          '2024-07-01',
          NULL
        ),
        (
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Estudantil Residence',
          '22.333.444/0001-55',
          'Pedro Almeida',
          'pedro@estudantilresidence.com.br',
          '(47) 55555-7890',
          'Rua XV de Novembro, 654 - Centro - Blumenau/SC - CEP: 89010-000',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Pagamento Pendente',
          '2024-06-15',
          'sub_9988776655'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ EmpresaSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar EmpresaSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

