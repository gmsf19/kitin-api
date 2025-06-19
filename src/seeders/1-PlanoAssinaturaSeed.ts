import { DataSource } from 'typeorm';

export class PlanoAssinaturaSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir planos de assinatura
      await queryRunner.query(`
        INSERT INTO plano_assinatura (
          id, nome, descricao, preco_mensal, preco_anual, limite_kitnets, 
          limite_usuarios_admin, funcionalidades_incluidas, status
        ) VALUES 
        (
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          'Básico',
          'Plano ideal para pequenos proprietários com até 5 kitnets',
          29.90,
          299.00,
          5,
          1,
          'Gestão de contratos, Controle de pagamentos, Relatórios básicos, Suporte por email',
          'Ativo'
        ),
        (
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          'Intermediário',
          'Plano para proprietários com carteira média de imóveis',
          59.90,
          599.00,
          15,
          3,
          'Todas as funcionalidades do Básico, Gestão de manutenções, Avaliações, Relatórios avançados, Suporte prioritário',
          'Ativo'
        ),
        (
          'f47ac10b-58cc-4372-a567-0e02b2c3d481',
          'Premium',
          'Plano completo para grandes proprietários e imobiliárias',
          99.90,
          999.00,
          50,
          10,
          'Todas as funcionalidades, API personalizada, Integração com gateways de pagamento, Suporte 24/7, Relatórios personalizados',
          'Ativo'
        ),
        (
          'f47ac10b-58cc-4372-a567-0e02b2c3d482',
          'Enterprise',
          'Plano para grandes empresas com necessidades específicas',
          199.90,
          1999.00,
          999,
          50,
          'Todas as funcionalidades Premium, Customizações, Treinamento presencial, Gerente de conta dedicado',
          'Ativo'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ PlanoAssinaturaSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar PlanoAssinaturaSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
