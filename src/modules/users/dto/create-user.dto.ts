import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID, MinLength } from 'class-validator';
import { TipoUsuario } from '../../../entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @IsString({ message: 'Nome completo deve ser uma string' })
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  nome_completo: string;

  @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido' })
  tipo_usuario: TipoUsuario;

  @IsOptional()
  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  empresa_associada_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID do inquilino deve ser um UUID válido' })
  inquilino_associado_id?: string;
}

