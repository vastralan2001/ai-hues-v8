import type { Metadata } from 'next';
import AgentChat from '@/components/AgentChat';

export const metadata: Metadata = {
  title: 'AI Agent',
  description: 'Plan and execute marketing campaigns with the AIHues AI agent.',
};

export default function AgentPage({
  searchParams,
}: {
  searchParams?: { prompt?: string };
}) {
  const initialPrompt = searchParams?.prompt ?? '';

  return (
    <main className='h-screen'>
      <AgentChat locale='en' initialPrompt={initialPrompt} />
    </main>
  );
}
