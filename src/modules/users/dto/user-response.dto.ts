import { Exclude, Expose } from 'class-transformer';
import { TipoUsuario, StatusConta } from '../../../entities/user.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nome_completo: string;

  @Expose()
  tipo_usuario: TipoUsuario;

  @Expose()
  status_conta: StatusConta;

  @Expose()
  data_criacao: Date;

  @Expose()
  ultimo_login: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Campos sensíveis excluídos
  @Exclude()
  senha: string;

  @Exclude()
  empresa_associada_id: string;

  @Exclude()
  inquilino_associado_id: string;

  // Campos calculados
  @Expose()
  get primeiro_nome(): string {
    return this.nome_completo?.split(' ')[0] || '';
  }

  @Expose()
  get iniciais(): string {
    return this.nome_completo
      ?.split(' ')
      .map(nome => nome.charAt(0).toUpperCase())
      .join('') || '';
  }

  @Expose()
  get dias_desde_ultimo_login(): number {
    if (!this.ultimo_login) return 0;
    const hoje = new Date();
    const diffTime = hoje.getTime() - this.ultimo_login.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}

