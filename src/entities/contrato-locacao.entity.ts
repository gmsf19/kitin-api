import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Kitnet } from './kitnet.entity';
import { Inquilino } from './inquilino.entity';
import { Avaliacao } from './avaliacao.entity';
import { Fatura } from './fatura.entity';

export enum StatusContrato {
  ATIVO = 'Ativo',
  ENCERRADO = 'Encerrado',
  RENOVADO = 'Renovado',
  CANCELADO = 'Cancelado',
}

@Entity('contrato_locacao')
@Index('IDX_CONTRATO_KITNET', ['kitnet_alugada_id'])
@Index('IDX_CONTRATO_INQUILINO', ['inquilino_id'])
@Index('IDX_CONTRATO_STATUS', ['status_contrato'])
@Index('IDX_CONTRATO_DATA_INICIO', ['data_inicio'])
@Index('IDX_CONTRATO_DATA_TERMINO', ['data_termino_previsto'])
export class ContratoLocacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  kitnet_alugada_id: string;

  @Column({ type: 'uuid', nullable: false })
  inquilino_id: string;

  @Column({ type: 'date', nullable: false })
  data_inicio: Date;

  @Column({ type: 'date', nullable: false })
  data_termino_previsto: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor_aluguel: number;

  @Column({
    type: 'integer',
    nullable: false,
    comment: 'Dia do mês para vencimento (1-31)',
  })
  dia_vencimento: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_deposito_caucao: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  percentual_multa_atraso: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 300.0,
    comment: 'Percentual sobre valor do aluguel (ex: 300% = 3x)',
  })
  percentual_multa_quebra_contrato: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documento_contrato_url: string;

  @Column({
    type: 'enum',
    enum: StatusContrato,
    default: StatusContrato.ATIVO,
  })
  status_contrato: StatusContrato;

  @Column({ type: 'date', nullable: true })
  data_encerramento_real: Date;

  @Column({ type: 'text', nullable: true })
  motivo_encerramento: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_multa_aplicada: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Kitnet, (kitnet) => kitnet.historico_contratos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'kitnet_alugada_id' })
  kitnet_alugada: Kitnet;

  @ManyToOne(() => Inquilino, (inquilino) => inquilino.contratos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'inquilino_id' })
  inquilino: Inquilino;

  @OneToMany(() => Fatura, (fatura) => fatura.contrato_associado)
  faturas: Fatura[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.contrato_associado)
  avaliacoes: Avaliacao[];

  // Métodos auxiliares
  isAtivo(): boolean {
    return this.status_contrato === StatusContrato.ATIVO;
  }

  isEncerrado(): boolean {
    return this.status_contrato === StatusContrato.ENCERRADO;
  }

  isRenovado(): boolean {
    return this.status_contrato === StatusContrato.RENOVADO;
  }

  isCancelado(): boolean {
    return this.status_contrato === StatusContrato.CANCELADO;
  }

  getDuracaoMeses(): number {
    const inicio = new Date(this.data_inicio);
    const termino = new Date(this.data_termino_previsto);

    const diffTime = termino.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.ceil(diffDays / 30);
  }

  getDuracaoReal(): number {
    const inicio = new Date(this.data_inicio);
    const fim = this.data_encerramento_real
      ? new Date(this.data_encerramento_real)
      : new Date();

    const diffTime = fim.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.ceil(diffDays / 30);
  }

  getDiasRestantes(): number {
    if (!this.isAtivo()) return 0;

    const hoje = new Date();
    const termino = new Date(this.data_termino_previsto);

    const diffTime = termino.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isProximoVencimento(diasLimite: number = 30): boolean {
    const diasRestantes = this.getDiasRestantes();
    return diasRestantes <= diasLimite && diasRestantes > 0;
  }

  isVencido(): boolean {
    return this.getDiasRestantes() < 0;
  }

  getProximaDataVencimento(): Date {
    const hoje = new Date();
    const proximoVencimento = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      this.dia_vencimento,
    );

    // Se já passou o dia do vencimento neste mês, pegar o próximo mês
    if (proximoVencimento <= hoje) {
      proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
    }

    return proximoVencimento;
  }

  calcularMultaAtraso(valorBase?: number): number {
    const valor = valorBase || this.valor_aluguel;
    return (valor * this.percentual_multa_atraso) / 100;
  }

  calcularMultaQuebraContrato(): number {
    return (this.valor_aluguel * this.percentual_multa_quebra_contrato) / 100;
  }

  getValorAluguelFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_aluguel);
  }

  getValorDepositoFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_deposito_caucao);
  }

  getFaturasEmAtraso(): Fatura[] {
    const hoje = new Date();
    return (
      this.faturas?.filter(
        (fatura) =>
          fatura.status_pagamento === 'Pendente' &&
          new Date(fatura.data_vencimento) < hoje,
      ) || []
    );
  }

  getQuantidadeFaturasEmAtraso(): number {
    return this.getFaturasEmAtraso().length;
  }

  getValorTotalEmAtraso(): number {
    return this.getFaturasEmAtraso().reduce(
      (total, fatura) => total + fatura.valor_total_pagar,
      0,
    );
  }

  temAtrasosPagamento(): boolean {
    return this.getQuantidadeFaturasEmAtraso() > 0;
  }

  getHistoricoPagamentos(): {
    totalFaturas: number;
    pagas: number;
    pendentes: number;
    vencidas: number;
    percentualPontualidade: number;
  } {
    if (!this.faturas || this.faturas.length === 0) {
      return {
        totalFaturas: 0,
        pagas: 0,
        pendentes: 0,
        vencidas: 0,
        percentualPontualidade: 0,
      };
    }

    const totalFaturas = this.faturas.length;
    const pagas = this.faturas.filter(
      (f) => f.status_pagamento === 'Pago',
    ).length;
    const pendentes = this.faturas.filter(
      (f) => f.status_pagamento === 'Pendente',
    ).length;
    const vencidas = this.faturas.filter(
      (f) => f.status_pagamento === 'Vencido',
    ).length;

    const percentualPontualidade =
      totalFaturas > 0 ? (pagas / totalFaturas) * 100 : 0;

    return {
      totalFaturas,
      pagas,
      pendentes,
      vencidas,
      percentualPontualidade: Number(percentualPontualidade.toFixed(2)),
    };
  }

  podeSerRenovado(): boolean {
    return (
      this.isAtivo() &&
      !this.temAtrasosPagamento() &&
      this.isProximoVencimento(60)
    ); // 2 meses antes
  }

  gerarProximaFatura(): Partial<Fatura> {
    const proximoVencimento = this.getProximaDataVencimento();
    const mesReferencia = new Date(
      proximoVencimento.getFullYear(),
      proximoVencimento.getMonth(),
      1,
    );

    return {
      contrato_associado_id: this.id,
      mes_referencia: mesReferencia,
      data_vencimento: proximoVencimento,
      valor_base_aluguel: this.valor_aluguel,
      valor_total_pagar: this.valor_aluguel,
      status_pagamento: 'Pendente' as any,
    };
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (this.data_inicio >= this.data_termino_previsto) {
      erros.push('Data de término deve ser posterior à data de início');
    }

    if (this.valor_aluguel <= 0) {
      erros.push('Valor do aluguel deve ser maior que zero');
    }

    if (this.dia_vencimento < 1 || this.dia_vencimento > 31) {
      erros.push('Dia de vencimento deve estar entre 1 e 31');
    }

    if (
      this.percentual_multa_atraso < 0 ||
      this.percentual_multa_atraso > 100
    ) {
      erros.push('Percentual de multa por atraso deve estar entre 0% e 100%');
    }

    if (this.percentual_multa_quebra_contrato < 0) {
      erros.push(
        'Percentual de multa por quebra de contrato deve ser maior ou igual a zero',
      );
    }

    if (this.valor_deposito_caucao < 0) {
      erros.push('Valor do depósito caução deve ser maior ou igual a zero');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  clonarParaRenovacao(novaDataTermino: Date): Partial<ContratoLocacao> {
    return {
      kitnet_alugada_id: this.kitnet_alugada_id,
      inquilino_id: this.inquilino_id,
      data_inicio: new Date(this.data_termino_previsto),
      data_termino_previsto: novaDataTermino,
      valor_aluguel: this.valor_aluguel,
      dia_vencimento: this.dia_vencimento,
      valor_deposito_caucao: this.valor_deposito_caucao,
      percentual_multa_atraso: this.percentual_multa_atraso,
      percentual_multa_quebra_contrato: this.percentual_multa_quebra_contrato,
      status_contrato: StatusContrato.ATIVO,
      observacoes: `Renovação do contrato ${this.id}`,
    };
  }
}
