import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Empresa } from './empresa.entity';
import { ContratoLocacao } from './contrato-locacao.entity';
import { Manutencao } from './manutencao.entity';
import { Avaliacao } from './avaliacao.entity';
import { Despesa } from './despesa.entity';

export enum StatusKitnet {
  DISPONIVEL = 'Disponivel',
  ALUGADA = 'Alugada',
  EM_MANUTENCAO = 'Em_Manutencao',
  BLOQUEADA = 'Bloqueada',
}

@Entity('kitnet')
@Index('IDX_KITNET_EMPRESA', ['empresa_proprietaria_id'])
@Index('IDX_KITNET_STATUS', ['status'])
@Index('IDX_KITNET_VALOR', ['valor_aluguel_base'])
@Index('IDX_KITNET_NOME', ['nome_identificador'])
export class Kitnet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome_identificador: string;

  @Column({ type: 'uuid', nullable: false })
  empresa_proprietaria_id: string;

  @Column({ type: 'text', nullable: false })
  endereco_completo: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  area_m2: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor_aluguel_base: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  caracteristicas: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'JSON array com URLs das fotos',
  })
  fotos_urls: string;

  @Column({
    type: 'enum',
    enum: StatusKitnet,
    default: StatusKitnet.DISPONIVEL,
  })
  status: StatusKitnet;

  @Column({ type: 'date', nullable: true })
  data_aquisicao: Date;

  @Column({ type: 'uuid', nullable: true })
  contrato_atual_id: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    default: 0,
  })
  nota_media_kitnet: number;

  @Column({ type: 'boolean', default: false })
  selo_melhor_imovel: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, (empresa) => empresa.kitnets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_proprietaria_id' })
  empresa_proprietaria: Empresa;

  @OneToOne(() => ContratoLocacao, (contrato) => contrato.kitnet_alugada, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contrato_atual_id' })
  contrato_atual: ContratoLocacao;

  @OneToMany(() => ContratoLocacao, (contrato) => contrato.kitnet_alugada)
  historico_contratos: ContratoLocacao[];

  @OneToMany(() => Manutencao, (manutencao) => manutencao.kitnet_associada)
  manutencoes: Manutencao[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.kitnet_avaliada)
  avaliacoes: Avaliacao[];

  @OneToMany(() => Despesa, (despesa) => despesa.kitnet_associada)
  despesas: Despesa[];

  // Métodos auxiliares
  isDisponivel(): boolean {
    return this.status === StatusKitnet.DISPONIVEL;
  }

  isAlugada(): boolean {
    return this.status === StatusKitnet.ALUGADA;
  }

  isEmManutencao(): boolean {
    return this.status === StatusKitnet.EM_MANUTENCAO;
  }

  isBloqueada(): boolean {
    return this.status === StatusKitnet.BLOQUEADA;
  }

  podeSerAlugada(): boolean {
    return this.isDisponivel() && !this.temManutencaoPendente();
  }

  getFotos(): string[] {
    try {
      return this.fotos_urls ? JSON.parse(this.fotos_urls) : [];
    } catch {
      return [];
    }
  }

  setFotos(urls: string[]): void {
    this.fotos_urls = JSON.stringify(urls);
  }

  adicionarFoto(url: string): void {
    const fotos = this.getFotos();
    fotos.push(url);
    this.setFotos(fotos);
  }

  removerFoto(url: string): void {
    const fotos = this.getFotos().filter((foto) => foto !== url);
    this.setFotos(fotos);
  }

  getCaracteristicasLista(): string[] {
    return this.caracteristicas
      ? this.caracteristicas
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c)
      : [];
  }

  setCaracteristicasLista(caracteristicas: string[]): void {
    this.caracteristicas = caracteristicas.join(', ');
  }

  adicionarCaracteristica(caracteristica: string): void {
    const caracteristicas = this.getCaracteristicasLista();
    if (!caracteristicas.includes(caracteristica)) {
      caracteristicas.push(caracteristica);
      this.setCaracteristicasLista(caracteristicas);
    }
  }

  removerCaracteristica(caracteristica: string): void {
    const caracteristicas = this.getCaracteristicasLista().filter(
      (c) => c !== caracteristica,
    );
    this.setCaracteristicasLista(caracteristicas);
  }

  calcularNotaMedia(): number {
    if (!this.avaliacoes || this.avaliacoes.length === 0) return 0;

    const avaliacoesAtivas = this.avaliacoes.filter(
      (av) => av.status === 'Ativa',
    );
    if (avaliacoesAtivas.length === 0) return 0;

    const somaNotas = avaliacoesAtivas.reduce((soma, av) => soma + av.nota, 0);
    return Number((somaNotas / avaliacoesAtivas.length).toFixed(2));
  }

  atualizarNotaMedia(): void {
    this.nota_media_kitnet = this.calcularNotaMedia();
  }

  temManutencaoPendente(): boolean {
    return (
      this.manutencoes?.some((m) =>
        ['Aberto', 'Em_Andamento', 'Agendada'].includes(m.status),
      ) || false
    );
  }

  getManutencoesPendentes(): Manutencao[] {
    return (
      this.manutencoes?.filter((m) =>
        ['Aberto', 'Em_Andamento', 'Agendada'].includes(m.status),
      ) || []
    );
  }

  getUltimaManutencao(): Manutencao | null {
    if (!this.manutencoes || this.manutencoes.length === 0) return null;

    return this.manutencoes.sort(
      (a, b) => b.data_solicitacao.getTime() - a.data_solicitacao.getTime(),
    )[0];
  }

  getValorAluguelFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor_aluguel_base);
  }

  getAreaFormatada(): string {
    return this.area_m2 ? `${this.area_m2} m²` : 'Não informado';
  }

  getIdadeImovel(): number {
    if (!this.data_aquisicao) return 0;
    const hoje = new Date();
    const aquisicao = new Date(this.data_aquisicao);
    const diffTime = hoje.getTime() - aquisicao.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  }

  isImovelNovo(anosLimite: number = 2): boolean {
    return this.getIdadeImovel() <= anosLimite;
  }

  getEnderecoResumido(): string {
    const partes = this.endereco_completo.split(' - ');
    return partes.length > 2
      ? `${partes[0]} - ${partes[partes.length - 2]}`
      : this.endereco_completo;
  }

  getBairro(): string {
    const partes = this.endereco_completo.split(' - ');
    return partes.length >= 3 ? partes[partes.length - 3] : '';
  }

  getCidade(): string {
    const partes = this.endereco_completo.split(' - ');
    return partes.length >= 2 ? partes[partes.length - 2] : '';
  }

  getCep(): string {
    const match = this.endereco_completo.match(/CEP:\s*(\d{5}-?\d{3})/);
    return match ? match[1] : '';
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!this.nome_identificador?.trim()) {
      erros.push('Nome/identificador é obrigatório');
    }

    if (!this.endereco_completo?.trim()) {
      erros.push('Endereço completo é obrigatório');
    }

    if (this.valor_aluguel_base <= 0) {
      erros.push('Valor do aluguel deve ser maior que zero');
    }

    if (this.area_m2 && this.area_m2 <= 0) {
      erros.push('Área deve ser maior que zero');
    }

    if (
      this.nota_media_kitnet &&
      (this.nota_media_kitnet < 0 || this.nota_media_kitnet > 5)
    ) {
      erros.push('Nota média deve estar entre 0 e 5');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }
}
