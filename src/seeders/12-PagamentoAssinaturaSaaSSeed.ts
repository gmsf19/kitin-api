import { DataSource } from 'typeorm';

export class PagamentoAssinaturaSaaSSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserir pagamentos de assinatura SaaS
      await queryRunner.query(`
        INSERT INTO pagamento_assinatura_saas (
          id, empresa_id, plano_id, valor_pago, data_pagamento,
          data_vencimento, data_proximo_vencimento, metodo_pagamento,
          status_pagamento, gateway_pagamento, id_transacao_gateway,
          comprovante_url, observacoes
        ) VALUES 
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d479',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          599.00,
          '2024-01-15 10:30:00',
          '2024-01-15',
          '2025-01-15',
          'Cartao_Credito',
          'Aprovado',
          'Stripe',
          'pi_1234567890abcdef',
          'https://exemplo.com/comprovante_stripe1.pdf',
          'Pagamento anual com desconto'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d480',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'f47ac10b-58cc-4372-a567-0e02b2c3d481',
          999.00,
          '2024-02-01 14:20:00',
          '2024-02-01',
          '2025-02-01',
          'PIX',
          'Aprovado',
          'PagSeguro',
          'REF123456789',
          'https://exemplo.com/comprovante_pix1.pdf',
          'Pagamento via PIX aprovado instantaneamente'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d481',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          299.00,
          '2024-01-30 09:15:00',
          '2024-01-30',
          '2025-01-30',
          'Boleto',
          'Aprovado',
          'Mercado Pago',
          'MP987654321',
          'https://exemplo.com/comprovante_boleto1.pdf',
          'Pagamento anual via boleto'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d482',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          59.90,
          '2024-06-01 16:45:00',
          '2024-06-01',
          '2024-07-01',
          'Cartao_Credito',
          'Aprovado',
          'Stripe',
          'pi_abcdef1234567890',
          'https://exemplo.com/comprovante_stripe2.pdf',
          'Pagamento mensal recorrente'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d483',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          29.90,
          '2024-05-15 11:30:00',
          '2024-05-15',
          '2024-06-15',
          'PIX',
          'Aprovado',
          'PagSeguro',
          'REF987654321',
          'https://exemplo.com/comprovante_pix2.pdf',
          'Primeiro pagamento após período de teste'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d484',
          'e47ac10b-58cc-4372-a567-0e02b2c3d479',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          59.90,
          '2024-06-15 08:20:00',
          '2024-06-15',
          '2024-07-15',
          'Cartao_Debito',
          'Aprovado',
          'Stripe',
          'pi_fedcba0987654321',
          'https://exemplo.com/comprovante_debito1.pdf',
          'Pagamento mensal via cartão de débito'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d485',
          'e47ac10b-58cc-4372-a567-0e02b2c3d480',
          'f47ac10b-58cc-4372-a567-0e02b2c3d481',
          99.90,
          '2024-05-01 13:10:00',
          '2024-05-01',
          '2024-06-01',
          'Transferencia',
          'Aprovado',
          'Banco do Brasil',
          'TED123456789',
          'https://exemplo.com/comprovante_ted1.pdf',
          'Pagamento via transferência bancária'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d486',
          'e47ac10b-58cc-4372-a567-0e02b2c3d481',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          29.90,
          '2024-04-30 15:45:00',
          '2024-04-30',
          '2024-05-30',
          'PIX',
          'Aprovado',
          'PagSeguro',
          'REF456789123',
          'https://exemplo.com/comprovante_pix3.pdf',
          'Pagamento mensal em dia'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d487',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          59.90,
          '2024-05-01 12:00:00',
          '2024-05-01',
          '2024-06-01',
          'Cartao_Credito',
          'Aprovado',
          'Stripe',
          'pi_123abc456def789',
          'https://exemplo.com/comprovante_stripe3.pdf',
          'Renovação mensal automática'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d488',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          29.90,
          '2024-04-15 17:30:00',
          '2024-04-15',
          '2024-05-15',
          'Boleto',
          'Aprovado',
          'Mercado Pago',
          'MP111222333',
          'https://exemplo.com/comprovante_boleto2.pdf',
          'Pagamento via boleto bancário'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d489',
          'e47ac10b-58cc-4372-a567-0e02b2c3d483',
          'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          29.90,
          '2024-06-15 10:15:00',
          '2024-06-15',
          '2024-07-15',
          'PIX',
          'Pendente',
          'PagSeguro',
          'REF789123456',
          NULL,
          'Pagamento em processamento'
        ),
        (
          'p47ac10b-58cc-4372-a567-0e02b2c3d490',
          'e47ac10b-58cc-4372-a567-0e02b2c3d482',
          'f47ac10b-58cc-4372-a567-0e02b2c3d480',
          59.90,
          '2024-03-01 14:25:00',
          '2024-03-01',
          '2024-04-01',
          'Cartao_Credito',
          'Rejeitado',
          'Stripe',
          'pi_rejected123456',
          NULL,
          'Cartão sem limite suficiente - cliente notificado'
        );
      `);

      await queryRunner.commitTransaction();
      console.log('✅ PagamentoAssinaturaSaaSSeed executado com sucesso!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erro ao executar PagamentoAssinaturaSaaSSeed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

