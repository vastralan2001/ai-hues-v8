/* ── AIHues Agent Types ── */

export interface AgentMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: AgentMessageMetadata;
}

export interface AgentMessageMetadata {
  type: 'text' | 'tools' | 'tool_result' | 'error';
  tools?: RecommendedTool[];
  toolCall?: ToolCallPayload;
}

export interface RecommendedTool {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
}

export interface ToolCallPayload {
  tool: string;
  inputs: Record<string, string>;
  result?: string;
}

export interface AgentRequest {
  messages: AgentMessage[];
  locale?: string;
}

export interface AgentResponse {
  message: AgentMessage;
  suggestedTools?: RecommendedTool[];
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}
