
import { CustomError } from './ErrorLogger';
import { GameError } from './GameError';
import { PaymentError } from './PaymentError';
import { DataError } from './DataError';
import { ValidationError } from './ValidationError';

export interface RecoveryAction {
  id: string;
  label: string;
  description: string;
  action: () => Promise<boolean>;
  automatic?: boolean;
}

export class ErrorRecoveryService {
  async getRecoveryActions(error: CustomError): Promise<RecoveryAction[]> {
    const actions: RecoveryAction[] = [];

    if (error instanceof GameError) {
      actions.push(...this.getGameRecoveryActions(error));
    } else if (error instanceof PaymentError) {
      actions.push(...this.getPaymentRecoveryActions(error));
    } else if (error instanceof DataError) {
      actions.push(...this.getDataRecoveryActions(error));
    } else if (error instanceof ValidationError) {
      actions.push(...this.getValidationRecoveryActions(error));
    }

    return actions;
  }

  private getGameRecoveryActions(error: GameError): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    switch (error.code) {
      case 'SAVE_PROGRESS_FAILED':
        actions.push({
          id: 'retry-save',
          label: 'Retry Save',
          description: 'Try saving your progress again',
          action: async () => {
            // Implement retry save logic
            return true;
          }
        });
        break;

      case 'LOAD_PROGRESS_FAILED':
        actions.push({
          id: 'start-new-game',
          label: 'Start New Game',
          description: 'Start a fresh game instead',
          action: async () => {
            // Implement new game logic
            return true;
          }
        });
        break;

      case 'GAME_ENGINE_ERROR':
        actions.push({
          id: 'restart-engine',
          label: 'Restart Game Engine',
          description: 'Reinitialize the game engine',
          action: async () => {
            // Implement engine restart logic
            return true;
          }
        });
        break;
    }

    return actions;
  }

  private getPaymentRecoveryActions(error: PaymentError): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    switch (error.code) {
      case 'INSUFFICIENT_FUNDS':
        actions.push({
          id: 'add-credits',
          label: 'Add Credits',
          description: 'Add more credits to your account',
          action: async () => {
            // Navigate to add credits page
            window.location.href = '/account/credits';
            return true;
          }
        });
        break;

      case 'PAYMENT_FAILED':
        actions.push({
          id: 'retry-payment',
          label: 'Retry Payment',
          description: 'Try the payment again',
          action: async () => {
            // Implement payment retry logic
            return true;
          }
        });
        break;

      case 'PAYMENT_TIMEOUT':
        actions.push({
          id: 'retry-payment',
          label: 'Retry Payment',
          description: 'Try the payment again',
          action: async () => {
            // Implement payment retry logic
            return true;
          }
        });
        break;
    }

    return actions;
  }

  private getDataRecoveryActions(error: DataError): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    switch (error.code) {
      case 'DATA_FETCH_FAILED':
        actions.push({
          id: 'retry-fetch',
          label: 'Retry',
          description: 'Try loading the data again',
          action: async () => {
            // Implement retry fetch logic
            window.location.reload();
            return true;
          },
          automatic: true
        });
        break;

      case 'DATABASE_CONNECTION_ERROR':
        actions.push({
          id: 'check-connection',
          label: 'Check Connection',
          description: 'Verify your internet connection',
          action: async () => {
            // Implement connection check
            return navigator.onLine;
          }
        });
        break;

      case 'SYNC_FAILED':
        actions.push({
          id: 'retry-sync',
          label: 'Retry Sync',
          description: 'Try syncing your data again',
          action: async () => {
            // Implement sync retry logic
            return true;
          }
        });
        break;
    }

    return actions;
  }

  private getValidationRecoveryActions(error: ValidationError): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    // Validation errors typically don't need recovery actions
    // as they should be handled by the form itself
    actions.push({
      id: 'clear-form',
      label: 'Clear Form',
      description: 'Clear the form and start over',
      action: async () => {
        // Implement form clearing logic
        return true;
      }
    });

    return actions;
  }

  async executeRecovery(action: RecoveryAction): Promise<boolean> {
    try {
      return await action.action();
    } catch (error) {
      console.error('Recovery action failed:', error);
      return false;
    }
  }
}

export const errorRecovery = new ErrorRecoveryService();
