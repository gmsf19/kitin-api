import { DataSource } from 'typeorm';

export class KitnetSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir kitnets
      await queryRunner.query(`
        INSERT INTO kitnet (
          id, nome_identificador, empresa_proprietaria_id, endereco_completo,
          area_m2, valor_aluguel_base, descricao, caracteristicas,
          fotos_urls, status, data_aquisicao, nota_media_kitnet, selo_melhor_imovel
        ) VALUES 
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Kitnet A1 - Centro',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Rua Augusta, 1234 - Apt 101 - Centro - São Paulo/SP - CEP: 01305-100',
          25.50,
          800.00,
          'Kitnet mobiliada no coração de São Paulo, próxima ao metrô',
          '1 ambiente, 1 banheiro, mobiliada, ar condicionado, internet incluída',
          '["https://exemplo.com/foto1.jpg", "https://exemplo.com/foto2.jpg"]',
          'Alugada',
          '2023-01-15',
          4.2,
          true
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Kitnet B2 - Paulista',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Av. Paulista, 2000 - Apt 205 - Bela Vista - São Paulo/SP - CEP: 01310-100',
          30.00,
          1200.00,
          'Kitnet moderna na Av. Paulista com vista panorâmica',
          '1 quarto, 1 banheiro, sacada, mobiliada, academia no prédio',
          '["https://exemplo.com/foto3.jpg", "https://exemplo.com/foto4.jpg"]',
          'Disponivel',
          '2023-03-20',
          4.5,
          false
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Studio Copacabana 301',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Rua Barata Ribeiro, 500 - Apt 301 - Copacabana - Rio de Janeiro/RJ - CEP: 22040-000',
          28.00,
          1500.00,
          'Studio a 2 quadras da praia de Copacabana',
          '1 ambiente integrado, 1 banheiro, varanda, semi-mobiliada',
          '["https://exemplo.com/foto5.jpg", "https://exemplo.com/foto6.jpg"]',
          'Alugada',
          '2022-11-10',
          4.8,
          true
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Kitnet Ipanema 102',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Rua Visconde de Pirajá, 300 - Apt 102 - Ipanema - Rio de Janeiro/RJ - CEP: 22410-000',
          22.50,
          1800.00,
          'Kitnet compacta no coração de Ipanema',
          '1 ambiente, 1 banheiro, próximo ao metrô e praia',
          '["https://exemplo.com/foto7.jpg"]',
          'Em_Manutencao',
          '2023-05-01',
          3.9,
          false
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Loft Centro BH',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Rua dos Carijós, 800 - Loft 15 - Centro - Belo Horizonte/MG - CEP: 30112-000',
          35.00,
          900.00,
          'Loft moderno no centro histórico de BH',
          '1 quarto, 1 banheiro, pé direito alto, mobiliada',
          '["https://exemplo.com/foto8.jpg", "https://exemplo.com/foto9.jpg", "https://exemplo.com/foto10.jpg"]',
          'Disponivel',
          '2023-02-28',
          4.1,
          false
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d484',
          'Kitnet Savassi 501',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Rua Pernambuco, 1200 - Apt 501 - Savassi - Belo Horizonte/MG - CEP: 30112-000',
          26.00,
          750.00,
          'Kitnet na região mais badalada de BH',
          '1 ambiente, 1 banheiro, próximo a bares e restaurantes',
          '["https://exemplo.com/foto11.jpg"]',
          'Alugada',
          '2022-12-15',
          4.3,
          false
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Studio Praia Fortaleza',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Av. Beira Mar, 2500 - Apt 801 - Meireles - Fortaleza/CE - CEP: 60165-121',
          32.00,
          1100.00,
          'Studio frente mar em Fortaleza',
          '1 quarto, 1 banheiro, varanda com vista mar, mobiliada',
          '["https://exemplo.com/foto12.jpg", "https://exemplo.com/foto13.jpg"]',
          'Disponivel',
          '2023-04-10',
          4.6,
          true
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d486',
          'Kitnet Estudantil A',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Rua Itajaí, 150 - Apt 201 - Centro - Blumenau/SC - CEP: 89010-500',
          20.00,
          600.00,
          'Kitnet ideal para estudantes universitários',
          '1 ambiente, 1 banheiro, mobiliada, internet incluída',
          '["https://exemplo.com/foto14.jpg"]',
          'Alugada',
          '2023-01-05',
          4.0,
          false
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d487',
          'Kitnet Estudantil B',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Rua Itajaí, 150 - Apt 202 - Centro - Blumenau/SC - CEP: 89010-500',
          20.00,
          600.00,
          'Kitnet geminada com a A, ideal para estudantes',
          '1 ambiente, 1 banheiro, mobiliada, lavanderia compartilhada',
          '["https://exemplo.com/foto15.jpg"]',
          'Disponivel',
          '2023-01-05',
          3.8,
          false
        ),
        (
          'k47ac10b-58cc-4372-a567-0e02b2c3d488',
          'Loft Moderno SC',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Rua 7 de Setembro, 890 - Loft 3 - Centro - Blumenau/SC - CEP: 89010-200',
          40.00,
          850.00,
          'Loft amplo no centro de Blumenau',
          '1 quarto, 1 banheiro, cozinha americana, área de trabalho',
          '["https://exemplo.com/foto16.jpg", "https://exemplo.com/foto17.jpg"]',
          'Bloqueada',
          '2022-10-20',
          4.4,
          false
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ KitnetSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar KitnetSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

