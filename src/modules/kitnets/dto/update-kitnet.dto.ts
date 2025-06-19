import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateKitnetDto } from './create-kitnet.dto';

export class UpdateKitnetDto extends PartialType(CreateKitnetDto) {
  @IsOptional()
  @IsUUID('4', { message: 'ID do contrato deve ser um UUID válido' })
  contrato_atual_id?: string;
}

