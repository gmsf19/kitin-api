import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { StatusConta } from '../../../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(StatusConta, { message: 'Status da conta inválido' })
  status_conta?: StatusConta;
}

