
import * as z from 'zod';
import { 
  uuidSchema, 
  sanitizedTextSchema, 
  positiveNumberSchema,
  nonNegativeNumberSchema,
  currencySchema 
} from './commonSchemas';

// Game type validation
export const gameTypeSchema = z.enum([
  'jigsaw',
  'word-search', 
  'crossword',
  'memory',
  'sudoku',
  'tetris'
]);

// Game difficulty validation
export const gameDifficultySchema = z.enum([
  'easy',
  'medium', 
  'hard',
  'expert'
]);

// Game status validation
export const gameStatusSchema = z.enum([
  'draft',
  'active',
  'paused', 
  'completed',
  'archived'
]);

// Game session status validation
export const gameSessionStatusSchema = z.enum([
  'active',
  'paused',
  'completed',
  'abandoned'
]);

// Game configuration schema
export const gameConfigSchema = z.object({
  gameType: gameTypeSchema,
  hasTimer: z.boolean().default(true),
  hasScore: z.boolean().default(true),
  hasMoves: z.boolean().default(false),
  timeLimit: positiveNumberSchema.optional(),
  requiresPayment: z.boolean().default(false),
  entryFee: currencySchema.optional(),
  difficulty: gameDifficultySchema,
  hintsEnabled: z.boolean().default(true),
  soundEnabled: z.boolean().default(true),
  showGuide: z.boolean().default(true)
});

// Game creation schema
export const gameCreateSchema = z.object({
  title: sanitizedTextSchema(1, 255),
  type: gameTypeSchema,
  category_id: uuidSchema.optional(),
  image_url: z.string().url('Invalid image URL').optional(),
  description: sanitizedTextSchema(0, 1000).optional(),
  difficulty: gameDifficultySchema,
  prize_value: currencySchema.optional(),
  entry_fee: currencySchema.optional(),
  time_limit: positiveNumberSchema.optional(),
  max_players: z.number().int().positive().max(1000).optional(),
  config: gameConfigSchema
});

// Game update schema
export const gameUpdateSchema = z.object({
  title: sanitizedTextSchema(1, 255).optional(),
  description: sanitizedTextSchema(0, 1000).optional(),
  difficulty: gameDifficultySchema.optional(),
  status: gameStatusSchema.optional(),
  prize_value: currencySchema.optional(),
  entry_fee: currencySchema.optional(),
  time_limit: positiveNumberSchema.optional(),
  max_players: z.number().int().positive().max(1000).optional(),
  config: gameConfigSchema.optional()
});

// Game session schema
export const gameSessionSchema = z.object({
  game_id: uuidSchema,
  user_id: uuidSchema,
  status: gameSessionStatusSchema.default('active'),
  score: nonNegativeNumberSchema.default(0),
  moves: nonNegativeNumberSchema.default(0),
  time_elapsed: nonNegativeNumberSchema.default(0),
  game_state: z.record(z.any()).default({})
});

// Game progress schema
export const gameProgressSchema = z.object({
  game_id: uuidSchema,
  user_id: uuidSchema,
  session_id: uuidSchema,
  progress_data: z.record(z.any()),
  percentage_complete: z.number().min(0).max(100),
  last_checkpoint: z.string().optional()
});

// Game completion schema
export const gameCompletionSchema = z.object({
  game_id: uuidSchema,
  user_id: uuidSchema,
  session_id: uuidSchema,
  completion_time: positiveNumberSchema,
  final_score: nonNegativeNumberSchema,
  moves_count: nonNegativeNumberSchema.optional(),
  hints_used: nonNegativeNumberSchema.optional(),
  is_winner: z.boolean().default(false),
  prize_awarded: currencySchema.optional(),
  completion_data: z.record(z.any()).default({})
});

// Game leaderboard entry schema
export const gameLeaderboardEntrySchema = z.object({
  game_id: uuidSchema,
  user_id: uuidSchema,
  username: sanitizedTextSchema(1, 50),
  score: nonNegativeNumberSchema,
  time_taken: positiveNumberSchema,
  rank: z.number().int().positive()
});

// Game search schema
export const gameSearchSchema = z.object({
  query: sanitizedTextSchema(0, 255).optional(),
  type: gameTypeSchema.optional(),
  difficulty: gameDifficultySchema.optional(),
  status: gameStatusSchema.optional(),
  category_id: uuidSchema.optional(),
  minPrize: currencySchema.optional(),
  maxPrize: currencySchema.optional(),
  hasEntryFee: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});

// Game validation helper functions
export const validateGame = {
  create: (data: unknown) => gameCreateSchema.parse(data),
  update: (data: unknown) => gameUpdateSchema.parse(data),
  session: (data: unknown) => gameSessionSchema.parse(data),
  progress: (data: unknown) => gameProgressSchema.parse(data),
  completion: (data: unknown) => gameCompletionSchema.parse(data),
  leaderboardEntry: (data: unknown) => gameLeaderboardEntrySchema.parse(data),
  search: (data: unknown) => gameSearchSchema.parse(data)
};
