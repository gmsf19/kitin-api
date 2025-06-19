import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Empresa } from './empresa.entity';

@Entity('configuracoes_empresa')
@Index('IDX_CONFIG_EMPRESA', ['empresa_id'], { unique: true })
export class ConfiguracoesEmpresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  empresa_id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  percentual_multa_atraso: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  percentual_juros_mensal: number;

  @Column({ type: 'integer', default: 5 })
  dias_tolerancia_atraso: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 0.75 })
  valor_kwh_energia: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 3.5 })
  valor_m3_gas: number;

  @Column({ type: 'text', nullable: true })
  template_contrato: string;

  @Column({ type: 'boolean', default: true })
  notificacoes_email: boolean;

  @Column({ type: 'boolean', default: false })
  notificacoes_sms: boolean;

  @Column({ type: 'integer', default: 3 })
  dias_antecedencia_vencimento: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @OneToOne(() => Empresa, (empresa) => empresa.configuracoes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // Métodos auxiliares
  calcularMultaAtraso(valorBase: number): number {
    return (valorBase * this.percentual_multa_atraso) / 100;
  }

  calcularJurosMensal(valorBase: number): number {
    return (valorBase * this.percentual_juros_mensal) / 100;
  }

  calcularValorEnergia(consumoKwh: number): number {
    return consumoKwh * this.valor_kwh_energia;
  }

  calcularValorGas(consumoM3: number): number {
    return consumoM3 * this.valor_m3_gas;
  }

  isNotificacaoEmailAtiva(): boolean {
    return this.notificacoes_email;
  }

  isNotificacaoSmsAtiva(): boolean {
    return this.notificacoes_sms;
  }

  getDiasToleranciaAtraso(): number {
    return this.dias_tolerancia_atraso;
  }

  getDiasAntecedenciaVencimento(): number {
    return this.dias_antecedencia_vencimento;
  }

  getTemplateContrato(): string {
    return this.template_contrato || this.getTemplateContratoDefault();
  }

  private getTemplateContratoDefault(): string {
    return `
  CONTRATO DE LOCAÇÃO RESIDENCIAL
  
  LOCADOR: {{nome_empresa}}
  CNPJ/CPF: {{cnpj_cpf}}
  Endereço: {{endereco_empresa}}
  
  LOCATÁRIO: {{nome_inquilino}}
  CPF: {{cpf_inquilino}}
  RG: {{rg_inquilino}}
  
  IMÓVEL: {{endereco_kitnet}}
  Descrição: {{descricao_kitnet}}
  
  VALOR DO ALUGUEL: R$ {{valor_aluguel}}
  DIA DE VENCIMENTO: {{dia_vencimento}}
  
  PRAZO: De {{data_inicio}} até {{data_termino}}
  
  CLÁUSULAS:
  1. O valor do aluguel deverá ser pago até o dia {{dia_vencimento}} de cada mês.
  2. Em caso de atraso, será cobrada multa de {{percentual_multa_atraso}}% sobre o valor do aluguel.
  3. Após {{dias_tolerancia_atraso}} dias de atraso, serão cobrados juros de {{percentual_juros_mensal}}% ao mês.
  4. O locatário se responsabiliza pelo pagamento das contas de energia elétrica e gás.
  5. É vedado ao locatário sublocar o imóvel sem autorização prévia do locador.
  
  Local e Data: ________________
  
  _________________________    _________________________
      Locador                      Locatário
      `;
  }

  processarTemplateContrato(dadosContrato: any): string {
    let template = this.getTemplateContrato();

    // Substituir variáveis do template
    Object.keys(dadosContrato).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, dadosContrato[key] || '');
    });

    return template;
  }

  validarConfiguracoes(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (
      this.percentual_multa_atraso < 0 ||
      this.percentual_multa_atraso > 100
    ) {
      erros.push('Percentual de multa por atraso deve estar entre 0% e 100%');
    }

    if (
      this.percentual_juros_mensal < 0 ||
      this.percentual_juros_mensal > 100
    ) {
      erros.push('Percentual de juros mensal deve estar entre 0% e 100%');
    }

    if (this.dias_tolerancia_atraso < 0 || this.dias_tolerancia_atraso > 30) {
      erros.push('Dias de tolerância para atraso deve estar entre 0 e 30 dias');
    }

    if (this.valor_kwh_energia <= 0) {
      erros.push('Valor do kWh deve ser maior que zero');
    }

    if (this.valor_m3_gas <= 0) {
      erros.push('Valor do m³ de gás deve ser maior que zero');
    }

    if (
      this.dias_antecedencia_vencimento < 0 ||
      this.dias_antecedencia_vencimento > 15
    ) {
      erros.push(
        'Dias de antecedência para vencimento deve estar entre 0 e 15 dias',
      );
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  aplicarConfiguracoesPadrao(): void {
    this.percentual_multa_atraso = 2.0;
    this.percentual_juros_mensal = 1.0;
    this.dias_tolerancia_atraso = 5;
    this.valor_kwh_energia = 0.75;
    this.valor_m3_gas = 3.5;
    this.notificacoes_email = true;
    this.notificacoes_sms = false;
    this.dias_antecedencia_vencimento = 3;
  }

  clonarConfiguracoes(): Partial<ConfiguracoesEmpresa> {
    return {
      percentual_multa_atraso: this.percentual_multa_atraso,
      percentual_juros_mensal: this.percentual_juros_mensal,
      dias_tolerancia_atraso: this.dias_tolerancia_atraso,
      valor_kwh_energia: this.valor_kwh_energia,
      valor_m3_gas: this.valor_m3_gas,
      template_contrato: this.template_contrato,
      notificacoes_email: this.notificacoes_email,
      notificacoes_sms: this.notificacoes_sms,
      dias_antecedencia_vencimento: this.dias_antecedencia_vencimento,
    };
  }
}
