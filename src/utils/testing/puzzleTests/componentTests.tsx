
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PuzzleStateDisplay from '@/components/puzzles/components/PuzzleStateDisplay';
import SoundControls from '@/components/puzzles/components/SoundControls';
import { PuzzleState } from '@/components/puzzles/types/puzzle-types';

describe('Puzzle Components', () => {
  describe('LoadingSpinner', () => {
    test('renders with default props', () => {
      render(<LoadingSpinner />);
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
    
    test('renders with custom message', () => {
      render(<LoadingSpinner message="Custom loading message" />);
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });
    
    test('renders with custom size', () => {
      render(<LoadingSpinner size="large" />);
      const spinner = document.querySelector('.h-12');
      expect(spinner).toBeInTheDocument();
    });
  });
  
  describe('PuzzleStateDisplay', () => {
    const mockState: PuzzleState = {
      isComplete: false,
      timeSpent: 120,
      correctPieces: 4,
      difficulty: '3x3',
      moveCount: 10,
      isActive: true,
      gameMode: 'classic',
      timeLimit: 300
    };
    
    const mockHandlers = {
      onNewGame: jest.fn(),
      onDifficultyChange: jest.fn(),
      onTogglePause: jest.fn()
    };
    
    test('renders puzzle state correctly', () => {
      render(
        <PuzzleStateDisplay 
          state={mockState} 
          totalPieces={9}
          onNewGame={mockHandlers.onNewGame}
          onDifficultyChange={mockHandlers.onDifficultyChange}
          onTogglePause={mockHandlers.onTogglePause}
          isMobile={false}
        />
      );
      
      // Check that time is displayed
      expect(screen.getByText('02:00')).toBeInTheDocument();
      
      // Check that moves are displayed
      expect(screen.getByText('10')).toBeInTheDocument();
      
      // Check that progress is displayed (4/9)
      expect(screen.getByText('4/9')).toBeInTheDocument();
    });
    
    test('calls handlers when buttons are clicked', () => {
      render(
        <PuzzleStateDisplay 
          state={mockState} 
          totalPieces={9}
          onNewGame={mockHandlers.onNewGame}
          onDifficultyChange={mockHandlers.onDifficultyChange}
          onTogglePause={mockHandlers.onTogglePause}
          isMobile={false}
        />
      );
      
      // Find and click the new game button
      const newGameButton = screen.getByRole('button', { name: /new game/i });
      fireEvent.click(newGameButton);
      expect(mockHandlers.onNewGame).toHaveBeenCalled();
      
      // Find and click the pause button
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      fireEvent.click(pauseButton);
      expect(mockHandlers.onTogglePause).toHaveBeenCalled();
    });
  });
  
  describe('SoundControls', () => {
    test('renders mute button and volume slider', () => {
      const mockHandlers = {
        onToggleMute: jest.fn(),
        onVolumeChange: jest.fn()
      };
      
      render(
        <SoundControls 
          muted={false}
          volume={0.5}
          onToggleMute={mockHandlers.onToggleMute}
          onVolumeChange={mockHandlers.onVolumeChange}
          isMobile={false}
        />
      );
      
      // Check that volume icon is rendered
      const volumeIcon = screen.getByRole('button');
      expect(volumeIcon).toBeInTheDocument();
      
      // Click mute button
      fireEvent.click(volumeIcon);
      expect(mockHandlers.onToggleMute).toHaveBeenCalled();
      
      // Check that slider is rendered
      const slider = document.querySelector('input[type="range"]');
      expect(slider).toBeInTheDocument();
      
      // Change volume
      if (slider) {
        fireEvent.change(slider, { target: { value: '0.8' } });
        expect(mockHandlers.onVolumeChange).toHaveBeenCalledWith(0.8);
      }
    });
    
    test('shows muted state correctly', () => {
      render(
        <SoundControls 
          muted={true}
          volume={0.5}
          onToggleMute={jest.fn()}
          onVolumeChange={jest.fn()}
          isMobile={false}
        />
      );
      
      // Check that volume-x icon is rendered for muted state
      const volumeXIcon = document.querySelector('.lucide-volume-x');
      expect(volumeXIcon).toBeInTheDocument();
    });
  });
});
