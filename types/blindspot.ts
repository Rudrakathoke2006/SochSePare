export type SeverityLevel = 'low' | 'medium' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface DecisionInput {
  decision: string;
  options: string[];
  factors: string[];
  reasoning: string;
  leaning: string;
  userApiKey?: string;
}

export interface KnownFactor {
  factor: string;
  source: 'explicit' | 'stated_priority';
  details?: string;
}

export interface HiddenAssumption {
  id: string;
  title: string;
  description: string;
  evidence_quote: string; // The specific phrase in user's reasoning that implies this
  why_it_matters: string;
  confidence: ConfidenceLevel;
  impact: SeverityLevel;
}

export interface OverlookedFactor {
  id: string;
  title: string;
  description: string;
  why_it_matters: string;
  impact_domain: string;
  confidence: ConfidenceLevel;
  impact: SeverityLevel;
}

export interface InternalConflict {
  id: string;
  title: string;
  description: string;
  stated_priority: string;
  competing_priority: string;
  tension_analysis: string;
  confidence: ConfidenceLevel;
  impact: SeverityLevel;
}

export interface MissingInformation {
  id: string;
  title: string;
  description: string;
  why_it_matters: string;
  importance: SeverityLevel;
  how_to_verify?: string;
}

export interface QuestionToConsider {
  id: string;
  question: string;
  purpose: string;
  category: 'falsification' | 'values' | 'reversibility' | 'second_order';
}

export interface ReasoningPattern {
  pattern: string;
  description: string;
  confidence: ConfidenceLevel;
}

export interface ReasoningVisibility {
  visible_percentage: number;
  overlooked_percentage: number;
  known_factors_count: number;
  blind_spots_count: number;
  primary_focal_point: string;
}

export interface GuardrailReport {
  verdict_given: false; // Must ALWAYS be strictly false
  guardrail_triggered: boolean;
  neutrality_statement: string;
}

export interface BlindSpotAnalysis {
  id: string;
  timestamp: number;
  decision_summary: string;
  current_leaning: string;
  reasoning_visibility: ReasoningVisibility;
  known_factors: KnownFactor[];
  unstated_assumptions: HiddenAssumption[];
  overlooked_factors: OverlookedFactor[];
  internal_conflicts: InternalConflict[];
  missing_information: MissingInformation[];
  questions_to_ask_yourself: QuestionToConsider[];
  what_would_change_your_mind: string[];
  reasoning_patterns: ReasoningPattern[];
  guardrail: GuardrailReport;
  verdict: null; // Guaranteed null
}

export interface FollowUpRequest {
  original_decision: string;
  original_reasoning: string;
  initial_analysis_summary: string;
  answers: {
    question_id: string;
    question_text: string;
    user_answer: string;
  }[];
  userApiKey?: string;
}

export interface FollowUpAnalysis {
  socratic_feedback: string;
  evolved_assumptions: {
    id: string;
    title: string;
    description: string;
    evidence_quote: string;
    why_it_matters: string;
    impact: SeverityLevel;
  }[];
  clarified_priorities: string[];
  new_probing_questions: string[];
  verdict: null;
  guardrail: {
    verdict_given: false;
    neutrality_statement: string;
  };
}
