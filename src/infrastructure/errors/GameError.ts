
export class GameError extends Error {
  public readonly code: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly recoverable: boolean;
  public readonly userMessage: string;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    recoverable: boolean = true,
    userMessage?: string,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'GameError';
    this.code = code;
    this.severity = severity;
    this.recoverable = recoverable;
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.metadata = metadata;
  }

  private getDefaultUserMessage(): string {
    switch (this.code) {
      case 'GAME_INITIALIZATION_FAILED':
        return 'Failed to start the game. Please try again.';
      case 'SAVE_PROGRESS_FAILED':
        return 'Unable to save your progress. Your game will continue, but progress may be lost.';
      case 'LOAD_PROGRESS_FAILED':
        return 'Unable to load your saved progress. Starting a new game.';
      case 'INVALID_MOVE':
        return 'That move is not allowed. Please try a different action.';
      case 'GAME_ENGINE_ERROR':
        return 'The game encountered an unexpected error. Please refresh and try again.';
      default:
        return 'A game error occurred. Please try again.';
    }
  }
}
