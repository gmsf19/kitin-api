import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Empresa } from './empresa.entity';
import { PlanoAssinatura } from './plano-assinatura.entity';

export enum StatusPagamentoSaaS {
  PENDENTE = 'Pendente',
  PROCESSANDO = 'Processando',
  APROVADO = 'Aprovado',
  REJEITADO = 'Rejeitado',
  CANCELADO = 'Cancelado',
  ESTORNADO = 'Estornado',
}

export enum MetodoPagamento {
  CARTAO_CREDITO = 'Cartao_Credito',
  CARTAO_DEBITO = 'Cartao_Debito',
  PIX = 'PIX',
  BOLETO = 'Boleto',
  TRANSFERENCIA = 'Transferencia',
}

export enum TipoPagamento {
  MENSAL = 'Mensal',
  ANUAL = 'Anual',
}

@Entity('pagamento_assinatura_saas')
@Index('IDX_PAGAMENTO_EMPRESA', ['empresa_id'])
@Index('IDX_PAGAMENTO_PLANO', ['plano_id'])
@Index('IDX_PAGAMENTO_STATUS', ['status_pagamento'])
@Index('IDX_PAGAMENTO_DATA', ['data_pagamento'])
@Index('IDX_PAGAMENTO_VENCIMENTO', ['data_vencimento'])
@Index('IDX_PAGAMENTO_GATEWAY', ['id_transacao_gateway'])
export class PagamentoAssinaturaSaaS {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  empresa_id: string;

  @Column({ type: 'uuid', nullable: false })
  plano_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor_pagamento: number;

  @Column({
    type: 'enum',
    enum: TipoPagamento,
    nullable: false,
  })
  tipo_pagamento: TipoPagamento;

  @Column({
    type: 'enum',
    enum: MetodoPagamento,
    nullable: false,
  })
  metodo_pagamento: MetodoPagamento;

  @Column({ type: 'date', nullable: false })
  data_vencimento: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_pagamento: Date;

  @Column({
    type: 'enum',
    enum: StatusPagamentoSaaS,
    default: StatusPagamentoSaaS.PENDENTE,
  })
  status_pagamento: StatusPagamentoSaaS;

  @Column({ type: 'varchar', length: 200, nullable: true })
  id_transacao_gateway: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gateway_pagamento: string;

  @Column({ type: 'text', nullable: true })
  detalhes_pagamento: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comprovante_url: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, (empresa) => empresa.pagamentos_saas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => PlanoAssinatura, (plano) => plano.pagamentos, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'plano_id' })
  plano: PlanoAssinatura;

  // Métodos auxiliares
  isPendente(): boolean {
    return this.status_pagamento === StatusPagamentoSaaS.PENDENTE;
  }

  isProcessando(): boolean {
    return this.status_pagamento === StatusPagamentoSaaS.PROCESSANDO;
  }

  isAprovado(): boolean {
    return this.status_pagamento === StatusPagamentoSaaS.APROVADO;
  }

  isRejeitado(): boolean {
    return this.status_pagamento === StatusPagamentoSaaS.REJEITADO;
  }

  isCancelado(): boolean {
    return this.status_pagamento === StatusPagamentoSaaS.CANCELADO;
  }

  isEstornado(): boolean {
    return this.status_pagamento === StatusPagamentoSaaS.ESTORNADO;
  }

  isPago(): boolean {
    return this.isAprovado();
  }

  isMensal(): boolean {
    return this.tipo_pagamento === TipoPagamento.MENSAL;
  }

  isAnual(): boolean {
    return this.tipo_pagamento === TipoPagamento.ANUAL;
  }

  getDiasAtraso(): number {
    if (this.isPago()) return 0;

    const hoje = new Date();
    const vencimento = new Date(this.data_vencimento);

    if (hoje <= vencimento) return 0;

    const diffTime = hoje.getTime() - vencimento.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isVencido(): boolean {
    return this.getDiasAtraso() > 0;
  }

  getDiasParaVencimento(): number {
    const hoje = new Date();
    const vencimento = new Date(this.data_vencimento);

    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isProximoVencimento(diasLimite: number = 7): boolean {
    const dias = this.getDiasParaVencimento();
    return dias <= diasLimite && dias >= 0;
  }

  getStatusDescricao(): string {
    const descricoes = {
      [StatusPagamentoSaaS.PENDENTE]: 'Pendente',
      [StatusPagamentoSaaS.PROCESSANDO]: 'Processando',
      [StatusPagamentoSaaS.APROVADO]: 'Aprovado',
      [StatusPagamentoSaaS.REJEITADO]: 'Rejeitado',
      [StatusPagamentoSaaS.CANCELADO]: 'Cancelado',
      [StatusPagamentoSaaS.ESTORNADO]: 'Estornado',
    };
    return descricoes[this.status_pagamento] || this.status_pagamento;
  }

  getMetodoDescricao(): string {
    const descricoes = {
      [MetodoPagamento.CARTAO_CREDITO]: 'Cartão de Crédito',
      [MetodoPagamento.CARTAO_DEBITO]: 'Cartão de Débito',
      [MetodoPagamento.PIX]: 'PIX',
      [MetodoPagamento.BOLETO]: 'Boleto',
      [MetodoPagamento.TRANSFERENCIA]: 'Transferência',
    };
    return descricoes[this.metodo_pagamento] || this.metodo_pagamento;
  }

  getTipoDescricao(): string {
    const descricoes = {
      [TipoPagamento.MENSAL]: 'Mensal',
      [TipoPagamento.ANUAL]: 'Anual',
    };
    return descricoes[this.tipo_pagamento] || this.tipo_pagamento;
  }

  getCorStatus(): string {
    const cores = {
      [StatusPagamentoSaaS.PENDENTE]: '#ffc107',
      [StatusPagamentoSaaS.PROCESSANDO]: '#17a2b8',
      [StatusPagamentoSaaS.APROVADO]: '#28a745',
      [StatusPagamentoSaaS.REJEITADO]: '#dc3545',
      [StatusPagamentoSaaS.CANCELADO]: '#6c757d',
      [StatusPagamentoSaaS.ESTORNADO]: '#fd7e14',
    };
    return cores[this.status_pagamento] || '#6c757d';
  }

  getValorFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_pagamento);
  }

  getDataVencimentoFormatada(): string {
    return new Intl.DateTimeFormat('pt-BR').format(this.data_vencimento);
  }

  getDataPagamentoFormatada(): string {
    return this.data_pagamento
      ? new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(this.data_pagamento)
      : 'Não pago';
  }

  getMesReferencia(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(this.data_vencimento);
  }

  getDetalhes(): Record<string, any> {
    try {
      return this.detalhes_pagamento ? JSON.parse(this.detalhes_pagamento) : {};
    } catch {
      return {};
    }
  }

  setDetalhes(detalhes: Record<string, any>): void {
    this.detalhes_pagamento = JSON.stringify(detalhes);
  }

  adicionarDetalhe(chave: string, valor: any): void {
    const detalhes = this.getDetalhes();
    detalhes[chave] = valor;
    this.setDetalhes(detalhes);
  }

  aprovar(idTransacao?: string, comprovante?: string): void {
    this.status_pagamento = StatusPagamentoSaaS.APROVADO;
    this.data_pagamento = new Date();
    if (idTransacao) this.id_transacao_gateway = idTransacao;
    if (comprovante) this.comprovante_url = comprovante;
  }

  rejeitar(motivo?: string): void {
    this.status_pagamento = StatusPagamentoSaaS.REJEITADO;
    if (motivo) {
      this.observacoes = (this.observacoes || '') + `\nRejeitado: ${motivo}`;
    }
  }

  cancelar(motivo?: string): void {
    this.status_pagamento = StatusPagamentoSaaS.CANCELADO;
    if (motivo) {
      this.observacoes = (this.observacoes || '') + `\nCancelado: ${motivo}`;
    }
  }

  estornar(motivo?: string): void {
    this.status_pagamento = StatusPagamentoSaaS.ESTORNADO;
    if (motivo) {
      this.observacoes = (this.observacoes || '') + `\nEstornado: ${motivo}`;
    }
  }

  iniciarProcessamento(gateway: string, idTransacao: string): void {
    this.status_pagamento = StatusPagamentoSaaS.PROCESSANDO;
    this.gateway_pagamento = gateway;
    this.id_transacao_gateway = idTransacao;
  }

  calcularDesconto(): number {
    if (this.isAnual()) {
      // Desconto de 10% para pagamento anual
      const valorMensal = this.valor_pagamento / 12;
      const valorSemDesconto = valorMensal * 12;
      return valorSemDesconto - this.valor_pagamento;
    }
    return 0;
  }

  getPercentualDesconto(): number {
    if (this.isAnual()) {
      const desconto = this.calcularDesconto();
      const valorSemDesconto = this.valor_pagamento + desconto;
      return (desconto / valorSemDesconto) * 100;
    }
    return 0;
  }

  getProximoVencimento(): Date {
    const proximoVencimento = new Date(this.data_vencimento);

    if (this.isMensal()) {
      proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
    } else {
      proximoVencimento.setFullYear(proximoVencimento.getFullYear() + 1);
    }

    return proximoVencimento;
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (this.valor_pagamento <= 0) {
      erros.push('Valor do pagamento deve ser maior que zero');
    }

    if (!this.data_vencimento) {
      erros.push('Data de vencimento é obrigatória');
    }

    if (this.isPago() && !this.data_pagamento) {
      erros.push('Data de pagamento é obrigatória para pagamentos aprovados');
    }

    if (this.isProcessando() && !this.gateway_pagamento) {
      erros.push(
        'Gateway de pagamento é obrigatório para pagamentos em processamento',
      );
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  clonarParaProximoPeriodo(): Partial<PagamentoAssinaturaSaaS> {
    return {
      empresa_id: this.empresa_id,
      plano_id: this.plano_id,
      valor_pagamento: this.valor_pagamento,
      tipo_pagamento: this.tipo_pagamento,
      metodo_pagamento: this.metodo_pagamento,
      data_vencimento: this.getProximoVencimento(),
      status_pagamento: StatusPagamentoSaaS.PENDENTE,
    };
  }

  // Métodos estáticos para análises
  static calcularReceita(pagamentos: PagamentoAssinaturaSaaS[]): {
    total: number;
    aprovados: number;
    pendentes: number;
    rejeitados: number;
    porMetodo: Record<MetodoPagamento, number>;
    porTipo: Record<TipoPagamento, number>;
  } {
    const stats = {
      total: 0,
      aprovados: 0,
      pendentes: 0,
      rejeitados: 0,
      porMetodo: {
        [MetodoPagamento.CARTAO_CREDITO]: 0,
        [MetodoPagamento.CARTAO_DEBITO]: 0,
        [MetodoPagamento.PIX]: 0,
        [MetodoPagamento.BOLETO]: 0,
        [MetodoPagamento.TRANSFERENCIA]: 0,
      },
      porTipo: {
        [TipoPagamento.MENSAL]: 0,
        [TipoPagamento.ANUAL]: 0,
      },
    };

    pagamentos.forEach((pagamento) => {
      stats.total += pagamento.valor_pagamento;

      if (pagamento.isAprovado()) {
        stats.aprovados += pagamento.valor_pagamento;
      } else if (pagamento.isPendente()) {
        stats.pendentes += pagamento.valor_pagamento;
      } else if (pagamento.isRejeitado()) {
        stats.rejeitados += pagamento.valor_pagamento;
      }

      stats.porMetodo[pagamento.metodo_pagamento] += pagamento.valor_pagamento;
      stats.porTipo[pagamento.tipo_pagamento] += pagamento.valor_pagamento;
    });

    return stats;
  }

  static obterVencimentosProximos(
    pagamentos: PagamentoAssinaturaSaaS[],
    dias: number = 7,
  ): PagamentoAssinaturaSaaS[] {
    return pagamentos
      .filter((p) => p.isPendente() && p.isProximoVencimento(dias))
      .sort(
        (a, b) => a.data_vencimento.getTime() - b.data_vencimento.getTime(),
      );
  }

  static obterVencidos(
    pagamentos: PagamentoAssinaturaSaaS[],
  ): PagamentoAssinaturaSaaS[] {
    return pagamentos
      .filter((p) => p.isPendente() && p.isVencido())
      .sort((a, b) => b.getDiasAtraso() - a.getDiasAtraso());
  }

  static calcularTaxaConversao(pagamentos: PagamentoAssinaturaSaaS[]): {
    total: number;
    aprovados: number;
    rejeitados: number;
    pendentes: number;
    taxaAprovacao: number;
    taxaRejeicao: number;
  } {
    const total = pagamentos.length;
    const aprovados = pagamentos.filter((p) => p.isAprovado()).length;
    const rejeitados = pagamentos.filter((p) => p.isRejeitado()).length;
    const pendentes = pagamentos.filter((p) => p.isPendente()).length;

    return {
      total,
      aprovados,
      rejeitados,
      pendentes,
      taxaAprovacao: total > 0 ? (aprovados / total) * 100 : 0,
      taxaRejeicao: total > 0 ? (rejeitados / total) * 100 : 0,
    };
  }
}
