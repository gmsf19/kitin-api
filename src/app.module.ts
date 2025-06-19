import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanoAssinatura } from './entities/plano-assinatura.entity';
import { Empresa } from './entities/empresa.entity';
import { User } from './entities/user.entity';
import { ConfiguracoesEmpresa } from './entities/configuracoes-empresa.entity';
import { Kitnet } from './entities/kitnet.entity';
import { Inquilino } from './entities/inquilino.entity';
import { ContratoLocacao } from './entities/contrato-locacao.entity';
import { Fatura } from './entities/fatura.entity';
import { PagamentoAssinaturaSaaS } from './entities/pagamento-assinatura-saas.entity';
import { Despesa } from './entities/despesa.entity';
import { Manutencao } from './entities/manutencao.entity';
import { Avaliacao } from './entities/avaliacao.entity';

// Importar todas as entities

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuração do TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'kitnet_db'),

        // Entities - lista explícita para evitar problemas de path
        entities: [
          PlanoAssinatura,
          Empresa,
          User,
          ConfiguracoesEmpresa,
          PagamentoAssinaturaSaaS,
          Kitnet,
          Inquilino,
          ContratoLocacao,
          Fatura,
          Despesa,
          Manutencao,
          Avaliacao,
        ],

        // Configurações de migrations
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsTableName: 'migrations_history',
        migrationsRun: false, // Não executar automaticamente

        // Configurações de desenvolvimento
        synchronize: false, // NUNCA true em produção
        logging:
          configService.get('NODE_ENV') === 'development'
            ? ['query', 'error']
            : ['error'],

        // Configurações de conexão
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        extra: {
          connectionLimit: 10,
        },
      }),
      inject: [ConfigService],
    }),

    // Registrar entities para injeção de dependência
    TypeOrmModule.forFeature([
      PlanoAssinatura,
      Empresa,
      User,
      ConfiguracoesEmpresa,
      PagamentoAssinaturaSaaS,
      Kitnet,
      Inquilino,
      ContratoLocacao,
      Fatura,
      Despesa,
      Manutencao,
      Avaliacao,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
