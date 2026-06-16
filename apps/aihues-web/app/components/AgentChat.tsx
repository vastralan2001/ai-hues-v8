'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ToolIcon } from './ToolIcon';
import type { AgentMessage, RecommendedTool } from '@/lib/agent/types';

interface AgentChatProps {
  locale?: string;
  initialPrompt?: string;
}

const EXAMPLE_PROMPTS = [
  'Launch my remote team SaaS on Product Hunt',
  'Write a Meta ad campaign for a language learning app',
  'Create ASO copy for my meditation app',
];

export default function AgentChat({
  locale = 'en',
  initialPrompt = '',
}: AgentChatProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [suggestedTools, setSuggestedTools] = useState<RecommendedTool[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AgentMessage = {
      role: 'user',
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, locale }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            content: `Error: ${data.error}`,
            metadata: { type: 'error' },
          },
        ]);
        setSuggestedTools([]);
      } else if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setSuggestedTools(data.suggestedTools ?? []);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: err instanceof Error ? err.message : 'Network error',
          metadata: { type: 'error' },
        },
      ]);
      setSuggestedTools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const lastAgentIndex = messages.reduce<number>(
    (idx, msg, i) => (msg.role === 'agent' ? i : idx),
    -1
  );

  return (
    <div className='flex h-[calc(100vh-68px)] flex-col bg-bg'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto px-4 py-6 md:px-8'>
        <div className='mx-auto max-w-[800px]'>
          {messages.length === 0 && (
            <div className='mt-12 text-center'>
              <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-bg text-accent'>
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                </svg>
              </div>
              <h2 className='mb-2 text-[22px] font-bold text-foreground'>
                What are you launching today?
              </h2>
              <p className='mb-8 text-secondary'>
                Describe your product and goal, and I&apos;ll plan a campaign
                with the right tools.
              </p>
              <div className='flex flex-wrap justify-center gap-2.5'>
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type='button'
                    onClick={() => sendMessage(prompt)}
                    className='rounded-full border border-border bg-surface px-4 py-2 text-[13px] text-secondary transition-all hover:border-accent hover:text-accent'
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index}>
              <MessageBubble message={msg} />
              {index === lastAgentIndex && suggestedTools.length > 0 && (
                <div className='mb-6 ml-11 grid gap-2'>
                  {suggestedTools.map((tool) => (
                    <ToolRecommendationCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className='mb-6 flex items-start gap-3'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-bg text-accent'>
                <span className='text-[12px] font-bold'>AI</span>
              </div>
              <div className='rounded-[16px] bg-surface px-4 py-3 text-foreground'>
                <span className='inline-flex gap-1'>
                  <span className='h-2 w-2 animate-bounce rounded-full bg-muted' />
                  <span className='h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0.2s]' />
                  <span className='h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0.4s]' />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className='border-t border-border bg-bg px-4 py-4 md:px-8'>
        <form
          onSubmit={handleSubmit}
          className='mx-auto flex max-w-[800px] items-end gap-2 rounded-[16px] border border-border bg-surface p-2 shadow-sm'
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder='Launch my remote team SaaS on Product Hunt...'
            rows={1}
            className='max-h-[160px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-foreground outline-none placeholder:text-muted'
          />
          <button
            type='submit'
            disabled={!input.trim() || loading}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-accent text-white transition-colors hover:bg-accent-light disabled:opacity-40'
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M22 2L11 13' />
              <path d='M22 2l-7 20-4-9-9-4 20-7z' />
            </svg>
          </button>
        </form>
        <p className='mx-auto mt-2 max-w-[800px] text-center text-[12px] text-muted'>
          AIHues Agent may produce inaccurate results. Verify before publishing.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: AgentMessage }) {
  const isUser = message.role === 'user';
  const meta = message.metadata;

  return (
    <div
      className={`mb-6 flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-bg text-accent'>
          <span className='text-[12px] font-bold'>AI</span>
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-[16px] px-4 py-3 text-[15px] leading-relaxed ${
          isUser ? 'bg-accent text-white' : 'bg-surface text-foreground'
        }`}
      >
        <div className='whitespace-pre-wrap'>{message.content}</div>

        {meta?.toolCall && (
          <div className='mt-3 rounded-[10px] border border-border bg-bg p-3'>
            <div className='mb-1 text-[12px] font-semibold text-secondary'>
              Generated with {meta.toolCall.tool}
            </div>
            <div className='whitespace-pre-wrap text-[14px] text-foreground'>
              {meta.toolCall.result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolRecommendationCard({ tool }: { tool: RecommendedTool }) {
  return (
    <Link
      href={tool.url}
      className='flex items-center gap-3 rounded-[12px] border border-border bg-bg p-3 transition-colors hover:border-accent'
    >
      <span className='flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent-bg text-accent'>
        <ToolIcon slug={tool.icon || tool.slug} size={18} />
      </span>
      <div className='flex-1'>
        <div className='text-[14px] font-semibold text-foreground'>
          {tool.name}
        </div>
        <div className='text-[12px] text-secondary'>{tool.description}</div>
      </div>
      <span className='text-[12px] text-accent'>Open →</span>
    </Link>
  );
}
