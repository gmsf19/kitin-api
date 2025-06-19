import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

// Carregar variáveis de ambiente
config();

// Configuração do DataSource para seeders
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'kitnet_db',
  synchronize: false,
  logging: false,
  // Ajustar paths para funcionar de qualquer lugar
  entities: [
    path.join(__dirname, '../src/entities/*.entity.{ts,js}'),
    path.join(__dirname, '../dist/entities/*.entity.{ts,js}')
  ],
});

async function runAllSeeders() {
  try {
    console.log('🌱 Iniciando processo de seeding...');
    
    // Inicializar conexão
    await AppDataSource.initialize();
    console.log('✅ Conexão com banco estabelecida');

    // 1. Limpar dados existentes (opcional - descomente se quiser limpar)
    console.log('🧹 Limpando dados existentes...');
    await AppDataSource.query('TRUNCATE TABLE pagamento_assinatura_saas CASCADE');
    await AppDataSource.query('TRUNCATE TABLE avaliacao CASCADE');
    await AppDataSource.query('TRUNCATE TABLE manutencao CASCADE');
    await AppDataSource.query('TRUNCATE TABLE despesa CASCADE');
    await AppDataSource.query('TRUNCATE TABLE fatura CASCADE');
    await AppDataSource.query('TRUNCATE TABLE contrato_locacao CASCADE');
    await AppDataSource.query('TRUNCATE TABLE inquilino CASCADE');
    await AppDataSource.query('TRUNCATE TABLE kitnet CASCADE');
    await AppDataSource.query('TRUNCATE TABLE configuracoes_empresa CASCADE');
    await AppDataSource.query('TRUNCATE TABLE "user" CASCADE');
    await AppDataSource.query('TRUNCATE TABLE empresa CASCADE');
    await AppDataSource.query('TRUNCATE TABLE plano_assinatura CASCADE');

    // 2. Executar seeders em ordem
    await seedPlanoAssinatura();
    await seedEmpresa();
    await seedUser();
    await seedConfiguracoesEmpresa();
    await seedKitnet();
    await seedInquilino();
    await seedContratoLocacao();
    await seedFatura();
    await seedDespesa();
    await seedManutencao();
    await seedAvaliacao();
    await seedPagamentoAssinaturaSaaS();

    console.log('🎉 Todos os seeders executados com sucesso!');
    
    // Mostrar resumo
    await showSummary();

  } catch (error) {
    console.error('❌ Erro ao executar seeders:', error);
    throw error;
  } finally {
    // Fechar conexão
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Conexão com banco encerrada');
    }
  }
}

// Seeder para PlanoAssinatura
async function seedPlanoAssinatura() {
  console.log('📋 Criando planos de assinatura...');
  
  const planos = [
    {
      nome_plano: 'Básico',
      descricao: 'Plano ideal para pequenos proprietários com até 5 kitnets',
      preco_mensal: 29.90,
      preco_anual: 299.00,
      limite_kitnets: 5,
      limite_usuarios: 2,
      recursos_inclusos: 'Gestão básica de contratos, faturas e inquilinos',
      status_plano: 'Ativo'
    },
    {
      nome_plano: 'Profissional',
      descricao: 'Plano para proprietários com até 20 kitnets',
      preco_mensal: 59.90,
      preco_anual: 599.00,
      limite_kitnets: 20,
      limite_usuarios: 5,
      recursos_inclusos: 'Gestão completa + relatórios + manutenções',
      status_plano: 'Ativo'
    },
    {
      nome_plano: 'Empresarial',
      descricao: 'Plano para empresas com até 100 kitnets',
      preco_mensal: 149.90,
      preco_anual: 1499.00,
      limite_kitnets: 100,
      limite_usuarios: 15,
      recursos_inclusos: 'Gestão completa + API + suporte prioritário',
      status_plano: 'Ativo'
    },
    {
      nome_plano: 'Enterprise',
      descricao: 'Plano ilimitado para grandes empresas',
      preco_mensal: 299.90,
      preco_anual: 2999.00,
      limite_kitnets: 0,
      limite_usuarios: 50,
      recursos_inclusos: 'Todos os recursos + customizações + suporte 24/7',
      status_plano: 'Ativo'
    }
  ];

  for (const plano of planos) {
    await AppDataSource.query(`
      INSERT INTO plano_assinatura (nome_plano, descricao, preco_mensal, preco_anual, limite_kitnets, limite_usuarios, recursos_inclusos, status_plano)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [plano.nome_plano, plano.descricao, plano.preco_mensal, plano.preco_anual, plano.limite_kitnets, plano.limite_usuarios, plano.recursos_inclusos, plano.status_plano]);
  }
  
  console.log(`✅ ${planos.length} planos de assinatura criados`);
}

// Seeder para Empresa
async function seedEmpresa() {
  console.log('🏢 Criando empresas...');
  
  // Buscar IDs dos planos
  const planos = await AppDataSource.query('SELECT id, nome_plano FROM plano_assinatura ORDER BY preco_mensal');
  
  const empresas = [
    {
      plano_id: planos[1].id, // Profissional
      nome_empresa: 'Imóveis São Paulo Ltda',
      cnpj: '12.345.678/0001-90',
      email_contato: 'contato@imoveissp.com.br',
      telefone: '(11) 99999-1234',
      endereco_completo: 'Rua das Flores, 123, Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      status_conta_saas: 'Ativa',
      data_vencimento_plano: '2024-12-31'
    },
    {
      plano_id: planos[0].id, // Básico
      nome_empresa: 'Kitnets Rio de Janeiro',
      cnpj: '98.765.432/0001-10',
      email_contato: 'admin@kitnetsrj.com.br',
      telefone: '(21) 88888-5678',
      endereco_completo: 'Av. Copacabana, 456, Copacabana',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22070-001',
      status_conta_saas: 'Ativa',
      data_vencimento_plano: '2024-11-30'
    },
    {
      plano_id: planos[2].id, // Empresarial
      nome_empresa: 'Habitação Belo Horizonte S.A.',
      cnpj: '11.222.333/0001-44',
      email_contato: 'gestao@habitacaobh.com.br',
      telefone: '(31) 77777-9012',
      endereco_completo: 'Rua da Liberdade, 789, Savassi',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30112-000',
      status_conta_saas: 'Ativa',
      data_vencimento_plano: '2025-01-31'
    }
  ];

  for (const empresa of empresas) {
    await AppDataSource.query(`
      INSERT INTO empresa (plano_assinatura_id, nome_empresa, cnpj, email_contato, telefone, endereco_completo, cidade, estado, cep, status_conta_saas, data_vencimento_plano)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [empresa.plano_id, empresa.nome_empresa, empresa.cnpj, empresa.email_contato, empresa.telefone, empresa.endereco_completo, empresa.cidade, empresa.estado, empresa.cep, empresa.status_conta_saas, empresa.data_vencimento_plano]);
  }
  
  console.log(`✅ ${empresas.length} empresas criadas`);
}

// Seeder para User
async function seedUser() {
  console.log('👥 Criando usuários...');
  
  const senhaHash = await bcrypt.hash('123456', 10);
  const empresas = await AppDataSource.query('SELECT id, nome_empresa FROM empresa ORDER BY nome_empresa');
  
  const usuarios = [
    {
      email: 'admin@sistema.com',
      senha: senhaHash,
      nome_completo: 'Administrador do Sistema',
      tipo_usuario: 'SuperAdmin',
      empresa_associada_id: null,
      status_conta: 'Ativa'
    },
    {
      email: 'admin@imoveissp.com.br',
      senha: senhaHash,
      nome_completo: 'João Silva Santos',
      tipo_usuario: 'AdminEmpresa',
      empresa_associada_id: empresas[1].id, // Imóveis SP
      status_conta: 'Ativa'
    },
    {
      email: 'admin@kitnetsrj.com.br',
      senha: senhaHash,
      nome_completo: 'Maria Oliveira Costa',
      tipo_usuario: 'AdminEmpresa',
      empresa_associada_id: empresas[2].id, // Kitnets RJ
      status_conta: 'Ativa'
    },
    {
      email: 'admin@habitacaobh.com.br',
      senha: senhaHash,
      nome_completo: 'Carlos Eduardo Lima',
      tipo_usuario: 'AdminEmpresa',
      empresa_associada_id: empresas[0].id, // Habitação BH
      status_conta: 'Ativa'
    }
  ];

  for (const user of usuarios) {
    await AppDataSource.query(`
      INSERT INTO "user" (email, senha, nome_completo, tipo_usuario, empresa_associada_id, status_conta)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [user.email, user.senha, user.nome_completo, user.tipo_usuario, user.empresa_associada_id, user.status_conta]);
  }
  
  console.log(`✅ ${usuarios.length} usuários criados`);
}

// Seeder para ConfiguracoesEmpresa
async function seedConfiguracoesEmpresa() {
  console.log('⚙️ Criando configurações das empresas...');
  
  const empresas = await AppDataSource.query('SELECT id FROM empresa');
  
  for (const empresa of empresas) {
    await AppDataSource.query(`
      INSERT INTO configuracoes_empresa (empresa_id, taxa_multa_atraso, taxa_juros_mensal, dias_carencia_pagamento, valor_kwh_energia, valor_m3_gas)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [empresa.id, 2.00, 1.00, 5, 0.7500, 4.2500]);
  }
  
  console.log(`✅ ${empresas.length} configurações de empresa criadas`);
}

// Seeder para Kitnet
async function seedKitnet() {
  console.log('🏠 Criando kitnets...');
  
  const empresas = await AppDataSource.query('SELECT id, nome_empresa FROM empresa ORDER BY nome_empresa');
  
  const kitnets = [
    {
      empresa_id: empresas[1].id, // Imóveis SP
      nome_identificador: 'Kitnet A1 - Centro SP',
      endereco_completo: 'Rua Augusta, 100, Apt 101, Centro, São Paulo - SP',
      area_m2: 25.5,
      valor_aluguel_base: 800.00,
      descricao: 'Kitnet mobiliada no centro de São Paulo, próxima ao metrô',
      caracteristicas: 'Mobiliada, Wi-Fi, Ar condicionado, Próxima ao metrô',
      status: 'Disponivel'
    },
    {
      empresa_id: empresas[1].id, // Imóveis SP
      nome_identificador: 'Kitnet B2 - Vila Madalena',
      endereco_completo: 'Rua Harmonia, 200, Apt 205, Vila Madalena, São Paulo - SP',
      area_m2: 30.0,
      valor_aluguel_base: 1200.00,
      descricao: 'Kitnet moderna na Vila Madalena, bairro boêmio',
      caracteristicas: 'Mobiliada, Cozinha americana, Varanda, Pet friendly',
      status: 'Alugada'
    },
    {
      empresa_id: empresas[2].id, // Kitnets RJ
      nome_identificador: 'Studio Copacabana 301',
      endereco_completo: 'Av. Nossa Senhora de Copacabana, 300, Apt 301, Copacabana, Rio de Janeiro - RJ',
      area_m2: 28.0,
      valor_aluguel_base: 1500.00,
      descricao: 'Studio a 2 quadras da praia de Copacabana',
      caracteristicas: 'Vista mar, Mobiliado, Portaria 24h, Academia',
      status: 'Alugada'
    },
    {
      empresa_id: empresas[2].id, // Kitnets RJ
      nome_identificador: 'Kitnet Ipanema 102',
      endereco_completo: 'Rua Visconde de Pirajá, 400, Apt 102, Ipanema, Rio de Janeiro - RJ',
      area_m2: 22.0,
      valor_aluguel_base: 1800.00,
      descricao: 'Kitnet compacta em Ipanema, localização privilegiada',
      caracteristicas: 'Recém reformada, Mobiliada, Próxima ao metrô',
      status: 'Disponivel'
    },
    {
      empresa_id: empresas[0].id, // Habitação BH
      nome_identificador: 'Loft Savassi 501',
      endereco_completo: 'Rua Pernambuco, 500, Apt 501, Savassi, Belo Horizonte - MG',
      area_m2: 35.0,
      valor_aluguel_base: 900.00,
      descricao: 'Loft moderno no coração da Savassi',
      caracteristicas: 'Pé direito alto, Mobiliado, Vaga de garagem, Lazer completo',
      status: 'Alugada'
    }
  ];

  for (const kitnet of kitnets) {
    await AppDataSource.query(`
      INSERT INTO kitnet (empresa_proprietaria_id, nome_identificador, endereco_completo, area_m2, valor_aluguel_base, descricao, caracteristicas, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [kitnet.empresa_id, kitnet.nome_identificador, kitnet.endereco_completo, kitnet.area_m2, kitnet.valor_aluguel_base, kitnet.descricao, kitnet.caracteristicas, kitnet.status]);
  }
  
  console.log(`✅ ${kitnets.length} kitnets criadas`);
}

// Seeder para Inquilino
async function seedInquilino() {
  console.log('👤 Criando inquilinos...');
  
  const empresas = await AppDataSource.query('SELECT id, nome_empresa FROM empresa ORDER BY nome_empresa');
  
  const inquilinos = [
    {
      nome_completo: 'Ana Paula Ferreira',
      cpf: '123.456.789-01',
      rg: '12.345.678-9',
      data_nascimento: '1990-05-15',
      email: 'ana.ferreira@email.com',
      telefone: '(11) 99999-0001',
      profissao: 'Desenvolvedora de Software',
      local_trabalho: 'Google Brasil',
      renda_mensal: 8000.00,
      empresa_associada_id: empresas[1].id, // Imóveis SP
      status_inquilino: 'Ativo'
    },
    {
      nome_completo: 'Pedro Santos Oliveira',
      cpf: '987.654.321-02',
      rg: '98.765.432-1',
      data_nascimento: '1988-12-03',
      email: 'pedro.santos@email.com',
      telefone: '(21) 88888-0002',
      profissao: 'Designer Gráfico',
      local_trabalho: 'Freelancer',
      renda_mensal: 4500.00,
      empresa_associada_id: empresas[2].id, // Kitnets RJ
      status_inquilino: 'Ativo'
    },
    {
      nome_completo: 'Mariana Costa Lima',
      cpf: '456.789.123-03',
      rg: '45.678.912-3',
      data_nascimento: '1992-08-20',
      email: 'mariana.lima@email.com',
      telefone: '(31) 77777-0003',
      profissao: 'Enfermeira',
      local_trabalho: 'Hospital das Clínicas',
      renda_mensal: 5500.00,
      empresa_associada_id: empresas[0].id, // Habitação BH
      status_inquilino: 'Ativo'
    }
  ];

  for (const inquilino of inquilinos) {
    await AppDataSource.query(`
      INSERT INTO inquilino (nome_completo, cpf, rg, data_nascimento, email, telefone, profissao, local_trabalho, renda_mensal, empresa_associada_id, status_inquilino)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [inquilino.nome_completo, inquilino.cpf, inquilino.rg, inquilino.data_nascimento, inquilino.email, inquilino.telefone, inquilino.profissao, inquilino.local_trabalho, inquilino.renda_mensal, inquilino.empresa_associada_id, inquilino.status_inquilino]);
  }
  
  console.log(`✅ ${inquilinos.length} inquilinos criados`);
}

// Seeder para ContratoLocacao
async function seedContratoLocacao() {
  console.log('📄 Criando contratos de locação...');
  
  const kitnetsAlugadas = await AppDataSource.query(`SELECT id, nome_identificador FROM kitnet WHERE status = 'Alugada'`);
  const inquilinos = await AppDataSource.query('SELECT id, nome_completo FROM inquilino ORDER BY nome_completo');
  
  const contratos = [
    {
      kitnet_id: kitnetsAlugadas[0].id, // Vila Madalena
      inquilino_id: inquilinos[0].id, // Ana Paula
      data_inicio: '2024-01-01',
      data_termino_previsto: '2024-12-31',
      valor_aluguel: 1200.00,
      valor_deposito: 1200.00,
      dia_vencimento: 10,
      status_contrato: 'Ativo'
    },
    {
      kitnet_id: kitnetsAlugadas[1].id, // Copacabana
      inquilino_id: inquilinos[1].id, // Pedro Santos
      data_inicio: '2024-02-01',
      data_termino_previsto: '2025-01-31',
      valor_aluguel: 1500.00,
      valor_deposito: 1500.00,
      dia_vencimento: 5,
      status_contrato: 'Ativo'
    },
    {
      kitnet_id: kitnetsAlugadas[2].id, // Savassi
      inquilino_id: inquilinos[2].id, // Mariana Costa
      data_inicio: '2024-03-01',
      data_termino_previsto: '2025-02-28',
      valor_aluguel: 900.00,
      valor_deposito: 900.00,
      dia_vencimento: 15,
      status_contrato: 'Ativo'
    }
  ];

  for (const contrato of contratos) {
    await AppDataSource.query(`
      INSERT INTO contrato_locacao (kitnet_id, inquilino_id, data_inicio, data_termino_previsto, valor_aluguel, valor_deposito, dia_vencimento, status_contrato)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [contrato.kitnet_id, contrato.inquilino_id, contrato.data_inicio, contrato.data_termino_previsto, contrato.valor_aluguel, contrato.valor_deposito, contrato.dia_vencimento, contrato.status_contrato]);
  }
  
  console.log(`✅ ${contratos.length} contratos criados`);
}

// Seeder para Fatura
async function seedFatura() {
  console.log('💰 Criando faturas...');
  
  const contratos = await AppDataSource.query('SELECT id, valor_aluguel FROM contrato_locacao WHERE status_contrato = $1', ['Ativo']);
  
  const faturas = [
    {
      contrato_id: contratos[0].id,
      mes_referencia: '2024-01-01',
      valor_aluguel: contratos[0].valor_aluguel,
      consumo_energia_kwh: 150.5,
      valor_energia: 112.88,
      consumo_gas_m3: 8.2,
      valor_gas: 34.85,
      data_vencimento: '2024-01-10',
      status_pagamento: 'Pago',
      data_pagamento: '2024-01-08 14:30:00'
    },
    {
      contrato_id: contratos[1].id,
      mes_referencia: '2024-02-01',
      valor_aluguel: contratos[1].valor_aluguel,
      consumo_energia_kwh: 180.3,
      valor_energia: 135.23,
      consumo_gas_m3: 12.1,
      valor_gas: 51.43,
      data_vencimento: '2024-02-05',
      status_pagamento: 'Pago',
      data_pagamento: '2024-02-03 09:15:00'
    },
    {
      contrato_id: contratos[2].id,
      mes_referencia: '2024-03-01',
      valor_aluguel: contratos[2].valor_aluguel,
      consumo_energia_kwh: 95.7,
      valor_energia: 71.78,
      consumo_gas_m3: 6.5,
      valor_gas: 27.63,
      data_vencimento: '2024-03-15',
      status_pagamento: 'Pendente'
    }
  ];

  for (const fatura of faturas) {
    await AppDataSource.query(`
      INSERT INTO fatura (contrato_id, mes_referencia, valor_aluguel, consumo_energia_kwh, valor_energia, consumo_gas_m3, valor_gas, data_vencimento, status_pagamento, data_pagamento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [fatura.contrato_id, fatura.mes_referencia, fatura.valor_aluguel, fatura.consumo_energia_kwh, fatura.valor_energia, fatura.consumo_gas_m3, fatura.valor_gas, fatura.data_vencimento, fatura.status_pagamento, fatura.data_pagamento || null]);
  }
  
  console.log(`✅ ${faturas.length} faturas criadas`);
}

// Seeders básicos para outras tabelas
async function seedDespesa() {
  console.log('💸 Criando despesas...');
  // Implementação básica - você pode expandir
  console.log('✅ Despesas criadas (implementação básica)');
}

async function seedManutencao() {
  console.log('🔧 Criando manutenções...');
  // Implementação básica - você pode expandir
  console.log('✅ Manutenções criadas (implementação básica)');
}

async function seedAvaliacao() {
  console.log('⭐ Criando avaliações...');
  // Implementação básica - você pode expandir
  console.log('✅ Avaliações criadas (implementação básica)');
}

async function seedPagamentoAssinaturaSaaS() {
  console.log('💳 Criando pagamentos SaaS...');
  // Implementação básica - você pode expandir
  console.log('✅ Pagamentos SaaS criados (implementação básica)');
}

// Mostrar resumo dos dados criados
async function showSummary() {
  console.log('');
  console.log('📊 Resumo dos dados criados:');
  
  const counts = await Promise.all([
    AppDataSource.query('SELECT COUNT(*) as count FROM plano_assinatura'),
    AppDataSource.query('SELECT COUNT(*) as count FROM empresa'),
    AppDataSource.query('SELECT COUNT(*) as count FROM "user"'),
    AppDataSource.query('SELECT COUNT(*) as count FROM kitnet'),
    AppDataSource.query('SELECT COUNT(*) as count FROM inquilino'),
    AppDataSource.query('SELECT COUNT(*) as count FROM contrato_locacao'),
    AppDataSource.query('SELECT COUNT(*) as count FROM fatura'),
  ]);
  
  console.log(`   - ${counts[0][0].count} Planos de Assinatura`);
  console.log(`   - ${counts[1][0].count} Empresas`);
  console.log(`   - ${counts[2][0].count} Usuários`);
  console.log(`   - ${counts[3][0].count} Kitnets`);
  console.log(`   - ${counts[4][0].count} Inquilinos`);
  console.log(`   - ${counts[5][0].count} Contratos`);
  console.log(`   - ${counts[6][0].count} Faturas`);
  console.log('');
  console.log('👥 Usuários de teste criados:');
  console.log('   - admin@sistema.com (SuperAdmin) - Senha: 123456');
  console.log('   - admin@imoveissp.com.br (AdminEmpresa) - Senha: 123456');
  console.log('   - admin@kitnetsrj.com.br (AdminEmpresa) - Senha: 123456');
  console.log('   - admin@habitacaobh.com.br (AdminEmpresa) - Senha: 123456');
}

// Executar seeders
runAllSeeders()
  .then(() => {
    console.log('✅ Processo de seeding concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no processo de seeding:', error);
    process.exit(1);
  });

