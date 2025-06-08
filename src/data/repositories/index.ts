
// Central export for all repository interfaces and implementations
export { IRepository, PaginatedResult } from './IRepository';
export { 
  RepositoryError, 
  NotFoundError, 
  ValidationError, 
  ConflictError 
} from './IRepository';
export { BaseRepository } from './BaseRepository';
