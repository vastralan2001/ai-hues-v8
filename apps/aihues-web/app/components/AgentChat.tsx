'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  Wrench,
  ExternalLink,
  ChevronRight,
  User,
  Zap,
  ZapOff,
} from 'lucide-react';
import { useAgentChat } from './AgentChatContext';
import type { AgentMessage, RecommendedTool } from '@/lib/agent/types';

interface AgentChatProps {
  locale?: string;
}

/* ── Simple markdown-like renderer ── */
function formatContent(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className='my-2 ml-4 list-disc space-y-1 text-[13px]'
        >
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCode = () => {
    if (codeLines.length) {
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className='my-2 overflow-x-auto rounded-lg bg-[#f6f8fa] p-3 text-[12px] text-[#24292f]'
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      codeLines = [];
      inCode = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block start/end
    if (line.startsWith('```')) {
      if (!inCode) {
        flushList();
        inCode = true;
      } else {
        flushCode();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // Inline code
    const inlineCode = line.split('`');
    if (inlineCode.length > 1) {
      const parts: React.ReactNode[] = [];
      inlineCode.forEach((part, idx) => {
        if (idx % 2 === 1) {
          parts.push(
            <code
              key={idx}
              className='rounded bg-[#f6f8fa] px-1 py-0.5 text-[12px] text-[#24292f]'
            >
              {part}
            </code>
          );
        } else {
          parts.push(part);
        }
      });
      flushList();
      elements.push(
        <p
          key={`p-${elements.length}`}
          className='my-1 text-[13px] leading-relaxed'
        >
          {parts}
        </p>
      );
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const sizeClass =
        level === 1
          ? 'text-[15px]'
          : level === 2
            ? 'text-[14px]'
            : 'text-[13px]';
      const headingClass = `${sizeClass} my-2 font-semibold text-foreground`;
      const key = `h-${elements.length}`;
      const headingContent = headerMatch[2];
      if (level === 1) {
        elements.push(
          <h1 key={key} className={headingClass}>
            {headingContent}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={key} className={headingClass}>
            {headingContent}
          </h2>
        );
      } else {
        elements.push(
          <h3 key={key} className={headingClass}>
            {headingContent}
          </h3>
        );
      }
      continue;
    }

    // List items
    const listMatch = line.match(/^[\s]*[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) inList = true;
      listItems.push(
        <li
          key={`li-${listItems.length}`}
          className='text-[13px] leading-relaxed'
        >
          {listMatch[1]
            .replace(/\*\*(.*?)\*\*/g, (_, m) => `**${m}**`)
            .split('**')
            .map((part, idx) =>
              idx % 2 === 1 ? (
                <strong key={idx} className='font-semibold'>
                  {part}
                </strong>
              ) : (
                part
              )
            )}
        </li>
      );
      continue;
    }

    // Bold text in regular lines
    flushList();
    if (line.trim()) {
      elements.push(
        <p
          key={`p-${elements.length}`}
          className='my-1 text-[13px] leading-relaxed'
        >
          {line.split('**').map((part, idx) =>
            idx % 2 === 1 ? (
              <strong key={idx} className='font-semibold'>
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    } else {
      elements.push(<div key={`sp-${elements.length}`} className='h-2' />);
    }
  }

  flushList();
  flushCode();
  return elements;
}

/* ── Tool Recommendation Card ── */
function ToolCard({ tool }: { tool: RecommendedTool }) {
  return (
    <a
      href={tool.url}
      target={tool.url.startsWith('http') ? '_blank' : undefined}
      rel={tool.url.startsWith('http') ? 'noopener noreferrer' : undefined}
      className='flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-all hover:border-accent hover:shadow-sm'
    >
      <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-bg text-lg'>
        {tool.icon}
      </span>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-1.5'>
          <span className='text-[13px] font-semibold text-foreground'>
            {tool.name}
          </span>
          {tool.url.startsWith('http') && (
            <ExternalLink size={12} className='text-muted' />
          )}
        </div>
        <p className='truncate text-[12px] text-secondary'>
          {tool.description}
        </p>
      </div>
      <ChevronRight size={16} className='shrink-0 text-muted' />
    </a>
  );
}

/* ── Main Agent Chat Component ── */
export default function AgentChat({ locale = 'en' }: AgentChatProps) {
  const { isOpen, openChat, closeChat, pendingMessage, clearPendingMessage } =
    useAgentChat();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasWelcomedRef = useRef(false);
  const pendingSentRef = useRef(false);

  const isZh = locale === 'zh';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // When opened, ensure welcome message + auto-send pending message
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);

      // Show welcome if first open
      if (!hasWelcomedRef.current) {
        hasWelcomedRef.current = true;
        setMessages([
          {
            role: 'agent',
            content: isZh
              ? `👋 你好！我是 **HuesBot**，AIHues 的智能助手。\n\n我可以帮你：\n- 推荐合适的工具\n- 直接生成内容（SEO标题、博客大纲、推文等）\n- 回答关于 AIHues 的问题\n\n试试说 "帮我生成 5 个 SEO 标题" 或 "推荐一个 JSON 格式化工具"\n\n${aiMode ? '⚡ AI 模式已开启 — 回复由大模型生成' : '🔒 AI 模式已关闭 — 使用规则匹配回复，省 token'}`
              : `👋 Hi! I'm **HuesBot**, your AIHues assistant.\n\nI can help you:\n- Recommend the right tools\n- Generate content directly (SEO titles, blog outlines, posts, etc.)\n- Answer questions about AIHues\n\nTry saying "help me write SEO titles" or "recommend a JSON formatter"\n\n${aiMode ? '⚡ AI Mode ON — responses powered by LLM' : '🔒 AI Mode OFF — using rule-based responses to save tokens'}`,
            metadata: { type: 'text' },
          },
        ]);
      }

      // Auto-send pending message after welcome
      if (pendingMessage && !pendingSentRef.current) {
        pendingSentRef.current = true;
        const text = pendingMessage;
        clearPendingMessage();
        setTimeout(() => {
          setMessages((prev) => {
            const userMsg: AgentMessage = { role: 'user', content: text };
            const nextMessages = [...prev, userMsg];
            setIsLoading(true);
            fetch('/api/agent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: nextMessages,
                locale,
                enableLlm: aiMode,
              }),
            })
              .then((res) => (res.ok ? res.json() : Promise.reject()))
              .then((data) => {
                const agentMsg: AgentMessage = data.message || {
                  role: 'agent',
                  content: isZh
                    ? '抱歉，服务暂时不可用。'
                    : 'Sorry, the service is temporarily unavailable.',
                };
                setMessages((p) => [...p, agentMsg]);
              })
              .catch(() => {
                setMessages((p) => [
                  ...p,
                  {
                    role: 'agent',
                    content: isZh
                      ? '连接失败，请稍后再试。'
                      : 'Connection failed. Please try again later.',
                    metadata: { type: 'error' },
                  },
                ]);
              })
              .finally(() => setIsLoading(false));
            return nextMessages;
          });
          pendingSentRef.current = false;
        }, 600);
      }
    } else {
      hasWelcomedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingMessage]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: AgentMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          locale,
          enableLlm: aiMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const agentMsg: AgentMessage = data.message || {
        role: 'agent',
        content: isZh
          ? '抱歉，服务暂时不可用。'
          : 'Sorry, the service is temporarily unavailable.',
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: isZh
            ? '连接失败，请稍后再试。'
            : 'Connection failed. Please try again later.',
          metadata: { type: 'error' },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => openChat()}
          className='fixed bottom-6 right-6 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-all hover:scale-105 hover:shadow-xl active:scale-95'
          aria-label='Open AI assistant'
        >
          <Bot size={26} strokeWidth={2} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-6 right-6 z-[200] flex h-[560px] w-[380px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-black/10'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-border bg-accent px-4 py-3'>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20'>
                <Sparkles size={16} className='text-white' />
              </div>
              <div>
                <div className='text-[14px] font-semibold text-white'>
                  HuesBot
                </div>
                <div className='text-[11px] text-white/70'>
                  {isZh ? 'AIHues 智能助手' : 'AIHues Assistant'}
                </div>
              </div>
            </div>
            {/* AI Mode Toggle */}
            <button
              onClick={() => setAiMode((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                aiMode ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'
              }`}
              title={
                aiMode
                  ? 'AI Mode ON — click to save tokens'
                  : 'AI Mode OFF — click for smarter responses'
              }
            >
              {aiMode ? <Zap size={12} /> : <ZapOff size={12} />}
              {aiMode ? (isZh ? 'AI 开' : 'ON') : isZh ? 'AI 关' : 'OFF'}
            </button>
            <button
              onClick={closeChat}
              className='flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white'
              aria-label='Close'
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-4 py-4'>
            <div className='space-y-4'>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user'
                        ? 'bg-secondary text-white'
                        : 'bg-accent-bg text-accent'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} strokeWidth={2.5} />
                    ) : (
                      <Bot size={14} strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-accent text-white'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <div
                      className={`text-[13px] leading-relaxed ${
                        msg.role === 'user' ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {formatContent(msg.content)}
                    </div>

                    {/* Tool recommendations */}
                    {msg.metadata?.type === 'tools' &&
                      msg.metadata.tools &&
                      msg.metadata.tools.length > 0 && (
                        <div className='mt-3 space-y-2'>
                          <div className='flex items-center gap-1.5 text-[11px] font-medium text-secondary'>
                            <Wrench size={12} />
                            {isZh ? '推荐工具' : 'Recommended Tools'}
                          </div>
                          {msg.metadata.tools.map((tool) => (
                            <ToolCard key={tool.slug} tool={tool} />
                          ))}
                        </div>
                      )}

                    {/* Tool result badge */}
                    {msg.metadata?.type === 'tool_result' && (
                      <div className='mt-2 flex items-center gap-1.5 rounded-lg bg-accent-bg px-2.5 py-1.5 text-[11px] text-accent'>
                        <Sparkles size={12} />
                        {isZh ? 'AI 生成内容' : 'AI Generated'}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className='flex gap-2.5'>
                  <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-bg text-accent'>
                    <Bot size={14} strokeWidth={2.5} />
                  </div>
                  <div className='flex items-center gap-1 rounded-2xl bg-surface border border-border px-4 py-2.5'>
                    <Loader2 size={14} className='animate-spin text-accent' />
                    <span className='text-[12px] text-secondary'>
                      {isZh ? '思考中...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className='border-t border-border p-3'>
            <div className='flex items-end gap-2 rounded-xl border border-border bg-surface p-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20'>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isZh
                    ? '描述你的需求，或直接说 "帮我写 SEO 标题"...'
                    : 'Describe what you need, or say "help me write SEO titles"...'
                }
                rows={1}
                className='max-h-24 min-h-[36px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted'
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-all hover:bg-accent/90 disabled:opacity-40 disabled:hover:bg-accent'
                aria-label='Send'
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </div>
            <div className='mt-1.5 text-center text-[10px] text-muted'>
              {isZh
                ? 'HuesBot 可能产生不准确的信息，请核实重要内容。'
                : 'HuesBot may produce inaccurate info. Verify important content.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
