'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

interface AgentChatContextValue {
  isOpen: boolean;
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
  pendingMessage: string | null;
  clearPendingMessage: () => void;
}

const AgentChatContext = createContext<AgentChatContextValue | null>(null);

export function AgentChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const pendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openChat = useCallback((initialMessage?: string) => {
    setIsOpen(true);
    if (initialMessage?.trim()) {
      // Defer so AgentChat has time to mount/open
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = setTimeout(() => {
        setPendingMessage(initialMessage.trim());
      }, 300);
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setPendingMessage(null);
  }, []);

  const clearPendingMessage = useCallback(() => {
    setPendingMessage(null);
  }, []);

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
    };
  }, []);

  return (
    <AgentChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        pendingMessage,
        clearPendingMessage,
      }}
    >
      {children}
    </AgentChatContext.Provider>
  );
}

export function useAgentChat() {
  const ctx = useContext(AgentChatContext);
  if (!ctx) {
    throw new Error('useAgentChat must be used within AgentChatProvider');
  }
  return ctx;
}
