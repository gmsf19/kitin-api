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
import { Kitnet } from './kitnet.entity';
import { User } from './user.entity';
import { Despesa } from './despesa.entity';

export enum TipoManutencao {
  CORRETIVA = 'Corretiva',
  PREVENTIVA = 'Preventiva',
}

export enum CategoriaManutencao {
  ELETRICA = 'Eletrica',
  HIDRAULICA = 'Hidraulica',
  ESTRUTURAL = 'Estrutural',
  PINTURA = 'Pintura',
  OUTROS = 'Outros',
}

export enum PrioridadeManutencao {
  BAIXA = 'Baixa',
  MEDIA = 'Media',
  ALTA = 'Alta',
  URGENTE = 'Urgente',
}

export enum StatusManutencao {
  ABERTO = 'Aberto',
  EM_ANDAMENTO = 'Em_Andamento',
  AGENDADA = 'Agendada',
  CONCLUIDA = 'Concluida',
  CANCELADA = 'Cancelada',
}

@Entity('manutencao')
@Index('IDX_MANUTENCAO_KITNET', ['kitnet_associada_id'])
@Index('IDX_MANUTENCAO_SOLICITANTE', ['solicitante_id'])
@Index('IDX_MANUTENCAO_STATUS', ['status'])
@Index('IDX_MANUTENCAO_PRIORIDADE', ['prioridade'])
@Index('IDX_MANUTENCAO_TIPO', ['tipo'])
@Index('IDX_MANUTENCAO_CATEGORIA', ['categoria'])
@Index('IDX_MANUTENCAO_DATA_SOLICITACAO', ['data_solicitacao'])
export class Manutencao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  kitnet_associada_id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    comment: 'User que solicitou (inquilino ou admin)',
  })
  solicitante_id: string;

  @Column({
    type: 'enum',
    enum: TipoManutencao,
    nullable: false,
  })
  tipo: TipoManutencao;

  @Column({
    type: 'enum',
    enum: CategoriaManutencao,
    nullable: false,
  })
  categoria: CategoriaManutencao;

  @Column({ type: 'text', nullable: false })
  descricao_problema: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'JSON array com URLs das fotos do problema',
  })
  fotos_problema_urls: string;

  @Column({
    type: 'enum',
    enum: PrioridadeManutencao,
    default: PrioridadeManutencao.MEDIA,
  })
  prioridade: PrioridadeManutencao;

  @Column({
    type: 'enum',
    enum: StatusManutencao,
    default: StatusManutencao.ABERTO,
  })
  status: StatusManutencao;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_solicitacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_agendada: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  prestador_servico: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contato_prestador: string;

  @Column({ type: 'timestamp', nullable: true })
  data_conclusao: Date;

  @Column({ type: 'text', nullable: true })
  descricao_servico_realizado: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'JSON array com URLs das fotos do serviço realizado',
  })
  fotos_servico_urls: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  valor_gasto: number;

  @Column({ type: 'uuid', nullable: true })
  despesa_associada_id: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Kitnet, (kitnet) => kitnet.manutencoes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'kitnet_associada_id' })
  kitnet_associada: Kitnet;

  @ManyToOne(() => User, (user) => user, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'solicitante_id' })
  solicitante: User;

  @ManyToOne(() => Despesa, (despesa) => despesa, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'despesa_associada_id' })
  despesa_associada: Despesa;

  // Métodos auxiliares
  isAberto(): boolean {
    return this.status === StatusManutencao.ABERTO;
  }

  isEmAndamento(): boolean {
    return this.status === StatusManutencao.EM_ANDAMENTO;
  }

  isAgendada(): boolean {
    return this.status === StatusManutencao.AGENDADA;
  }

  isConcluida(): boolean {
    return this.status === StatusManutencao.CONCLUIDA;
  }

  isCancelada(): boolean {
    return this.status === StatusManutencao.CANCELADA;
  }

  isPendente(): boolean {
    return [
      StatusManutencao.ABERTO,
      StatusManutencao.EM_ANDAMENTO,
      StatusManutencao.AGENDADA,
    ].includes(this.status);
  }

  isCorretiva(): boolean {
    return this.tipo === TipoManutencao.CORRETIVA;
  }

  isPreventiva(): boolean {
    return this.tipo === TipoManutencao.PREVENTIVA;
  }

  isUrgente(): boolean {
    return this.prioridade === PrioridadeManutencao.URGENTE;
  }

  isAltaPrioridade(): boolean {
    return [PrioridadeManutencao.ALTA, PrioridadeManutencao.URGENTE].includes(
      this.prioridade,
    );
  }

  getFotosProblema(): string[] {
    try {
      return this.fotos_problema_urls
        ? JSON.parse(this.fotos_problema_urls)
        : [];
    } catch {
      return [];
    }
  }

  setFotosProblema(urls: string[]): void {
    this.fotos_problema_urls = JSON.stringify(urls);
  }

  getFotosServico(): string[] {
    try {
      return this.fotos_servico_urls ? JSON.parse(this.fotos_servico_urls) : [];
    } catch {
      return [];
    }
  }

  setFotosServico(urls: string[]): void {
    this.fotos_servico_urls = JSON.stringify(urls);
  }

  adicionarFotoProblema(url: string): void {
    const fotos = this.getFotosProblema();
    fotos.push(url);
    this.setFotosProblema(fotos);
  }

  adicionarFotoServico(url: string): void {
    const fotos = this.getFotosServico();
    fotos.push(url);
    this.setFotosServico(fotos);
  }

  getTipoDescricao(): string {
    const descricoes = {
      [TipoManutencao.CORRETIVA]: 'Corretiva',
      [TipoManutencao.PREVENTIVA]: 'Preventiva',
    };
    return descricoes[this.tipo] || this.tipo;
  }

  getCategoriaDescricao(): string {
    const descricoes = {
      [CategoriaManutencao.ELETRICA]: 'Elétrica',
      [CategoriaManutencao.HIDRAULICA]: 'Hidráulica',
      [CategoriaManutencao.ESTRUTURAL]: 'Estrutural',
      [CategoriaManutencao.PINTURA]: 'Pintura',
      [CategoriaManutencao.OUTROS]: 'Outros',
    };
    return descricoes[this.categoria] || this.categoria;
  }

  getPrioridadeDescricao(): string {
    const descricoes = {
      [PrioridadeManutencao.BAIXA]: 'Baixa',
      [PrioridadeManutencao.MEDIA]: 'Média',
      [PrioridadeManutencao.ALTA]: 'Alta',
      [PrioridadeManutencao.URGENTE]: 'Urgente',
    };
    return descricoes[this.prioridade] || this.prioridade;
  }

  getStatusDescricao(): string {
    const descricoes = {
      [StatusManutencao.ABERTO]: 'Aberto',
      [StatusManutencao.EM_ANDAMENTO]: 'Em Andamento',
      [StatusManutencao.AGENDADA]: 'Agendada',
      [StatusManutencao.CONCLUIDA]: 'Concluída',
      [StatusManutencao.CANCELADA]: 'Cancelada',
    };
    return descricoes[this.status] || this.status;
  }

  getCorPrioridade(): string {
    const cores = {
      [PrioridadeManutencao.BAIXA]: '#28a745',
      [PrioridadeManutencao.MEDIA]: '#ffc107',
      [PrioridadeManutencao.ALTA]: '#fd7e14',
      [PrioridadeManutencao.URGENTE]: '#dc3545',
    };
    return cores[this.prioridade] || '#6c757d';
  }

  getCorStatus(): string {
    const cores = {
      [StatusManutencao.ABERTO]: '#dc3545',
      [StatusManutencao.EM_ANDAMENTO]: '#fd7e14',
      [StatusManutencao.AGENDADA]: '#ffc107',
      [StatusManutencao.CONCLUIDA]: '#28a745',
      [StatusManutencao.CANCELADA]: '#6c757d',
    };
    return cores[this.status] || '#6c757d';
  }

  getDiasEmAberto(): number {
    const hoje = new Date();
    const solicitacao = new Date(this.data_solicitacao);
    const diffTime = hoje.getTime() - solicitacao.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDiasParaAgendamento(): number {
    if (!this.data_agendada) return 0;

    const hoje = new Date();
    const agendamento = new Date(this.data_agendada);
    const diffTime = agendamento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTempoResolucao(): number {
    if (!this.isConcluida() || !this.data_conclusao) return 0;

    const solicitacao = new Date(this.data_solicitacao);
    const conclusao = new Date(this.data_conclusao);
    const diffTime = conclusao.getTime() - solicitacao.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isAtrasada(): boolean {
    if (this.isConcluida() || this.isCancelada()) return false;

    // Considera atrasada se:
    // - Urgente: mais de 1 dia
    // - Alta: mais de 3 dias
    // - Média: mais de 7 dias
    // - Baixa: mais de 15 dias
    const diasLimite = {
      [PrioridadeManutencao.URGENTE]: 1,
      [PrioridadeManutencao.ALTA]: 3,
      [PrioridadeManutencao.MEDIA]: 7,
      [PrioridadeManutencao.BAIXA]: 15,
    };

    return this.getDiasEmAberto() > diasLimite[this.prioridade];
  }

  getValorGastoFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_gasto || 0);
  }

  getDataSolicitacaoFormatada(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(this.data_solicitacao);
  }

  getDataAgendadaFormatada(): string {
    return this.data_agendada
      ? new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(this.data_agendada)
      : 'Não agendada';
  }

  getDataConclusaoFormatada(): string {
    return this.data_conclusao
      ? new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(this.data_conclusao)
      : 'Não concluída';
  }

  agendar(data: Date, prestador?: string, contato?: string): void {
    this.status = StatusManutencao.AGENDADA;
    this.data_agendada = data;
    if (prestador) this.prestador_servico = prestador;
    if (contato) this.contato_prestador = contato;
  }

  iniciarServico(): void {
    this.status = StatusManutencao.EM_ANDAMENTO;
  }

  concluir(
    descricaoServico: string,
    valorGasto?: number,
    fotosServico?: string[],
  ): void {
    this.status = StatusManutencao.CONCLUIDA;
    this.data_conclusao = new Date();
    this.descricao_servico_realizado = descricaoServico;
    if (valorGasto) this.valor_gasto = valorGasto;
    if (fotosServico) this.setFotosServico(fotosServico);
  }

  cancelar(motivo?: string): void {
    this.status = StatusManutencao.CANCELADA;
    if (motivo) {
      this.observacoes = (this.observacoes || '') + `\nCancelado: ${motivo}`;
    }
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!this.descricao_problema?.trim()) {
      erros.push('Descrição do problema é obrigatória');
    }

    if (this.valor_gasto && this.valor_gasto < 0) {
      erros.push('Valor gasto não pode ser negativo');
    }

    if (this.data_agendada && this.data_agendada <= this.data_solicitacao) {
      erros.push('Data agendada deve ser posterior à data de solicitação');
    }

    if (this.data_conclusao && this.data_conclusao <= this.data_solicitacao) {
      erros.push('Data de conclusão deve ser posterior à data de solicitação');
    }

    if (this.isConcluida() && !this.descricao_servico_realizado?.trim()) {
      erros.push(
        'Descrição do serviço realizado é obrigatória para manutenções concluídas',
      );
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  static calcularEstatisticas(manutencoes: Manutencao[]): {
    total: number;
    porStatus: Record<StatusManutencao, number>;
    porPrioridade: Record<PrioridadeManutencao, number>;
    porCategoria: Record<CategoriaManutencao, number>;
    tempoMedioResolucao: number;
    custoTotal: number;
    atrasadas: number;
  } {
    const stats = {
      total: manutencoes.length,
      porStatus: {
        [StatusManutencao.ABERTO]: 0,
        [StatusManutencao.EM_ANDAMENTO]: 0,
        [StatusManutencao.AGENDADA]: 0,
        [StatusManutencao.CONCLUIDA]: 0,
        [StatusManutencao.CANCELADA]: 0,
      },
      porPrioridade: {
        [PrioridadeManutencao.BAIXA]: 0,
        [PrioridadeManutencao.MEDIA]: 0,
        [PrioridadeManutencao.ALTA]: 0,
        [PrioridadeManutencao.URGENTE]: 0,
      },
      porCategoria: {
        [CategoriaManutencao.ELETRICA]: 0,
        [CategoriaManutencao.HIDRAULICA]: 0,
        [CategoriaManutencao.ESTRUTURAL]: 0,
        [CategoriaManutencao.PINTURA]: 0,
        [CategoriaManutencao.OUTROS]: 0,
      },
      tempoMedioResolucao: 0,
      custoTotal: 0,
      atrasadas: 0,
    };

    let tempoTotalResolucao = 0;
    let concluidas = 0;

    manutencoes.forEach((manutencao) => {
      stats.porStatus[manutencao.status]++;
      stats.porPrioridade[manutencao.prioridade]++;
      stats.porCategoria[manutencao.categoria]++;
      stats.custoTotal += manutencao.valor_gasto || 0;

      if (manutencao.isAtrasada()) {
        stats.atrasadas++;
      }

      if (manutencao.isConcluida()) {
        const tempoResolucao = manutencao.getTempoResolucao();
        tempoTotalResolucao += tempoResolucao;
        concluidas++;
      }
    });

    stats.tempoMedioResolucao =
      concluidas > 0 ? tempoTotalResolucao / concluidas : 0;

    return stats;
  }
}
