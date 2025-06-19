import { DataSource } from 'typeorm';

export class AvaliacaoSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir avaliações
      await queryRunner.query(`
        INSERT INTO avaliacao (
          id, tipo, avaliador_id, kitnet_avaliada_id, inquilino_avaliado_id,
          nota, comentario, contrato_associado_id, status
        ) VALUES 
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Inquilino_para_Kitnet',
          'd47ac10b-58cc-4372-a567-0e02b2c3d485',
          'k47ac10b-58cc-4372-a567-0e02b2c3d479',
          NULL,
          4,
          'Kitnet muito bem localizada e mobiliada. Apenas o chuveiro que deu problema, mas foi resolvido rapidamente. Recomendo!',
          'c47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Locador_para_Inquilino',
          'd47ac10b-58cc-4372-a567-0e02b2c3d480',
          NULL,
          'i47ac10b-58cc-4372-a567-0e02b2c3d479',
          5,
          'Inquilino exemplar! Sempre paga em dia, cuida muito bem do imóvel e é muito educado. Espero que renove o contrato.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Inquilino_para_Kitnet',
          'd47ac10b-58cc-4372-a567-0e02b2c3d487',
          'k47ac10b-58cc-4372-a567-0e02b2c3d481',
          NULL,
          5,
          'Studio incrível! Vista maravilhosa, muito bem equipado e a localização é perfeita. Proprietária muito atenciosa.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Locador_para_Inquilino',
          'd47ac10b-58cc-4372-a567-0e02b2c3d481',
          NULL,
          'i47ac10b-58cc-4372-a567-0e02b2c3d481',
          5,
          'Rafael é um inquilino perfeito. Profissional sério, paga sempre antecipado e mantém o imóvel impecável.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Inquilino_para_Kitnet',
          'd47ac10b-58cc-4372-a567-0e02b2c3d488',
          'k47ac10b-58cc-4372-a567-0e02b2c3d484',
          NULL,
          4,
          'Kitnet boa para o preço. Localização excelente no centro de BH. Apenas a pintura que estava um pouco desgastada.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d484',
          'Locador_para_Inquilino',
          'd47ac10b-58cc-4372-a567-0e02b2c3d482',
          NULL,
          'i47ac10b-58cc-4372-a567-0e02b2c3d482',
          4,
          'Fernanda é uma inquilina responsável e cuidadosa. Sempre comunica qualquer problema e paga em dia.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Inquilino_para_Kitnet',
          'd47ac10b-58cc-4372-a567-0e02b2c3d485',
          'k47ac10b-58cc-4372-a567-0e02b2c3d486',
          NULL,
          4,
          'Kitnet perfeita para estudante. Mobiliada, internet boa e preço justo. Apenas o espaço que é bem compacto.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d486',
          'Locador_para_Inquilino',
          'd47ac10b-58cc-4372-a567-0e02b2c3d484',
          NULL,
          'i47ac10b-58cc-4372-a567-0e02b2c3d483',
          4,
          'Bruno é um estudante exemplar. Respeitoso, organizado e sempre paga em dia. Recomendo para outros proprietários.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Ativa'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d487',
          'Inquilino_para_Kitnet',
          'd47ac10b-58cc-4372-a567-0e02b2c3d486',
          'k47ac10b-58cc-4372-a567-0e02b2c3d480',
          NULL,
          3,
          'Kitnet boa, mas teve alguns problemas de manutenção. A localização é excelente, mas o preço poderia ser melhor.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Arquivada'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d488',
          'Locador_para_Inquilino',
          'd47ac10b-58cc-4372-a567-0e02b2c3d480',
          NULL,
          'i47ac10b-58cc-4372-a567-0e02b2c3d480',
          4,
          'Juliana foi uma boa inquilina durante o período que ficou. Cuidadosa com o imóvel e sempre educada.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d483',
          'Arquivada'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d489',
          'Inquilino_para_Kitnet',
          'd47ac10b-58cc-4372-a567-0e02b2c3d487',
          'k47ac10b-58cc-4372-a567-0e02b2c3d482',
          NULL,
          2,
          'Imóvel com muitos problemas de manutenção. Azulejos soltos, vazamentos. Não recomendo até que sejam feitos os reparos.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Arquivada'
        ),
        (
          'a47ac10b-58cc-4372-a567-0e02b2c3d490',
          'Locador_para_Inquilino',
          'd47ac10b-58cc-4372-a567-0e02b2c3d481',
          NULL,
          'i47ac10b-58cc-4372-a567-0e02b2c3d485',
          2,
          'Inquilino com histórico de atrasos frequentes nos pagamentos. Não cuidava bem do imóvel.',
          'c47ac10b-58cc-4372-a567-0e02b2c3d485',
          'Arquivada'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ AvaliacaoSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar AvaliacaoSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

