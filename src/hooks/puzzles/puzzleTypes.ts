
export interface Puzzle {
  id: string;
  name: string;
  category: string;
  category_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  timeLimit: number;
  costPerPlay: number;
  targetRevenue: number;
  status: 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft';
  prize: string;
  description?: string;
  puzzleOwner?: string;
  supplier?: string;
  completions?: number;
  avgTime?: number;
  prizeValue: number;
}

// This maps database status values to our application status types
export const statusMap: Record<string, Puzzle['status']> = {
  'active': 'active',
  'inactive': 'inactive',
  'scheduled': 'scheduled',
  'completed': 'completed',
  'draft': 'draft'
};

// Function to ensure status values from database map to our allowed types
export function mapStatusFromDatabase(dbStatus: string): Puzzle['status'] {
  return statusMap[dbStatus] || 'draft';
}
