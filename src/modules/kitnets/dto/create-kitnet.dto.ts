import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsArray, IsDateString, Min, Max } from 'class-validator';
import { StatusKitnet } from '../../../entities/kitnet.entity';

export class CreateKitnetDto {
  @IsString({ message: 'Nome identificador deve ser uma string' })
  @IsNotEmpty({ message: 'Nome identificador é obrigatório' })
  nome_identificador: string;

  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Empresa proprietária é obrigatória' })
  empresa_proprietaria_id: string;

  @IsString({ message: 'Endereço deve ser uma string' })
  @IsNotEmpty({ message: 'Endereço completo é obrigatório' })
  endereco_completo: string;

  @IsOptional()
  @IsNumber({}, { message: 'Área deve ser um número' })
  @Min(1, { message: 'Área deve ser maior que zero' })
  area_m2?: number;

  @IsNumber({}, { message: 'Valor do aluguel deve ser um número' })
  @Min(1, { message: 'Valor do aluguel deve ser maior que zero' })
  valor_aluguel_base: number;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @IsOptional()
  @IsString({ message: 'Características deve ser uma string' })
  caracteristicas?: string;

  @IsOptional()
  @IsArray({ message: 'URLs das fotos deve ser um array' })
  @IsString({ each: true, message: 'Cada URL deve ser uma string' })
  fotos_urls?: string[];

  @IsOptional()
  @IsEnum(StatusKitnet, { message: 'Status inválido' })
  status?: StatusKitnet;

  @IsOptional()
  @IsDateString({}, { message: 'Data de aquisição deve ser uma data válida' })
  data_aquisicao?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Nota média deve ser um número' })
  @Min(0, { message: 'Nota deve ser maior ou igual a zero' })
  @Max(5, { message: 'Nota deve ser menor ou igual a 5' })
  nota_media_kitnet?: number;
}

