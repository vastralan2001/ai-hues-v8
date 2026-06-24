'use client';

import type { ReactNode } from 'react';

import { ChessDemo } from '@/components/games/ChessGame.demo';
import { TetrisDemo } from '@/components/games/TetrisGame.demo';
import { DailyLuckDemo } from '@/components/games/DailyFortuneGame.demo';
import { MinesweeperDemo } from '@/components/games/MinesweeperGame.demo';
import { SlotDemo } from '@/components/games/SlotMachineGame.demo';
import { SnakeDemo } from '@/components/games/SnakeGame.demo';

/* Registry only — each game's auto-play demo lives beside its real game in
   <Game>.demo.tsx, so the preview and the game evolve together. */
const GAME_DEMOS: Record<string, (p: { active: boolean }) => ReactNode> = {
  snake: SnakeDemo,
  chess: ChessDemo,
  minesweeper: MinesweeperDemo,
  'block-drop': TetrisDemo,
  'slot-machine': SlotDemo,
  'daily-luck': DailyLuckDemo,
};

export function GameDemo({
  slug,
  active = false,
}: {
  slug: string;
  active?: boolean;
}) {
  const D = GAME_DEMOS[slug];
  return D ? <D active={active} /> : null;
}

export const GAME_DEMO_SLUGS = Object.keys(GAME_DEMOS);
