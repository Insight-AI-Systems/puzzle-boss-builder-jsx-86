
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
  created_at?: string;
}

// Map database status string to our frontend status type
export function mapStatusFromDatabase(status: string): 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft' {
  switch (status) {
    case 'active':
      return 'active';
    case 'inactive':
      return 'inactive';
    case 'scheduled':
      return 'scheduled';
    case 'completed':
      return 'completed';
    default:
      return 'draft';
  }
}
