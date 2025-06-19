import { DataSource } from 'typeorm';

export class ManutencaoSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir manutenções
      await queryRunner.query(`
        INSERT INTO manutencao (
          id, kitnet_associada_id, solicitante_id, tipo, categoria,
          descricao_problema, fotos_problema_urls, prioridade, status,
          data_agendada, prestador_servico, contato_prestador,
          data_conclusao, descricao_servico_realizado, fotos_servico_urls,
          valor_gasto, despesa_associada_id, observacoes
        ) VALUES 
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d479',
          'k47ac10b-58cc-4372-a567-0e02b2c3d479',
          'd47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Corretiva',
          'Eletrica',
          'Chuveiro elétrico não está aquecendo a água adequadamente',
          '["https://exemplo.com/problema1.jpg", "https://exemplo.com/problema2.jpg"]',
          'Alta',
          'Concluida',
          '2024-06-05 14:00:00',
          'Eletricista João Silva',
          '(11) 99999-1234',
          '2024-06-05 16:30:00',
          'Substituição da resistência do chuveiro elétrico. Testado e funcionando perfeitamente.',
          '["https://exemplo.com/servico1.jpg", "https://exemplo.com/servico2.jpg"]',
          150.00,
          'de7ac10b-58cc-4372-a567-0e02b2c3d479',
          'Serviço realizado com sucesso. Inquilino satisfeito.'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d480',
          'k47ac10b-58cc-4372-a567-0e02b2c3d481',
          'd47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Corretiva',
          'Hidraulica',
          'Vazamento na torneira da pia da cozinha',
          '["https://exemplo.com/vazamento1.jpg"]',
          'Media',
          'Em_Andamento',
          '2024-06-20 09:00:00',
          'Encanador Mario Santos',
          '(21) 88888-5678',
          NULL,
          NULL,
          NULL,
          0.00,
          NULL,
          'Agendado para amanhã pela manhã'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d481',
          'k47ac10b-58cc-4372-a567-0e02b2c3d483',
          'd47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Corretiva',
          'Hidraulica',
          'Pia da cozinha entupida, água não escoa',
          '["https://exemplo.com/entupimento1.jpg"]',
          'Alta',
          'Concluida',
          '2024-06-10 10:00:00',
          'Desentupidora Express',
          '(31) 77777-9012',
          '2024-06-10 11:30:00',
          'Desentupimento realizado com equipamento especializado. Problema resolvido.',
          '["https://exemplo.com/desentupimento_depois.jpg"]',
          120.00,
          'de7ac10b-58cc-4372-a567-0e02b2c3d483',
          'Serviço rápido e eficiente'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d482',
          'k47ac10b-58cc-4372-a567-0e02b2c3d485',
          'd47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Preventiva',
          'Outros',
          'Limpeza e manutenção do ar condicionado',
          NULL,
          'Baixa',
          'Concluida',
          '2024-04-15 14:00:00',
          'Refrigeração Fortaleza',
          '(85) 66666-3456',
          '2024-04-15 16:00:00',
          'Limpeza completa do ar condicionado, troca de filtros e recarga de gás.',
          '["https://exemplo.com/ar_limpo.jpg"]',
          250.00,
          'de7ac10b-58cc-4372-a567-0e02b2c3d488',
          'Manutenção preventiva realizada com sucesso'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d483',
          'k47ac10b-58cc-4372-a567-0e02b2c3d486',
          'd47ac10b-58cc-4372-a567-0e02b2c3d484',
          'Corretiva',
          'Outros',
          'Fechadura da porta principal travando',
          '["https://exemplo.com/fechadura_problema.jpg"]',
          'Media',
          'Concluida',
          '2024-01-10 08:00:00',
          'Chaveiro 24h Blumenau',
          '(47) 55555-7890',
          '2024-01-10 09:30:00',
          'Substituição completa da fechadura por modelo mais moderno e seguro.',
          '["https://exemplo.com/fechadura_nova.jpg"]',
          80.00,
          'de7ac10b-58cc-4372-a567-0e02b2c3d485',
          'Inquilino recebeu 3 cópias da chave'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d484',
          'k47ac10b-58cc-4372-a567-0e02b2c3d482',
          'd47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Corretiva',
          'Estrutural',
          'Azulejos do banheiro com trincas e alguns soltos',
          '["https://exemplo.com/azulejos1.jpg", "https://exemplo.com/azulejos2.jpg"]',
          'Media',
          'Concluida',
          '2024-05-10 13:00:00',
          'Azulejista Profissional RJ',
          '(21) 99999-0000',
          '2024-05-10 17:00:00',
          'Substituição de 12 azulejos danificados e rejunte completo do banheiro.',
          '["https://exemplo.com/banheiro_reformado.jpg"]',
          400.00,
          'de7ac10b-58cc-4372-a567-0e02b2c3d490',
          'Banheiro ficou como novo'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d485',
          'k47ac10b-58cc-4372-a567-0e02b2c3d480',
          'd47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Corretiva',
          'Eletrica',
          'Tomada da cozinha não está funcionando',
          '["https://exemplo.com/tomada_problema.jpg"]',
          'Media',
          'Aberto',
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          0.00,
          NULL,
          'Aguardando agendamento com eletricista'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d486',
          'k47ac10b-58cc-4372-a567-0e02b2c3d484',
          'd47ac10b-58cc-4372-a567-0e02b2c3d488',
          'Preventiva',
          'Pintura',
          'Pintura das paredes está desbotada',
          '["https://exemplo.com/parede_desbotada.jpg"]',
          'Baixa',
          'Agendada',
          '2024-06-25 08:00:00',
          'Pinturas BH Ltda',
          '(31) 88888-1111',
          NULL,
          NULL,
          NULL,
          0.00,
          NULL,
          'Pintura agendada para próxima semana'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d487',
          'k47ac10b-58cc-4372-a567-0e02b2c3d487',
          'd47ac10b-58cc-4372-a567-0e02b2c3d484',
          'Corretiva',
          'Outros',
          'Porta do armário da cozinha saiu do trilho',
          NULL,
          'Baixa',
          'Cancelada',
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          0.00,
          NULL,
          'Inquilino conseguiu resolver sozinho'
        ),
        (
          'm47ac10b-58cc-4372-a567-0e02b2c3d488',
          'k47ac10b-58cc-4372-a567-0e02b2c3d483',
          'd47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Corretiva',
          'Hidraulica',
          'Pressão da água do chuveiro muito baixa',
          '["https://exemplo.com/chuveiro_fraco.jpg"]',
          'Media',
          'Aberto',
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          NULL,
          0.00,
          NULL,
          'Verificar se é problema na bomba do prédio'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ ManutencaoSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar ManutencaoSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

