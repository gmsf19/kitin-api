import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { TipoUsuario, StatusConta } from '../../../entities/user.entity';

export class UserFilterDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido' })
  tipo_usuario?: TipoUsuario;

  @IsOptional()
  @IsEnum(StatusConta, { message: 'Status da conta inválido' })
  status_conta?: StatusConta;

  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  search?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  empresa_id?: string;

  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser uma string' })
  sort_by?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Ordem deve ser ASC ou DESC' })
  sort_order?: 'ASC' | 'DESC';
}

