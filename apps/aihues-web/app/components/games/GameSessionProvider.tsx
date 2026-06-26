'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface GameSession {
  slug: string;
  score: number;
  bestScore: number;
  isGameOver: boolean;
  reportScore: (score: number) => void;
  reportGameOver: (score: number) => void;
  resetSession: () => void;
}

const GameSessionContext = createContext<GameSession | null>(null);

export function GameSessionProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const reportScore = useCallback((next: number) => {
    setScore(next);
    setBestScore((prev) => (next > prev ? next : prev));
  }, []);

  const reportGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setBestScore((prev) => (finalScore > prev ? finalScore : prev));
    setIsGameOver(true);
  }, []);

  const resetSession = useCallback(() => {
    setScore(0);
    setIsGameOver(false);
  }, []);

  const value = useMemo(
    () => ({
      slug,
      score,
      bestScore,
      isGameOver,
      reportScore,
      reportGameOver,
      resetSession,
    }),
    [
      slug,
      score,
      bestScore,
      isGameOver,
      reportScore,
      reportGameOver,
      resetSession,
    ]
  );

  return (
    <GameSessionContext.Provider value={value}>
      {children}
    </GameSessionContext.Provider>
  );
}

export function useGameSession() {
  const ctx = useContext(GameSessionContext);
  if (!ctx) {
    throw new Error('useGameSession must be used inside GameSessionProvider');
  }
  return ctx;
}

export function useOptionalGameSession() {
  return useContext(GameSessionContext);
}
