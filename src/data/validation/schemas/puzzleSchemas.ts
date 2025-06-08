
import * as z from 'zod';
import { 
  uuidSchema, 
  sanitizedTextSchema, 
  currencySchema,
  positiveNumberSchema,
  nonNegativeNumberSchema,
  urlSchema 
} from './commonSchemas';
import { gameDifficultySchema, gameStatusSchema } from './gameSchemas';

// Puzzle type validation
export const puzzleTypeSchema = z.enum([
  'jigsaw',
  'word-search',
  'crossword',
  'memory',
  'sudoku'
]);

// Puzzle piece count validation
export const puzzlePieceCountSchema = z.number()
  .int()
  .min(4, 'Minimum 4 pieces')
  .max(2000, 'Maximum 2000 pieces');

// Puzzle configuration schema
export const puzzleConfigSchema = z.object({
  rows: z.number().int().min(2).max(50).default(4),
  columns: z.number().int().min(2).max(50).default(4),
  showGuide: z.boolean().default(true),
  allowRotation: z.boolean().default(false),
  snapTolerance: z.number().min(0).max(100).default(20),
  autoSave: z.boolean().default(true),
  soundEnabled: z.boolean().default(true)
});

// Puzzle creation schema
export const puzzleCreateSchema = z.object({
  title: sanitizedTextSchema(1, 255),
  description: sanitizedTextSchema(0, 1000).optional(),
  category_id: uuidSchema,
  image_url: urlSchema,
  puzzle_type: puzzleTypeSchema.default('jigsaw'),
  difficulty_level: gameDifficultySchema.default('medium'),
  pieces: puzzlePieceCountSchema.default(64),
  time_limit: positiveNumberSchema.default(300),
  cost_per_play: currencySchema.default(1.99),
  prize_value: currencySchema,
  income_target: currencySchema.default(0),
  puzzle_config: puzzleConfigSchema.default({}),
  puzzle_owner: sanitizedTextSchema(0, 100).optional(),
  supplier: sanitizedTextSchema(0, 100).optional()
});

// Puzzle update schema
export const puzzleUpdateSchema = z.object({
  title: sanitizedTextSchema(1, 255).optional(),
  description: sanitizedTextSchema(0, 1000).optional(),
  category_id: uuidSchema.optional(),
  image_url: urlSchema.optional(),
  difficulty_level: gameDifficultySchema.optional(),
  pieces: puzzlePieceCountSchema.optional(),
  time_limit: positiveNumberSchema.optional(),
  cost_per_play: currencySchema.optional(),
  prize_value: currencySchema.optional(),
  income_target: currencySchema.optional(),
  status: gameStatusSchema.optional(),
  puzzle_config: puzzleConfigSchema.optional(),
  puzzle_owner: sanitizedTextSchema(0, 100).optional(),
  supplier: sanitizedTextSchema(0, 100).optional(),
  expected_release_date: z.string().datetime().optional()
});

// Puzzle completion schema
export const puzzleCompletionSchema = z.object({
  user_id: uuidSchema,
  puzzle_id: uuidSchema,
  completion_time: positiveNumberSchema,
  moves_count: nonNegativeNumberSchema.optional(),
  game_mode: z.string().optional(),
  difficulty_level: gameDifficultySchema.optional(),
  is_winner: z.boolean().default(false),
  hints_used: nonNegativeNumberSchema.default(0)
});

// Puzzle progress schema
export const puzzleProgressSchema = z.object({
  user_id: uuidSchema,
  puzzle_id: uuidSchema,
  progress: z.object({
    completed: z.boolean().default(false),
    pieces_placed: z.array(z.number()).default([]),
    time_elapsed: nonNegativeNumberSchema.default(0),
    moves_count: nonNegativeNumberSchema.default(0),
    hints_used: nonNegativeNumberSchema.default(0),
    last_save: z.string().datetime().optional()
  }),
  is_completed: z.boolean().default(false),
  completion_time: positiveNumberSchema.optional()
});

// Puzzle leaderboard schema
export const puzzleLeaderboardSchema = z.object({
  puzzle_id: uuidSchema,
  player_id: uuidSchema,
  player_name: sanitizedTextSchema(1, 50),
  time_seconds: positiveNumberSchema,
  moves_count: nonNegativeNumberSchema.optional(),
  difficulty_level: gameDifficultySchema.optional()
});

// Puzzle search schema
export const puzzleSearchSchema = z.object({
  query: sanitizedTextSchema(0, 255).optional(),
  category_id: uuidSchema.optional(),
  puzzle_type: puzzleTypeSchema.optional(),
  difficulty_level: gameDifficultySchema.optional(),
  status: gameStatusSchema.optional(),
  min_pieces: puzzlePieceCountSchema.optional(),
  max_pieces: puzzlePieceCountSchema.optional(),
  min_prize: currencySchema.optional(),
  max_prize: currencySchema.optional(),
  puzzle_owner: sanitizedTextSchema(0, 100).optional(),
  supplier: sanitizedTextSchema(0, 100).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['created_at', 'title', 'difficulty_level', 'prize_value', 'completions']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Puzzle analytics schema
export const puzzleAnalyticsSchema = z.object({
  puzzle_id: uuidSchema.optional(),
  category_id: uuidSchema.optional(),
  date_from: z.string().datetime(),
  date_to: z.string().datetime(),
  metrics: z.array(z.enum(['plays', 'completions', 'revenue', 'avg_time', 'success_rate'])).default(['plays', 'completions']),
  group_by: z.enum(['day', 'week', 'month']).default('day')
});

// Puzzle validation helper functions
export const validatePuzzle = {
  create: (data: unknown) => puzzleCreateSchema.parse(data),
  update: (data: unknown) => puzzleUpdateSchema.parse(data),
  completion: (data: unknown) => puzzleCompletionSchema.parse(data),
  progress: (data: unknown) => puzzleProgressSchema.parse(data),
  leaderboard: (data: unknown) => puzzleLeaderboardSchema.parse(data),
  search: (data: unknown) => puzzleSearchSchema.parse(data),
  analytics: (data: unknown) => puzzleAnalyticsSchema.parse(data)
};
