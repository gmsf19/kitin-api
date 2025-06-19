import { Expose } from 'class-transformer';

export class BaseResponseDto<T> {
  @Expose()
  success: boolean;

  @Expose()
  message?: string;

  @Expose()
  data?: T;

  @Expose()
  errors?: string[];

  @Expose()
  timestamp: Date;

  constructor(data?: T, message?: string, success: boolean = true) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = new Date();
  }

  static success<T>(data: T, message?: string): BaseResponseDto<T> {
    return new BaseResponseDto(data, message, true);
  }

  static error<T>(errors: string[], message?: string): BaseResponseDto<T> {
    const response = new BaseResponseDto<T>(undefined, message, false);
    response.errors = errors;
    return response;
  }
}

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @Expose()
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  constructor(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ) {
    super(data, message);
    
    const totalPages = Math.ceil(total / limit);
    
    this.pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  static create<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(data, page, limit, total, message);
  }
}

