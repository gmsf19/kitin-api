import { IsOptional, IsEnum, IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { StatusKitnet } from '../../../entities/kitnet.entity';

export class KitnetFilterDto extends PaginationDto {
  @IsOptional()
  @IsEnum(StatusKitnet, { message: 'Status inválido' })
  status?: StatusKitnet;

  @IsOptional()
  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  empresa_id?: string;

  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor mínimo deve ser um número' })
  @Min(0, { message: 'Valor mínimo deve ser maior ou igual a zero' })
  valor_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor máximo deve ser um número' })
  @Min(0, { message: 'Valor máximo deve ser maior ou igual a zero' })
  valor_max?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Área mínima deve ser um número' })
  @Min(0, { message: 'Área mínima deve ser maior ou igual a zero' })
  area_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Área máxima deve ser um número' })
  @Min(0, { message: 'Área máxima deve ser maior ou igual a zero' })
  area_max?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Nota mínima deve ser um número' })
  @Min(0, { message: 'Nota mínima deve ser maior ou igual a zero' })
  @Max(5, { message: 'Nota mínima deve ser menor ou igual a 5' })
  nota_min?: number;

  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  cidade?: string;

  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  bairro?: string;

  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser uma string' })
  sort_by?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Ordem deve ser ASC ou DESC' })
  sort_order?: 'ASC' | 'DESC';
}

