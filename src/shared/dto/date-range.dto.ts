import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  end_date?: string;

  // Métodos auxiliares
  get startDate(): Date | undefined {
    return this.start_date ? new Date(this.start_date) : undefined;
  }

  get endDate(): Date | undefined {
    return this.end_date ? new Date(this.end_date) : undefined;
  }

  isValid(): boolean {
    if (!this.startDate || !this.endDate) return true;
    return this.startDate <= this.endDate;
  }

  getDaysDifference(): number {
    if (!this.startDate || !this.endDate) return 0;
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

