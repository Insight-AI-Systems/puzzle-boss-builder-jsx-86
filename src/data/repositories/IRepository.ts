
// Base repository interface for all data operations
export interface IRepository<T, K = string> {
  // Standard CRUD operations
  findById(id: K): Promise<T | null>;
  findMany(filter?: Partial<T>): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: K, updates: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
  
  // Bulk operations
  createMany(entities: Omit<T, 'id' | 'created_at' | 'updated_at'>[]): Promise<T[]>;
  updateMany(filter: Partial<T>, updates: Partial<T>): Promise<T[]>;
  deleteMany(filter: Partial<T>): Promise<number>;
  
  // Query operations
  count(filter?: Partial<T>): Promise<number>;
  exists(id: K): Promise<boolean>;
  
  // Pagination
  findPaginated(
    page: number, 
    limit: number, 
    filter?: Partial<T>,
    sortBy?: keyof T,
    sortOrder?: 'asc' | 'desc'
  ): Promise<PaginatedResult<T>>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Repository error types
export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class NotFoundError extends RepositoryError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', { resource, id });
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends RepositoryError {
  constructor(message: string, details?: any) {
    super(message, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}
