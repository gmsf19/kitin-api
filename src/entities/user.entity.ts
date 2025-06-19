import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Empresa } from './empresa.entity';
import { Inquilino } from './inquilino.entity';

export enum TipoUsuario {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN_EMPRESA = 'AdminEmpresa',
  INQUILINO = 'Inquilino',
}

export enum StatusConta {
  ATIVA = 'Ativa',
  INATIVA = 'Inativa',
  SUSPENSA = 'Suspensa',
}

@Entity('user')
@Index('IDX_USER_EMAIL', ['email'], { unique: true })
@Index('IDX_USER_TIPO', ['tipo_usuario'])
@Index('IDX_USER_EMPRESA', ['empresa_associada_id'])
@Index('IDX_USER_STATUS', ['status_conta'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude({ toPlainOnly: true })
  senha: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome_completo: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    nullable: false,
  })
  tipo_usuario: TipoUsuario;

  @Column({ type: 'uuid', nullable: true })
  empresa_associada_id: string;

  @Column({ type: 'uuid', nullable: true })
  inquilino_associado_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  ultimo_login: Date;

  @Column({
    type: 'enum',
    enum: StatusConta,
    default: StatusConta.ATIVA,
  })
  status_conta: StatusConta;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios_administradores, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_associada_id' })
  empresa_associada: Empresa;

  @OneToOne(() => Inquilino, (inquilino) => inquilino.usuario_acesso, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'inquilino_associado_id' })
  inquilino_associado: Inquilino;

  // Hooks para criptografia de senha
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senha && !this.senha.startsWith('$2b$')) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }

  // Métodos auxiliares
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.senha);
  }

  isSuperAdmin(): boolean {
    return this.tipo_usuario === TipoUsuario.SUPER_ADMIN;
  }

  isAdminEmpresa(): boolean {
    return this.tipo_usuario === TipoUsuario.ADMIN_EMPRESA;
  }

  isInquilino(): boolean {
    return this.tipo_usuario === TipoUsuario.INQUILINO;
  }

  isAtivo(): boolean {
    return this.status_conta === StatusConta.ATIVA;
  }

  isInativo(): boolean {
    return this.status_conta === StatusConta.INATIVA;
  }

  isSuspenso(): boolean {
    return this.status_conta === StatusConta.SUSPENSA;
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

  atualizarUltimoLogin(): void {
    this.ultimo_login = new Date();
  }

  getDiasDesdeUltimoLogin(): number {
    if (!this.ultimo_login) return 0;
    const hoje = new Date();
    const diffTime = hoje.getTime() - this.ultimo_login.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  isUsuarioInativo(diasLimite: number = 30): boolean {
    return this.getDiasDesdeUltimoLogin() > diasLimite;
  }

  podeAcessarEmpresa(empresaId: string): boolean {
    if (this.isSuperAdmin()) return true;
    if (this.isAdminEmpresa()) return this.empresa_associada_id === empresaId;
    if (this.isInquilino())
      return this.inquilino_associado?.empresa_associada_id === empresaId;
    return false;
  }

  getPermissoes(): string[] {
    const permissoes: string[] = [];

    if (this.isSuperAdmin()) {
      permissoes.push(
        'gerenciar_sistema',
        'gerenciar_empresas',
        'gerenciar_planos',
        'visualizar_relatorios_globais',
      );
    }

    if (this.isAdminEmpresa()) {
      permissoes.push(
        'gerenciar_kitnets',
        'gerenciar_inquilinos',
        'gerenciar_contratos',
        'gerenciar_faturas',
        'gerenciar_manutencoes',
        'visualizar_relatorios_empresa',
      );
    }

    if (this.isInquilino()) {
      permissoes.push(
        'visualizar_contrato',
        'visualizar_faturas',
        'solicitar_manutencao',
        'avaliar_kitnet',
      );
    }

    return permissoes;
  }

  temPermissao(permissao: string): boolean {
    return this.getPermissoes().includes(permissao);
  }
}
