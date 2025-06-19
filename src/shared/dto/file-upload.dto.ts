import { IsOptional, IsString, IsArray, IsNumber, Max } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  @IsString({ message: 'Nome do arquivo deve ser uma string' })
  filename?: string;

  @IsOptional()
  @IsString({ message: 'Tipo MIME deve ser uma string' })
  mimetype?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Tamanho deve ser um número' })
  @Max(5242880, { message: 'Arquivo não pode ser maior que 5MB' }) // 5MB
  size?: number;

  @IsOptional()
  @IsString({ message: 'URL deve ser uma string' })
  url?: string;
}

export class MultipleFileUploadDto {
  @IsOptional()
  @IsArray({ message: 'Arquivos deve ser um array' })
  files?: FileUploadDto[];

  @IsOptional()
  @IsNumber({}, { message: 'Máximo de arquivos deve ser um número' })
  @Max(10, { message: 'Máximo de 10 arquivos permitidos' })
  max_files?: number;
}

