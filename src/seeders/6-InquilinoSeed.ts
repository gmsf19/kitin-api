import { DataSource } from 'typeorm';

export class InquilinoSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir inquilinos
      await queryRunner.query(`
        INSERT INTO inquilino (
          id, nome_completo, cpf, rg, data_nascimento, email, telefone,
          profissao, local_trabalho, renda_mensal, comprovante_renda_url,
          foto_url, empresa_associada_id, usuario_acesso_id, nota_media_inquilino, status
        ) VALUES 
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Lucas Ferreira',
          '123.456.789-01',
          '12.345.678-9',
          '1995-03-15',
          'lucas.ferreira@email.com',
          '(11) 99999-1111',
          'Desenvolvedor de Software',
          'Tech Solutions Ltda',
          5500.00,
          'https://exemplo.com/comprovante1.pdf',
          'https://exemplo.com/foto_lucas.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'd47ac10b-58cc-4372-a567-0e02b2c3d485',
          4.5,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Juliana Costa',
          '987.654.321-02',
          '98.765.432-1',
          '1992-07-22',
          'juliana.costa@email.com',
          '(11) 88888-2222',
          'Designer Gráfica',
          'Creative Agency',
          4200.00,
          'https://exemplo.com/comprovante2.pdf',
          'https://exemplo.com/foto_juliana.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'd47ac10b-58cc-4372-a567-0e02b2c3d486',
          4.2,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Rafael Santos',
          '456.789.123-03',
          '45.678.912-3',
          '1988-11-08',
          'rafael.santos@email.com',
          '(21) 77777-3333',
          'Advogado',
          'Escritório Santos & Associados',
          8500.00,
          'https://exemplo.com/comprovante3.pdf',
          'https://exemplo.com/foto_rafael.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'd47ac10b-58cc-4372-a567-0e02b2c3d487',
          4.8,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Fernanda Silva',
          '789.123.456-04',
          '78.912.345-6',
          '1990-05-12',
          'fernanda.silva@email.com',
          '(31) 66666-4444',
          'Professora',
          'Colégio Estadual MG',
          3800.00,
          'https://exemplo.com/comprovante4.pdf',
          'https://exemplo.com/foto_fernanda.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'd47ac10b-58cc-4372-a567-0e02b2c3d488',
          4.1,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Bruno Oliveira',
          '321.654.987-05',
          '32.165.498-7',
          '1993-09-30',
          'bruno.oliveira@email.com',
          '(47) 55555-5555',
          'Estudante de Engenharia',
          'FURB - Universidade Regional de Blumenau',
          1200.00,
          'https://exemplo.com/comprovante5.pdf',
          'https://exemplo.com/foto_bruno.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          NULL,
          4.0,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d484',
          'Camila Rodrigues',
          '654.987.321-06',
          '65.498.732-1',
          '1991-12-18',
          'camila.rodrigues@email.com',
          '(85) 44444-6666',
          'Enfermeira',
          'Hospital Geral de Fortaleza',
          4500.00,
          'https://exemplo.com/comprovante6.pdf',
          'https://exemplo.com/foto_camila.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          NULL,
          4.3,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Diego Almeida',
          '147.258.369-07',
          '14.725.836-9',
          '1989-04-25',
          'diego.almeida@email.com',
          '(21) 33333-7777',
          'Contador',
          'Contabilidade Rio Ltda',
          5200.00,
          'https://exemplo.com/comprovante7.pdf',
          'https://exemplo.com/foto_diego.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          NULL,
          3.9,
          'Inadimplente'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d486',
          'Patrícia Lima',
          '258.369.147-08',
          '25.836.914-7',
          '1994-08-14',
          'patricia.lima@email.com',
          '(31) 22222-8888',
          'Arquiteta',
          'Arquitetura & Design BH',
          6200.00,
          'https://exemplo.com/comprovante8.pdf',
          'https://exemplo.com/foto_patricia.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          NULL,
          4.6,
          'Inativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d487',
          'Thiago Martins',
          '369.147.258-09',
          '36.914.725-8',
          '1996-01-03',
          'thiago.martins@email.com',
          '(47) 11111-9999',
          'Estudante de Administração',
          'Universidade de Blumenau',
          800.00,
          'https://exemplo.com/comprovante9.pdf',
          'https://exemplo.com/foto_thiago.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          NULL,
          3.7,
          'Ativo'
        ),
        (
          'i47ac10b-58cc-4372-a567-0e02b2c3d488',
          'Larissa Pereira',
          '741.852.963-10',
          '74.185.296-3',
          '1987-10-20',
          'larissa.pereira@email.com',
          '(85) 99999-0000',
          'Fisioterapeuta',
          'Clínica Reabilitação CE',
          4800.00,
          'https://exemplo.com/comprovante10.pdf',
          'https://exemplo.com/foto_larissa.jpg',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          NULL,
          4.4,
          'Ativo'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ InquilinoSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar InquilinoSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

