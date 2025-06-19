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
import { Kitnet } from './kitnet.entity';

export enum CategoriaDespesa {
  MANUTENCAO = 'Manutencao',
  IMPOSTOS = 'Impostos',
  CONDOMINIO = 'Condominio',
  SERVICOS = 'Servicos',
  OUTROS = 'Outros',
}

export enum PeriodicidadeDespesa {
  MENSAL = 'Mensal',
  TRIMESTRAL = 'Trimestral',
  ANUAL = 'Anual',
}

@Entity('despesa')
@Index('IDX_DESPESA_EMPRESA', ['empresa_associada_id'])
@Index('IDX_DESPESA_KITNET', ['kitnet_associada_id'])
@Index('IDX_DESPESA_CATEGORIA', ['categoria'])
@Index('IDX_DESPESA_DATA', ['data_despesa'])
@Index('IDX_DESPESA_RECORRENTE', ['recorrente'])
export class Despesa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  empresa_associada_id: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'Opcional, se for despesa específica de uma kitnet',
  })
  kitnet_associada_id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  descricao: string;

  @Column({
    type: 'enum',
    enum: CategoriaDespesa,
    nullable: false,
  })
  categoria: CategoriaDespesa;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor: number;

  @Column({ type: 'date', nullable: false })
  data_despesa: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comprovante_url: string;

  @Column({ type: 'boolean', default: false })
  recorrente: boolean;

  @Column({
    type: 'enum',
    enum: PeriodicidadeDespesa,
    nullable: true,
    comment: 'Preenchido apenas se recorrente = true',
  })
  periodicidade: PeriodicidadeDespesa;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, (empresa) => empresa.despesas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_associada_id' })
  empresa_associada: Empresa;

  @ManyToOne(() => Kitnet, (kitnet) => kitnet.despesas, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'kitnet_associada_id' })
  kitnet_associada: Kitnet;

  // Métodos auxiliares
  isRecorrente(): boolean {
    return this.recorrente;
  }

  isEspecificaKitnet(): boolean {
    return !!this.kitnet_associada_id;
  }

  isGeralEmpresa(): boolean {
    return !this.kitnet_associada_id;
  }

  getValorFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor);
  }

  getDataFormatada(): string {
    return new Intl.DateTimeFormat('pt-BR').format(this.data_despesa);
  }

  getMesAno(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(this.data_despesa);
  }

  getAno(): number {
    return this.data_despesa.getFullYear();
  }

  getMes(): number {
    return this.data_despesa.getMonth() + 1;
  }

  getCategoriaDescricao(): string {
    const descricoes = {
      [CategoriaDespesa.MANUTENCAO]: 'Manutenção',
      [CategoriaDespesa.IMPOSTOS]: 'Impostos',
      [CategoriaDespesa.CONDOMINIO]: 'Condomínio',
      [CategoriaDespesa.SERVICOS]: 'Serviços',
      [CategoriaDespesa.OUTROS]: 'Outros',
    };
    return descricoes[this.categoria] || this.categoria;
  }

  getPeriodicidadeDescricao(): string {
    if (!this.recorrente || !this.periodicidade) return 'Não recorrente';

    const descricoes = {
      [PeriodicidadeDespesa.MENSAL]: 'Mensal',
      [PeriodicidadeDespesa.TRIMESTRAL]: 'Trimestral',
      [PeriodicidadeDespesa.ANUAL]: 'Anual',
    };
    return descricoes[this.periodicidade] || this.periodicidade;
  }

  getProximaOcorrencia(): Date | null {
    if (!this.recorrente || !this.periodicidade) return null;

    const proximaData = new Date(this.data_despesa);

    switch (this.periodicidade) {
      case PeriodicidadeDespesa.MENSAL:
        proximaData.setMonth(proximaData.getMonth() + 1);
        break;
      case PeriodicidadeDespesa.TRIMESTRAL:
        proximaData.setMonth(proximaData.getMonth() + 3);
        break;
      case PeriodicidadeDespesa.ANUAL:
        proximaData.setFullYear(proximaData.getFullYear() + 1);
        break;
    }

    return proximaData;
  }

  getDiasParaProximaOcorrencia(): number | null {
    const proximaOcorrencia = this.getProximaOcorrencia();
    if (!proximaOcorrencia) return null;

    const hoje = new Date();
    const diffTime = proximaOcorrencia.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isProximaOcorrencia(diasLimite: number = 7): boolean {
    const dias = this.getDiasParaProximaOcorrencia();
    return dias !== null && dias <= diasLimite && dias >= 0;
  }

  calcularValorAnual(): number {
    if (!this.recorrente) return this.valor;

    switch (this.periodicidade) {
      case PeriodicidadeDespesa.MENSAL:
        return this.valor * 12;
      case PeriodicidadeDespesa.TRIMESTRAL:
        return this.valor * 4;
      case PeriodicidadeDespesa.ANUAL:
        return this.valor;
      default:
        return this.valor;
    }
  }

  calcularValorMensal(): number {
    if (!this.recorrente) return 0;

    switch (this.periodicidade) {
      case PeriodicidadeDespesa.MENSAL:
        return this.valor;
      case PeriodicidadeDespesa.TRIMESTRAL:
        return this.valor / 3;
      case PeriodicidadeDespesa.ANUAL:
        return this.valor / 12;
      default:
        return 0;
    }
  }

  getImpactoNoAluguel(valorAluguel: number): number {
    if (!this.recorrente) return 0;

    const valorMensal = this.calcularValorMensal();
    return (valorMensal / valorAluguel) * 100;
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!this.descricao?.trim()) {
      erros.push('Descrição é obrigatória');
    }

    if (this.valor <= 0) {
      erros.push('Valor deve ser maior que zero');
    }

    if (!this.data_despesa) {
      erros.push('Data da despesa é obrigatória');
    }

    if (this.recorrente && !this.periodicidade) {
      erros.push('Periodicidade é obrigatória para despesas recorrentes');
    }

    if (!this.recorrente && this.periodicidade) {
      erros.push(
        'Periodicidade só deve ser preenchida para despesas recorrentes',
      );
    }

    const dataFutura = new Date();
    dataFutura.setDate(dataFutura.getDate() + 1);
    if (this.data_despesa > dataFutura) {
      erros.push('Data da despesa não pode ser futura');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  clonarParaProximaOcorrencia(): Partial<Despesa> | null {
    const proximaData = this.getProximaOcorrencia();
    if (!proximaData) return null;

    return {
      empresa_associada_id: this.empresa_associada_id,
      kitnet_associada_id: this.kitnet_associada_id,
      descricao: this.descricao,
      categoria: this.categoria,
      valor: this.valor,
      data_despesa: proximaData,
      recorrente: this.recorrente,
      periodicidade: this.periodicidade,
      observacoes: `Despesa recorrente gerada automaticamente a partir de ${this.id}`,
    };
  }

  static calcularTotalPorCategoria(
    despesas: Despesa[],
  ): Record<CategoriaDespesa, number> {
    const totais = {
      [CategoriaDespesa.MANUTENCAO]: 0,
      [CategoriaDespesa.IMPOSTOS]: 0,
      [CategoriaDespesa.CONDOMINIO]: 0,
      [CategoriaDespesa.SERVICOS]: 0,
      [CategoriaDespesa.OUTROS]: 0,
    };

    despesas.forEach((despesa) => {
      totais[despesa.categoria] += despesa.valor;
    });

    return totais;
  }

  static calcularTotalPorMes(despesas: Despesa[]): Record<string, number> {
    const totais: Record<string, number> = {};

    despesas.forEach((despesa) => {
      const chave = `${despesa.getAno()}-${despesa.getMes().toString().padStart(2, '0')}`;
      totais[chave] = (totais[chave] || 0) + despesa.valor;
    });

    return totais;
  }

  static calcularMediaMensal(despesas: Despesa[], meses: number = 12): number {
    if (despesas.length === 0 || meses <= 0) return 0;

    const total = despesas.reduce((soma, despesa) => soma + despesa.valor, 0);
    return total / meses;
  }

  static obterDespesasRecorrentes(despesas: Despesa[]): Despesa[] {
    return despesas.filter((despesa) => despesa.recorrente);
  }

  static calcularProjecaoAnual(despesas: Despesa[]): number {
    return despesas.reduce((total, despesa) => {
      return total + despesa.calcularValorAnual();
    }, 0);
  }
}
