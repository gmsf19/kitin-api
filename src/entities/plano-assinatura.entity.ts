import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Empresa } from './empresa.entity';
import { PagamentoAssinaturaSaaS } from './pagamento-assinatura-saas.entity';

export enum StatusPlano {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
}

@Entity('plano_assinatura')
@Index('IDX_PLANO_NOME', ['nome'], { unique: true })
@Index('IDX_PLANO_STATUS', ['status'])
export class PlanoAssinatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  preco_mensal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  preco_anual: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  limite_kitnets: number;

  @Column({ type: 'integer', nullable: false, default: 1 })
  limite_usuarios_admin: number;

  @Column({ type: 'text', nullable: true })
  funcionalidades_incluidas: string;

  @Column({
    type: 'enum',
    enum: StatusPlano,
    default: StatusPlano.ATIVO,
  })
  status: StatusPlano;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @OneToMany(() => Empresa, (empresa) => empresa.plano_assinado)
  empresas: Empresa[];

  @OneToMany(() => PagamentoAssinaturaSaaS, (pagamento) => pagamento.plano)
  pagamentos: PagamentoAssinaturaSaaS[];

  // Métodos auxiliares
  isAtivo(): boolean {
    return this.status === StatusPlano.ATIVO;
  }

  getPrecoAnualComDesconto(): number {
    return this.preco_anual || this.preco_mensal * 12 * 0.9; // 10% desconto se não especificado
  }

  podeAdicionarKitnets(quantidadeAtual: number): boolean {
    return quantidadeAtual < this.limite_kitnets;
  }

  podeAdicionarUsuarios(quantidadeAtual: number): boolean {
    return quantidadeAtual < this.limite_usuarios_admin;
  }
}
