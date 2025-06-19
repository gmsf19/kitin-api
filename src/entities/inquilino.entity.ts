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
import { User } from './user.entity';
import { ContratoLocacao } from './contrato-locacao.entity';
import { Avaliacao } from './avaliacao.entity';

export enum StatusInquilino {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  INADIMPLENTE = 'Inadimplente',
}

@Entity('inquilino')
@Index('IDX_INQUILINO_CPF', ['cpf'], { unique: true })
@Index('IDX_INQUILINO_EMAIL', ['email'])
@Index('IDX_INQUILINO_EMPRESA', ['empresa_associada_id'])
@Index('IDX_INQUILINO_STATUS', ['status'])
@Index('IDX_INQUILINO_USUARIO', ['usuario_acesso_id'])
export class Inquilino {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome_completo: string;

  @Column({ type: 'varchar', length: 14, nullable: false })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rg: string;

  @Column({ type: 'date', nullable: true })
  data_nascimento: Date;

  @Column({ type: 'varchar', length: 150, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profissao: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  local_trabalho: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  renda_mensal: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comprovante_renda_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_url: string;

  @Column({ type: 'uuid', nullable: false })
  empresa_associada_id: string;

  @Column({ type: 'uuid', nullable: true })
  usuario_acesso_id: string;

  @Column({ type: 'uuid', nullable: true })
  contrato_atual_id: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    default: 0,
  })
  nota_media_inquilino: number;

  @Column({
    type: 'enum',
    enum: StatusInquilino,
    default: StatusInquilino.ATIVO,
  })
  status: StatusInquilino;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, (empresa) => empresa.inquilinos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_associada_id' })
  empresa_associada: Empresa;

  @OneToOne(() => User, (user) => user.inquilino_associado, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_acesso_id' })
  usuario_acesso: User;

  @OneToOne(() => ContratoLocacao, (contrato) => contrato.inquilino, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contrato_atual_id' })
  contrato_atual: ContratoLocacao;

  @OneToMany(() => ContratoLocacao, (contrato) => contrato.inquilino)
  contratos: ContratoLocacao[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.inquilino_avaliado)
  avaliacoes_recebidas: Avaliacao[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.avaliador)
  avaliacoes_feitas: Avaliacao[];

  // Métodos auxiliares
  isAtivo(): boolean {
    return this.status === StatusInquilino.ATIVO;
  }

  isInativo(): boolean {
    return this.status === StatusInquilino.INATIVO;
  }

  isInadimplente(): boolean {
    return this.status === StatusInquilino.INADIMPLENTE;
  }

  temContratoAtivo(): boolean {
    return (
      !!this.contrato_atual_id &&
      this.contrato_atual?.status_contrato === 'Ativo'
    );
  }

  getPrimeiroNome(): string {
    return this.nome_completo.split(' ')[0];
  }

  getUltimoNome(): string {
    const nomes = this.nome_completo.split(' ');
    return nomes[nomes.length - 1];
  }

  getIniciais(): string {
    return this.nome_completo
      .split(' ')
      .map((nome) => nome.charAt(0).toUpperCase())
      .join('');
  }

  formatarCpf(): string {
    const cpf = this.cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefone(): string {
    if (!this.telefone) return '';
    const telefone = this.telefone.replace(/\D/g, '');

    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return this.telefone;
  }

  getIdade(): number {
    if (!this.data_nascimento) return 0;

    const hoje = new Date();
    const nascimento = new Date(this.data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  }

  isMaiorIdade(): boolean {
    return this.getIdade() >= 18;
  }

  getRendaFormatada(): string {
    if (!this.renda_mensal) return 'Não informado';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.renda_mensal);
  }

  calcularNotaMedia(): number {
    if (!this.avaliacoes_recebidas || this.avaliacoes_recebidas.length === 0)
      return 0;

    const avaliacoesAtivas = this.avaliacoes_recebidas.filter(
      (av) => av.status === 'Ativa',
    );
    if (avaliacoesAtivas.length === 0) return 0;

    const somaNotas = avaliacoesAtivas.reduce((soma, av) => soma + av.nota, 0);
    return Number((somaNotas / avaliacoesAtivas.length).toFixed(2));
  }

  atualizarNotaMedia(): void {
    this.nota_media_inquilino = this.calcularNotaMedia();
  }

  getQuantidadeAvaliacoes(): number {
    return (
      this.avaliacoes_recebidas?.filter((av) => av.status === 'Ativa').length ||
      0
    );
  }

  temBomHistorico(): boolean {
    return (
      this.nota_media_inquilino >= 4.0 && this.getQuantidadeAvaliacoes() >= 3
    );
  }

  getHistoricoContratos(): ContratoLocacao[] {
    return (
      this.contratos?.sort(
        (a, b) => b.data_inicio.getTime() - a.data_inicio.getTime(),
      ) || []
    );
  }

  getQuantidadeContratosAnteriores(): number {
    return (
      this.contratos?.filter((c) => c.status_contrato !== 'Ativo').length || 0
    );
  }

  temExperienciaLocacao(): boolean {
    return this.getQuantidadeContratosAnteriores() > 0;
  }

  validarRendaParaAluguel(valorAluguel: number): boolean {
    if (!this.renda_mensal) return false;
    // Regra: renda deve ser pelo menos 3x o valor do aluguel
    return this.renda_mensal >= valorAluguel * 3;
  }

  getCapacidadeAluguel(): number {
    if (!this.renda_mensal) return 0;
    // Máximo de 30% da renda para aluguel
    return this.renda_mensal * 0.3;
  }

  validarDados(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!this.nome_completo?.trim()) {
      erros.push('Nome completo é obrigatório');
    }

    if (!this.cpf?.trim()) {
      erros.push('CPF é obrigatório');
    } else if (!this.validarCpf()) {
      erros.push('CPF inválido');
    }

    if (!this.email?.trim()) {
      erros.push('Email é obrigatório');
    } else if (!this.validarEmail()) {
      erros.push('Email inválido');
    }

    if (this.data_nascimento && !this.isMaiorIdade()) {
      erros.push('Inquilino deve ser maior de idade');
    }

    if (this.renda_mensal && this.renda_mensal <= 0) {
      erros.push('Renda mensal deve ser maior que zero');
    }

    if (
      this.nota_media_inquilino &&
      (this.nota_media_inquilino < 0 || this.nota_media_inquilino > 5)
    ) {
      erros.push('Nota média deve estar entre 0 e 5');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }

  private validarCpf(): boolean {
    const cpf = this.cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  }

  private validarEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
