
import { ReactNode } from 'react';

/**
 * Generic props for components that wrap children
 */
export interface WithChildren {
  children: ReactNode;
}

/**
 * Generic props for components with custom className
 */
export interface WithClassName {
  className?: string;
}

/**
 * Common props shared across many components
 */
export interface CommonComponentProps extends WithClassName {
  id?: string;
  testId?: string;
}

/**
 * Standard props for list items
 */
export interface ListItemProps extends CommonComponentProps {
  active?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Resource loading state model
 */
export interface ResourceState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Sort direction options
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort options for API requests
 */
export interface SortParams {
  field: string;
  direction: SortDirection;
}

/**
 * Filter option format
 */
export interface FilterOption {
  value: string | number | boolean;
  label: string;
}

/**
 * Date range for filtering
 */
export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}
