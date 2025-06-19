import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ContratoLocacao } from './contrato-locacao.entity';

export enum StatusPagamento {
  PENDENTE = 'Pendente',
  PAGO = 'Pago',
  VENCIDO = 'Vencido',
  CANCELADO = 'Cancelado',
}

@Entity('fatura')
@Index('IDX_FATURA_CONTRATO', ['contrato_associado_id'])
@Index('IDX_FATURA_MES_REF', ['mes_referencia'])
@Index('IDX_FATURA_VENCIMENTO', ['data_vencimento'])
@Index('IDX_FATURA_STATUS', ['status_pagamento'])
@Index('IDX_FATURA_CONTRATO_MES', ['contrato_associado_id', 'mes_referencia'], {
  unique: true,
})
export class Fatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  contrato_associado_id: string;

  @Column({
    type: 'date',
    nullable: false,
    comment: 'Primeiro dia do mês de referência',
  })
  mes_referencia: Date;

  @Column({ type: 'date', nullable: false })
  data_vencimento: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor_base_aluguel: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  leitura_anterior_energia: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  leitura_atual_energia: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  consumo_energia_kwh: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_energia: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_medidor_energia_url: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  leitura_anterior_gas: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  leitura_atual_gas: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  consumo_gas_m3: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_gas: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_medidor_gas_url: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  outros_valores: number;

  @Column({ type: 'text', nullable: true })
  descricao_outros_valores: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor_total_pagar: number;

  @Column({
    type: 'enum',
    enum: StatusPagamento,
    default: StatusPagamento.PENDENTE,
  })
  status_pagamento: StatusPagamento;

  @Column({ type: 'timestamp', nullable: true })
  data_pagamento: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_pago: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comprovante_pagamento_url: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_multa_atraso: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_juros: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => ContratoLocacao, (contrato) => contrato.faturas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contrato_associado_id' })
  contrato_associado: ContratoLocacao;

  // Hooks para cálculos automáticos
  @BeforeInsert()
  @BeforeUpdate()
  calcularValores() {
    // Calcular consumo de energia
    this.consumo_energia_kwh =
      (this.leitura_atual_energia || 0) - (this.leitura_anterior_energia || 0);

    // Calcular consumo de gás
    this.consumo_gas_m3 =
      (this.leitura_atual_gas || 0) - (this.leitura_anterior_gas || 0);

    // Calcular valor total
    this.valor_total_pagar =
      (this.valor_base_aluguel || 0) +
      (this.valor_energia || 0) +
      (this.valor_gas || 0) +
      (this.outros_valores || 0) +
      (this.valor_multa_atraso || 0) +
      (this.valor_juros || 0);
  }

  // Métodos auxiliares
  isPendente(): boolean {
    return this.status_pagamento === StatusPagamento.PENDENTE;
  }

  isPago(): boolean {
    return this.status_pagamento === StatusPagamento.PAGO;
  }

  isVencido(): boolean {
    return this.status_pagamento === StatusPagamento.VENCIDO;
  }

  isCancelado(): boolean {
    return this.status_pagamento === StatusPagamento.CANCELADO;
  }

  getDiasAtraso(): number {
    if (this.isPago()) return 0;

    const hoje = new Date();
    const vencimento = new Date(this.data_vencimento);

    if (hoje <= vencimento) return 0;

    const diffTime = hoje.getTime() - vencimento.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isEmAtraso(): boolean {
    return this.getDiasAtraso() > 0;
  }

  getStatusDescricao(): string {
    if (this.isPago()) return 'Pago';
    if (this.isCancelado()) return 'Cancelado';
    if (this.isEmAtraso()) return `Vencido há ${this.getDiasAtraso()} dias`;

    const diasParaVencimento = this.getDiasParaVencimento();
    if (diasParaVencimento === 0) return 'Vence hoje';
    if (diasParaVencimento > 0) return `Vence em ${diasParaVencimento} dias`;

    return 'Pendente';
  }

  getDiasParaVencimento(): number {
    const hoje = new Date();
    const vencimento = new Date(this.data_vencimento);

    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isProximoVencimento(diasLimite: number = 3): boolean {
    const dias = this.getDiasParaVencimento();
    return dias <= diasLimite && dias >= 0;
  }

  calcularMultaEJuros(configuracoes: {
    percentualMulta: number;
    percentualJuros: number;
    diasTolerancia: number;
  }): { multa: number; juros: number } {
    const diasAtraso = this.getDiasAtraso();

    if (diasAtraso <= configuracoes.diasTolerancia) {
      return { multa: 0, juros: 0 };
    }

    const multa =
      (this.valor_base_aluguel * configuracoes.percentualMulta) / 100;
    const diasJuros = Math.max(0, diasAtraso - configuracoes.diasTolerancia);
    const juros =
      (this.valor_base_aluguel * configuracoes.percentualJuros * diasJuros) /
      (100 * 30);

    return {
      multa: Number(multa.toFixed(2)),
      juros: Number(juros.toFixed(2)),
    };
  }

  aplicarMultaEJuros(multa: number, juros: number): void {
    this.valor_multa_atraso = multa;
    this.valor_juros = juros;
    this.calcularValores(); // Recalcular total
  }

  registrarPagamento(valorPago: number, comprovante?: string): void {
    this.status_pagamento = StatusPagamento.PAGO;
    this.data_pagamento = new Date();
    this.valor_pago = valorPago;
    if (comprovante) {
      this.comprovante_pagamento_url = comprovante;
    }
  }

  cancelarFatura(motivo?: string): void {
    this.status_pagamento = StatusPagamento.CANCELADO;
    if (motivo) {
      this.observacoes = (this.observacoes || '') + `\nCancelado: ${motivo}`;
    }
  }

  marcarComoVencida(): void {
    if (this.isPendente() && this.isEmAtraso()) {
      this.status_pagamento = StatusPagamento.VENCIDO;
    }
  }

  getValorTotalFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_total_pagar);
  }

  getValorBaseFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_base_aluguel);
  }

  getValorEnergiaFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_energia || 0);
  }

  getValorGasFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_gas || 0);
  }

  getMesReferenciaFormatado(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(this.mes_referencia);
  }

  getDataVencimentoFormatada(): string {
    return new Intl.DateTimeFormat('pt-BR').format(this.data_vencimento);
  }

  getDataPagamentoFormatada(): string {
    return this.data_pagamento
      ? new Intl.DateTimeFormat('pt-BR').format(this.data_pagamento)
      : 'Não pago';
  }

  getResumoConsumo(): {
    energia: { consumo: number; valor: number };
    gas: { consumo: number; valor: number };
    total: number;
  } {
    return {
      energia: {
        consumo: this.consumo_energia_kwh || 0,
        valor: this.valor_energia || 0,
      },
      gas: {
        consumo: this.consumo_gas_m3 || 0,
        valor: this.valor_gas || 0,
      },
      total: (this.valor_energia || 0) + (this.valor_gas || 0),
    };
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (this.valor_base_aluguel <= 0) {
      erros.push('Valor base do aluguel deve ser maior que zero');
    }

    if (this.data_vencimento <= this.mes_referencia) {
      erros.push('Data de vencimento deve ser posterior ao mês de referência');
    }

    if (this.leitura_atual_energia < this.leitura_anterior_energia) {
      erros.push('Leitura atual de energia não pode ser menor que a anterior');
    }

    if (this.leitura_atual_gas < this.leitura_anterior_gas) {
      erros.push('Leitura atual de gás não pode ser menor que a anterior');
    }

    if (this.valor_pago && this.valor_pago <= 0) {
      erros.push('Valor pago deve ser maior que zero');
    }

    if (this.isPago() && !this.data_pagamento) {
      erros.push('Data de pagamento é obrigatória para faturas pagas');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  clonarParaProximoMes(): Partial<Fatura> {
    const proximoMes = new Date(this.mes_referencia);
    proximoMes.setMonth(proximoMes.getMonth() + 1);

    const proximoVencimento = new Date(this.data_vencimento);
    proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);

    return {
      contrato_associado_id: this.contrato_associado_id,
      mes_referencia: proximoMes,
      data_vencimento: proximoVencimento,
      valor_base_aluguel: this.valor_base_aluguel,
      leitura_anterior_energia: this.leitura_atual_energia,
      leitura_anterior_gas: this.leitura_atual_gas,
      status_pagamento: StatusPagamento.PENDENTE,
    };
  }
}
