export interface FormState {
  originalUrl: string
  customCode: string
  userIntent: string
  useCustomAlias: boolean
}

export interface CreateLinkPayload {
  originalUrl: string
  customCode?: string
  userIntent?: string
}

export interface CreateLinkResponse {
  id: string
  shortUrl: string
  message?: string
}

export interface AgentResult {
  /** Categorization tags for the link */
  tags: string[];
  
  /** Risk assessment score (0-1, where 0 is lowest risk) */
  risk_score: number;
  
  /** AI-suggested human-readable alias for the link */
  suggested_alias: string;
  
  /** Explanation of how the alias was generated */
  reasoning: string;
};

export type AgentStatus =
  | "idle"
  | "no-agent"
  | "pending"
  | "running"
  | "completed"
  | "failed"