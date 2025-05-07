export type UserRole = 'startup' | 'investor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface StartupProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry: Industry;
  founding_date: string;
  business_model: string;
  funding_needed: number;
  equity_offered: number;
  team_size: number;
  team_experience: string;
  current_revenue: number;
  traction_metrics: string;
  market_size: number;
  competition_analysis: string;
  pitch_deck_url?: string;
  financials_url?: string;
  created_at: string;
  evaluation_score?: number;
}

export interface EvaluationResult {
  overall_score: number;
  metrics: {
    uniqueness: number;
    demand_scalability: number;
    equity_ownership: number;
    equity_required: number;
    risk_factors: number;
    team_experience: number;
    revenue_traction: number;
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export type Industry = 
  | "Technology"
  | "Healthcare"
  | "Finance"
  | "Education"
  | "Energy"
  | "Real Estate"
  | "Consumer Goods"
  | "Other";

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface StartupSubmissionForm {
  company_name: string;
  industry: Industry;
  founding_date: string;
  business_model: string;
  funding_needed: number;
  equity_offered: number;
  team_size: number;
  team_experience: string;
  current_revenue: number;
  traction_metrics: string;
  market_size: number;
  competition_analysis: string;
  pitch_deck?: File;
  financial_projections?: File;
}

export interface AdminStats {
  totalUsers: number;
  totalStartups: number;
  totalInvestors: number;
  totalEvaluations: number;
}