import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PlanoAssinatura } from './plano-assinatura.entity';
import { User } from './user.entity';
import { Kitnet } from './kitnet.entity';
import { Inquilino } from './inquilino.entity';
import { ContratoLocacao } from './contrato-locacao.entity';
import { Despesa } from './despesa.entity';
import { ConfiguracoesEmpresa } from './configuracoes-empresa.entity';
import { PagamentoAssinaturaSaaS } from './pagamento-assinatura-saas.entity';

export enum StatusContaSaaS {
  ATIVA = 'Ativa',
  SUSPENSA = 'Suspensa',
  TESTE = 'Teste',
  PAGAMENTO_PENDENTE = 'Pagamento Pendente',
}

@Entity('empresa')
@Index('IDX_EMPRESA_CNPJ_CPF', ['cnpj_cpf'], { unique: true })
@Index('IDX_EMPRESA_EMAIL', ['email_principal'], { unique: true })
@Index('IDX_EMPRESA_STATUS', ['status_conta_saas'])
@Index('IDX_EMPRESA_PLANO', ['plano_assinado_id'])
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome_empresa: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  cnpj_cpf: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  responsavel_principal: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  email_principal: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone_principal: string;

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro: Date;

  @Column({ type: 'uuid', nullable: false })
  plano_assinado_id: string;

  @Column({
    type: 'enum',
    enum: StatusContaSaaS,
    default: StatusContaSaaS.TESTE,
  })
  status_conta_saas: StatusContaSaaS;

  @Column({ type: 'date', nullable: true })
  data_proximo_vencimento: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  id_assinatura_gateway: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => PlanoAssinatura, (plano) => plano.empresas, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'plano_assinado_id' })
  plano_assinado: PlanoAssinatura;

  @OneToMany(() => User, (user) => user.empresa_associada)
  usuarios_administradores: User[];

  @OneToMany(() => Kitnet, (kitnet) => kitnet.empresa_proprietaria)
  kitnets: Kitnet[];

  @OneToMany(() => Inquilino, (inquilino) => inquilino.empresa_associada)
  inquilinos: Inquilino[];

  @OneToMany(
    () => ContratoLocacao,
    (contrato) => contrato.kitnet_alugada.empresa_proprietaria,
  )
  contratos: ContratoLocacao[];

  @OneToMany(() => Despesa, (despesa) => despesa.empresa_associada)
  despesas: Despesa[];

  @OneToOne(() => ConfiguracoesEmpresa, (config) => config.empresa)
  configuracoes: ConfiguracoesEmpresa;

  @OneToMany(() => PagamentoAssinaturaSaaS, (pagamento) => pagamento.empresa)
  pagamentos_saas: PagamentoAssinaturaSaaS[];

  // Métodos auxiliares
  isAtiva(): boolean {
    return this.status_conta_saas === StatusContaSaaS.ATIVA;
  }

  isEmTeste(): boolean {
    return this.status_conta_saas === StatusContaSaaS.TESTE;
  }

  isPagamentoPendente(): boolean {
    return this.status_conta_saas === StatusContaSaaS.PAGAMENTO_PENDENTE;
  }

  isSuspensa(): boolean {
    return this.status_conta_saas === StatusContaSaaS.SUSPENSA;
  }

  getQuantidadeKitnets(): number {
    return this.kitnets?.length || 0;
  }

  getQuantidadeUsuarios(): number {
    return this.usuarios_administradores?.length || 0;
  }

  podeAdicionarKitnet(): boolean {
    return (
      this.getQuantidadeKitnets() < (this.plano_assinado?.limite_kitnets || 0)
    );
  }

  podeAdicionarUsuario(): boolean {
    return (
      this.getQuantidadeUsuarios() <
      (this.plano_assinado?.limite_usuarios_admin || 0)
    );
  }

  formatarCnpjCpf(): string {
    const documento = this.cnpj_cpf.replace(/\D/g, '');
    if (documento.length === 11) {
      // CPF
      return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (documento.length === 14) {
      // CNPJ
      return documento.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }
    return this.cnpj_cpf;
  }

  getDiasAteVencimento(): number {
    if (!this.data_proximo_vencimento) return 0;
    const hoje = new Date();
    const vencimento = new Date(this.data_proximo_vencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isVencimentoProximo(dias: number = 7): boolean {
    const diasRestantes = this.getDiasAteVencimento();
    return diasRestantes <= dias && diasRestantes > 0;
  }

  isVencida(): boolean {
    return this.getDiasAteVencimento() < 0;
  }
}
