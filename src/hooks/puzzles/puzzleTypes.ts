
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
