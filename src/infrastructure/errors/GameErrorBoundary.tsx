
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, RefreshCw, Home } from 'lucide-react';
import { errorLogger } from './ErrorLogger';
import { GameError } from './GameError';

interface Props {
  children: ReactNode;
  gameType?: string;
  onGameRestart?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: GameError;
  errorId?: string;
}

export class GameErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const gameError = new GameError(
      error.message,
      'GAME_CRASH',
      'high',
      true,
      'The game encountered an error and needs to restart.',
      {
        gameType: this.props.gameType,
        errorInfo: errorInfo.componentStack
      }
    );

    const errorId = Math.random().toString(36).substr(2, 9);
    
    errorLogger.logError(gameError, {
      sessionId: errorId,
      url: window.location.href
    });

    this.setState({ error: gameError, errorId });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('GameErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRestartGame = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
    if (this.props.onGameRestart) {
      this.props.onGameRestart();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <GamepadIcon className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Game Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {this.state.error?.userMessage || 'The game encountered an error and needs to restart.'}
              </p>
              
              {this.state.errorId && (
                <p className="text-xs text-muted-foreground text-center">
                  Error ID: {this.state.errorId}
                </p>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRestartGame} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restart Game
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
