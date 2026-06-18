'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { Bot, X, Send, Sparkles, Wrench, Loader2 } from 'lucide-react';

import { useI18n } from '@/lib/i18n';
import type { AgentMessage } from '@/lib/agent/types';

interface AgentChatContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  openWithMessage: (text: string) => void;
}

const AgentChatContext = createContext<AgentChatContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
  openWithMessage: () => {},
});

export function useAgentChat() {
  return useContext(AgentChatContext);
}

export function AgentChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  const openWithMessage = useCallback((text: string) => {
    setPendingMessage(text);
    setOpen(true);
  }, []);

  return (
    <AgentChatContext.Provider
      value={{ open, setOpen, toggle, openWithMessage }}
    >
      {children}
      <AgentChatDialog pendingMessage={pendingMessage} />
    </AgentChatContext.Provider>
  );
}

function AgentChatDialog({
  pendingMessage,
}: {
  pendingMessage: string | null;
}) {
  const { open, setOpen } = useAgentChat();
  const { locale, t } = useI18n();
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: 'agent',
      content:
        locale === 'zh'
          ? '你好，我是 HuesBot。你可以问我关于 AIHues 工具的问题，或者直接让我帮你生成文案、推荐工具。'
          : "Hi, I'm HuesBot. Ask me about AIHues tools, or let me generate copy and recommend tools for you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentPendingRef = useRef(false);

  const submitMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMessage: AgentMessage = { role: 'user', content: text };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextMessages,
            locale,
            enableLlm: true,
          }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.message) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'agent',
              content:
                locale === 'zh'
                  ? '抱歉，服务暂时不可用，请稍后再试。'
                  : 'Sorry, the service is temporarily unavailable. Please try again later.',
              metadata: { type: 'error' },
            },
          ]);
        } else {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            content:
              locale === 'zh'
                ? '网络出错，请检查连接后重试。'
                : 'Network error. Please check your connection and try again.',
            metadata: { type: 'error' },
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, locale]
  );

  useEffect(() => {
    if (open && pendingMessage && !sentPendingRef.current) {
      sentPendingRef.current = true;
      submitMessage(pendingMessage);
    }
    if (!open) {
      sentPendingRef.current = false;
    }
  }, [open, pendingMessage, submitMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = () => submitMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className='fixed bottom-6 right-6 z-[150] flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
        aria-label={t('agent.open')}
      >
        <Sparkles className='h-5 w-5' />
      </button>
    );
  }

  return (
    <div className='fixed bottom-6 right-6 z-[150] flex w-[92vw] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-border bg-foreground px-4 py-3'>
        <div className='flex items-center gap-2 text-white'>
          <Bot className='h-5 w-5' />
          <span className='font-semibold'>{t('agent.title')}</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className='rounded p-1 text-white/80 hover:bg-white/10'
          aria-label={t('agent.close')}
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className='flex max-h-[60vh] min-h-[320px] flex-col gap-4 overflow-y-auto p-4'
      >
        {messages.map((m, idx) => (
          <MessageBubble key={idx} message={m} locale={locale} />
        ))}
        {loading && (
          <div className='flex items-center gap-2 self-start rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted'>
            <Loader2 className='h-4 w-4 animate-spin' />
            {locale === 'zh' ? '思考中…' : 'Thinking…'}
          </div>
        )}
      </div>

      {/* Input */}
      <div className='flex items-center gap-2 border-t border-border p-3'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('agent.placeholder')}
          className='flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className='flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-white transition-opacity hover:opacity-90 disabled:opacity-40'
          aria-label={t('agent.send')}
        >
          <Send className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}

function renderMarkdownLike(content: string): React.ReactNode {
  // Very small, safe renderer for LLM output: bold + markdown links.
  const parts: React.ReactNode[] = [];
  let key = 0;

  const tokens: Array<{
    type: 'text' | 'bold' | 'link';
    value: string;
    href?: string;
  }> = [];
  let lastIndex = 0;
  const combinedRegex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        value: content.slice(lastIndex, match.index),
      });
    }
    const token = match[0];
    if (token.startsWith('**')) {
      tokens.push({ type: 'bold', value: token.slice(2, -2) });
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        tokens.push({ type: 'link', value: linkMatch[1], href: linkMatch[2] });
      } else {
        tokens.push({ type: 'text', value: token });
      }
    }
    lastIndex = combinedRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    tokens.push({ type: 'text', value: content.slice(lastIndex) });
  }

  for (const token of tokens) {
    if (token.type === 'text') {
      parts.push(<span key={key++}>{token.value}</span>);
    } else if (token.type === 'bold') {
      parts.push(<strong key={key++}>{token.value}</strong>);
    } else if (token.type === 'link' && token.href) {
      parts.push(
        <Link
          key={key++}
          href={token.href}
          className='text-accent underline underline-offset-2 hover:opacity-80'
        >
          {token.value}
        </Link>
      );
    }
  }

  return parts;
}

function MessageBubble({
  message,
  locale,
}: {
  message: AgentMessage;
  locale: string;
}) {
  const isUser = message.role === 'user';
  const metadata = message.metadata;
  const tools = metadata?.tools ?? [];

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-foreground text-white'
            : 'border border-border bg-white text-foreground'
        }`}
      >
        <div className='whitespace-pre-wrap'>
          {renderMarkdownLike(message.content)}
        </div>

        {metadata?.toolCall && (
          <div className='mt-3 rounded-lg bg-muted/50 p-2 text-xs'>
            <div className='mb-1 flex items-center gap-1 font-medium text-muted'>
              <Wrench className='h-3 w-3' />
              {locale === 'zh' ? '已调用工具' : 'Tool result'}
            </div>
            <div className='line-clamp-6 whitespace-pre-wrap font-mono text-foreground'>
              {metadata.toolCall.result}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div className='mt-3 grid gap-2'>
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.url}
                className='block rounded-lg border border-border bg-surface p-2 transition-colors hover:border-accent hover:bg-accent/5'
              >
                <div className='font-medium text-foreground'>{tool.name}</div>
                <div className='line-clamp-2 text-xs text-muted'>
                  {tool.description}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
