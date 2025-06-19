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
import { Inquilino } from './inquilino.entity';
import { ContratoLocacao } from './contrato-locacao.entity';
import { User } from './user.entity';

export enum TipoAvaliacao {
  KITNET_POR_INQUILINO = 'Kitnet_Por_Inquilino',
  INQUILINO_POR_PROPRIETARIO = 'Inquilino_Por_Proprietario',
}

export enum StatusAvaliacao {
  ATIVA = 'Ativa',
  INATIVA = 'Inativa',
  REPORTADA = 'Reportada',
}

@Entity('avaliacao')
@Index('IDX_AVALIACAO_KITNET', ['kitnet_avaliada_id'])
@Index('IDX_AVALIACAO_INQUILINO', ['inquilino_avaliado_id'])
@Index('IDX_AVALIACAO_CONTRATO', ['contrato_associado_id'])
@Index('IDX_AVALIACAO_AVALIADOR', ['avaliador_id'])
@Index('IDX_AVALIACAO_TIPO', ['tipo_avaliacao'])
@Index('IDX_AVALIACAO_STATUS', ['status'])
@Index('IDX_AVALIACAO_NOTA', ['nota'])
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoAvaliacao,
    nullable: false,
  })
  tipo_avaliacao: TipoAvaliacao;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'Preenchido quando tipo = Kitnet_Por_Inquilino',
  })
  kitnet_avaliada_id: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'Preenchido quando tipo = Inquilino_Por_Proprietario',
  })
  inquilino_avaliado_id: string;

  @Column({ type: 'uuid', nullable: false })
  contrato_associado_id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    comment: 'User que fez a avaliação',
  })
  avaliador_id: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: false,
    comment: 'Nota de 0.00 a 5.00',
  })
  nota: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'JSON array com aspectos avaliados e suas notas',
  })
  aspectos_detalhados: string;

  @Column({
    type: 'enum',
    enum: StatusAvaliacao,
    default: StatusAvaliacao.ATIVA,
  })
  status: StatusAvaliacao;

  @Column({ type: 'text', nullable: true })
  motivo_inativacao: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Kitnet, (kitnet) => kitnet.avaliacoes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'kitnet_avaliada_id' })
  kitnet_avaliada: Kitnet;

  @ManyToOne(() => Inquilino, (inquilino) => inquilino.avaliacoes_recebidas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'inquilino_avaliado_id' })
  inquilino_avaliado: Inquilino;

  @ManyToOne(() => ContratoLocacao, (contrato) => contrato.avaliacoes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contrato_associado_id' })
  contrato_associado: ContratoLocacao;

  @ManyToOne(() => User, (user) => user, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'avaliador_id' })
  avaliador: User;

  // Métodos auxiliares
  isAvaliacaoKitnet(): boolean {
    return this.tipo_avaliacao === TipoAvaliacao.KITNET_POR_INQUILINO;
  }

  isAvaliacaoInquilino(): boolean {
    return this.tipo_avaliacao === TipoAvaliacao.INQUILINO_POR_PROPRIETARIO;
  }

  isAtiva(): boolean {
    return this.status === StatusAvaliacao.ATIVA;
  }

  isInativa(): boolean {
    return this.status === StatusAvaliacao.INATIVA;
  }

  isReportada(): boolean {
    return this.status === StatusAvaliacao.REPORTADA;
  }

  getNotaFormatada(): string {
    return this.nota.toFixed(1);
  }

  getNotaEstrelas(): string {
    const estrelas = Math.round(this.nota);
    return '★'.repeat(estrelas) + '☆'.repeat(5 - estrelas);
  }

  getClassificacao(): string {
    if (this.nota >= 4.5) return 'Excelente';
    if (this.nota >= 4.0) return 'Muito Bom';
    if (this.nota >= 3.0) return 'Bom';
    if (this.nota >= 2.0) return 'Regular';
    return 'Ruim';
  }

  getCorNota(): string {
    if (this.nota >= 4.0) return '#28a745'; // Verde
    if (this.nota >= 3.0) return '#ffc107'; // Amarelo
    if (this.nota >= 2.0) return '#fd7e14'; // Laranja
    return '#dc3545'; // Vermelho
  }

  getTipoDescricao(): string {
    const descricoes = {
      [TipoAvaliacao.KITNET_POR_INQUILINO]: 'Avaliação da Kitnet',
      [TipoAvaliacao.INQUILINO_POR_PROPRIETARIO]: 'Avaliação do Inquilino',
    };
    return descricoes[this.tipo_avaliacao] || this.tipo_avaliacao;
  }

  getStatusDescricao(): string {
    const descricoes = {
      [StatusAvaliacao.ATIVA]: 'Ativa',
      [StatusAvaliacao.INATIVA]: 'Inativa',
      [StatusAvaliacao.REPORTADA]: 'Reportada',
    };
    return descricoes[this.status] || this.status;
  }

  getAspectos(): Record<string, number> {
    try {
      return this.aspectos_detalhados
        ? JSON.parse(this.aspectos_detalhados)
        : {};
    } catch {
      return {};
    }
  }

  setAspectos(aspectos: Record<string, number>): void {
    this.aspectos_detalhados = JSON.stringify(aspectos);
  }

  adicionarAspecto(nome: string, nota: number): void {
    const aspectos = this.getAspectos();
    aspectos[nome] = nota;
    this.setAspectos(aspectos);
  }

  removerAspecto(nome: string): void {
    const aspectos = this.getAspectos();
    delete aspectos[nome];
    this.setAspectos(aspectos);
  }

  calcularNotaMedia(): number {
    const aspectos = this.getAspectos();
    const notas = Object.values(aspectos);

    if (notas.length === 0) return this.nota;

    const soma = notas.reduce((total, nota) => total + nota, 0);
    return Number((soma / notas.length).toFixed(2));
  }

  atualizarNotaComAspectos(): void {
    this.nota = this.calcularNotaMedia();
  }

  getDataFormatada(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(this.created_at);
  }

  getTempoDecorrido(): string {
    const agora = new Date();
    const criacao = new Date(this.created_at);
    const diffTime = agora.getTime() - criacao.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    return `${Math.floor(diffDays / 365)} anos atrás`;
  }

  isRecente(diasLimite: number = 30): boolean {
    const agora = new Date();
    const criacao = new Date(this.created_at);
    const diffTime = agora.getTime() - criacao.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= diasLimite;
  }

  inativar(motivo?: string): void {
    this.status = StatusAvaliacao.INATIVA;
    if (motivo) {
      this.motivo_inativacao = motivo;
    }
  }

  reportar(motivo?: string): void {
    this.status = StatusAvaliacao.REPORTADA;
    if (motivo) {
      this.motivo_inativacao = motivo;
    }
  }

  reativar(): void {
    this.status = StatusAvaliacao.ATIVA;
    this.motivo_inativacao = null;
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (this.nota < 0 || this.nota > 5) {
      erros.push('Nota deve estar entre 0 e 5');
    }

    if (this.isAvaliacaoKitnet() && !this.kitnet_avaliada_id) {
      erros.push('Kitnet avaliada é obrigatória para avaliações de kitnet');
    }

    if (this.isAvaliacaoInquilino() && !this.inquilino_avaliado_id) {
      erros.push(
        'Inquilino avaliado é obrigatório para avaliações de inquilino',
      );
    }

    if (this.isAvaliacaoKitnet() && this.inquilino_avaliado_id) {
      erros.push('Avaliação de kitnet não deve ter inquilino avaliado');
    }

    if (this.isAvaliacaoInquilino() && this.kitnet_avaliada_id) {
      erros.push('Avaliação de inquilino não deve ter kitnet avaliada');
    }

    // Validar aspectos detalhados
    const aspectos = this.getAspectos();
    Object.entries(aspectos).forEach(([nome, nota]) => {
      if (typeof nota !== 'number' || nota < 0 || nota > 5) {
        erros.push(`Aspecto "${nome}" deve ter nota entre 0 e 5`);
      }
    });

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  // Métodos estáticos para análises
  static calcularEstatisticas(avaliacoes: Avaliacao[]): {
    total: number;
    notaMedia: number;
    distribuicaoNotas: Record<string, number>;
    porTipo: Record<TipoAvaliacao, number>;
    porStatus: Record<StatusAvaliacao, number>;
    recentes: number;
  } {
    const stats = {
      total: avaliacoes.length,
      notaMedia: 0,
      distribuicaoNotas: {
        '5': 0,
        '4': 0,
        '3': 0,
        '2': 0,
        '1': 0,
      },
      porTipo: {
        [TipoAvaliacao.KITNET_POR_INQUILINO]: 0,
        [TipoAvaliacao.INQUILINO_POR_PROPRIETARIO]: 0,
      },
      porStatus: {
        [StatusAvaliacao.ATIVA]: 0,
        [StatusAvaliacao.INATIVA]: 0,
        [StatusAvaliacao.REPORTADA]: 0,
      },
      recentes: 0,
    };

    if (avaliacoes.length === 0) return stats;

    let somaNotas = 0;

    avaliacoes.forEach((avaliacao) => {
      somaNotas += avaliacao.nota;

      const notaArredondada = Math.round(avaliacao.nota).toString();
      if (stats.distribuicaoNotas[notaArredondada] !== undefined) {
        stats.distribuicaoNotas[notaArredondada]++;
      }

      stats.porTipo[avaliacao.tipo_avaliacao]++;
      stats.porStatus[avaliacao.status]++;

      if (avaliacao.isRecente()) {
        stats.recentes++;
      }
    });

    stats.notaMedia = Number((somaNotas / avaliacoes.length).toFixed(2));

    return stats;
  }

  static obterMelhoresAvaliacoes(
    avaliacoes: Avaliacao[],
    limite: number = 10,
  ): Avaliacao[] {
    return avaliacoes
      .filter((av) => av.isAtiva())
      .sort((a, b) => b.nota - a.nota)
      .slice(0, limite);
  }

  static obterAvaliacoesRecentes(
    avaliacoes: Avaliacao[],
    dias: number = 30,
  ): Avaliacao[] {
    return avaliacoes
      .filter((av) => av.isAtiva() && av.isRecente(dias))
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  static calcularTendencia(
    avaliacoes: Avaliacao[],
    meses: number = 6,
  ): {
    tendencia: 'crescente' | 'decrescente' | 'estavel';
    variacao: number;
    dadosMensais: Array<{ mes: string; nota: number; quantidade: number }>;
  } {
    const agora = new Date();
    const dataLimite = new Date(
      agora.getFullYear(),
      agora.getMonth() - meses,
      1,
    );

    const avaliacoesRecentes = avaliacoes
      .filter((av) => av.isAtiva() && av.created_at >= dataLimite)
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    const dadosMensais: Array<{
      mes: string;
      nota: number;
      quantidade: number;
    }> = [];

    // Agrupar por mês
    const grupos: Record<string, Avaliacao[]> = {};
    avaliacoesRecentes.forEach((av) => {
      const chave = `${av.created_at.getFullYear()}-${(av.created_at.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(av);
    });

    // Calcular médias mensais
    Object.entries(grupos).forEach(([mes, avaliacoesMes]) => {
      const soma = avaliacoesMes.reduce((total, av) => total + av.nota, 0);
      const media = soma / avaliacoesMes.length;

      dadosMensais.push({
        mes,
        nota: Number(media.toFixed(2)),
        quantidade: avaliacoesMes.length,
      });
    });

    // Calcular tendência
    let tendencia: 'crescente' | 'decrescente' | 'estavel' = 'estavel';
    let variacao = 0;

    if (dadosMensais.length >= 2) {
      const primeira = dadosMensais[0].nota;
      const ultima = dadosMensais[dadosMensais.length - 1].nota;
      variacao = Number((((ultima - primeira) / primeira) * 100).toFixed(2));

      if (Math.abs(variacao) > 5) {
        tendencia = variacao > 0 ? 'crescente' : 'decrescente';
      }
    }

    return { tendencia, variacao, dadosMensais };
  }
}
