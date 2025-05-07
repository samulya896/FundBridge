import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

interface StartupData {
  company_name: string;
  industry: string;
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
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { startup_id } = await req.json();

    // Fetch startup data
    const { data: startupData, error: startupError } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('id', startup_id)
      .single();

    if (startupError) throw startupError;

    // AI evaluation logic
    const evaluation = await evaluateStartup(startupData);

    // Store evaluation results
    const { error: evalError } = await supabase
      .from('evaluations')
      .insert([
        {
          startup_id,
          overall_score: evaluation.overall_score,
          metrics: evaluation.metrics,
          insights: evaluation.insights,
        },
      ]);

    if (evalError) throw evalError;

    return new Response(
      JSON.stringify(evaluation),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

async function evaluateStartup(data: StartupData) {
  // Market size evaluation (0-100)
  const marketScore = evaluateMarketSize(data.market_size);
  
  // Team evaluation (0-100)
  const teamScore = evaluateTeam(data.team_size, data.team_experience);
  
  // Financial evaluation (0-100)
  const financialScore = evaluateFinancials(data.funding_needed, data.equity_offered, data.current_revenue);
  
  // Business model evaluation (0-100)
  const businessScore = evaluateBusinessModel(data.business_model, data.competition_analysis);
  
  // Traction evaluation (0-100)
  const tractionScore = evaluateTraction(data.traction_metrics);

  // Calculate overall score
  const overall_score = calculateOverallScore([
    marketScore,
    teamScore,
    financialScore,
    businessScore,
    tractionScore,
  ]);

  // Generate insights
  const insights = generateInsights(data, {
    marketScore,
    teamScore,
    financialScore,
    businessScore,
    tractionScore,
  });

  return {
    overall_score,
    metrics: {
      market_potential: marketScore,
      team_capability: teamScore,
      financial_health: financialScore,
      business_model: businessScore,
      traction: tractionScore,
    },
    insights,
  };
}

function evaluateMarketSize(marketSize: number) {
  // Basic market size evaluation
  if (marketSize >= 1000000000) return 90; // Billion+ market
  if (marketSize >= 100000000) return 75; // 100M+ market
  if (marketSize >= 10000000) return 60; // 10M+ market
  return 40; // Small market
}

function evaluateTeam(teamSize: number, experience: string) {
  let score = 0;
  
  // Team size evaluation
  if (teamSize >= 10) score += 25;
  else if (teamSize >= 5) score += 20;
  else if (teamSize >= 2) score += 15;
  else score += 10;

  // Experience evaluation (basic keyword matching)
  const experienceText = experience.toLowerCase();
  const keywords = ['years', 'experience', 'founded', 'exit', 'success', 'industry'];
  const keywordScore = keywords.reduce((acc, keyword) => 
    acc + (experienceText.includes(keyword) ? 12.5 : 0), 0);

  return Math.min(100, score + keywordScore);
}

function evaluateFinancials(fundingNeeded: number, equityOffered: number, revenue: number) {
  let score = 0;
  
  // Revenue evaluation
  if (revenue > 1000000) score += 40;
  else if (revenue > 100000) score += 30;
  else if (revenue > 10000) score += 20;
  else score += 10;

  // Funding efficiency
  const valuationImplied = (fundingNeeded / equityOffered) * 100;
  if (valuationImplied / revenue < 10) score += 30;
  else if (valuationImplied / revenue < 20) score += 20;
  else score += 10;

  // Equity offered evaluation
  if (equityOffered <= 15) score += 30;
  else if (equityOffered <= 25) score += 20;
  else score += 10;

  return Math.min(100, score);
}

function evaluateBusinessModel(model: string, competition: string) {
  let score = 0;
  const text = (model + ' ' + competition).toLowerCase();

  // Positive indicators
  const positiveKeywords = [
    'recurring revenue', 'subscription', 'saas', 'patent', 'proprietary',
    'competitive advantage', 'barrier to entry', 'network effect', 'scalable'
  ];
  
  score += positiveKeywords.reduce((acc, keyword) => 
    acc + (text.includes(keyword) ? 10 : 0), 0);

  // Negative indicators
  const negativeKeywords = [
    'unproven', 'risky', 'uncertain', 'competitive market', 'no advantage'
  ];
  
  score -= negativeKeywords.reduce((acc, keyword) => 
    acc + (text.includes(keyword) ? 10 : 0), 0);

  return Math.max(0, Math.min(100, score + 50)); // Baseline of 50
}

function evaluateTraction(metrics: string) {
  const text = metrics.toLowerCase();
  let score = 50; // Base score

  // Positive growth indicators
  const growthIndicators = [
    'growing', 'growth', 'increase', 'expanding',
    'users', 'customers', 'revenue', 'sales'
  ];

  score += growthIndicators.reduce((acc, indicator) => 
    acc + (text.includes(indicator) ? 6.25 : 0), 0);

  return Math.min(100, score);
}

function calculateOverallScore(scores: number[]) {
  const weights = [0.25, 0.20, 0.20, 0.20, 0.15];
  return Math.round(
    scores.reduce((acc, score, i) => acc + score * weights[i], 0)
  );
}

function generateInsights(data: StartupData, scores: {
  marketScore: number,
  teamScore: number,
  financialScore: number,
  businessScore: number,
  tractionScore: number,
}) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Market insights
  if (scores.marketScore >= 75) {
    strengths.push('Large and attractive market opportunity');
  } else {
    weaknesses.push('Limited market size potential');
    recommendations.push('Consider expanding to adjacent markets to increase total addressable market');
  }

  // Team insights
  if (scores.teamScore >= 75) {
    strengths.push('Strong and experienced team composition');
  } else {
    weaknesses.push('Team might need additional expertise or members');
    recommendations.push('Consider adding advisory board members or key hires in weak areas');
  }

  // Financial insights
  if (scores.financialScore >= 75) {
    strengths.push('Solid financial metrics and funding strategy');
  } else {
    weaknesses.push('Financial projections or funding structure needs improvement');
    recommendations.push('Review funding requirements and equity offering structure');
  }

  // Business model insights
  if (scores.businessScore >= 75) {
    strengths.push('Strong business model with clear competitive advantages');
  } else {
    weaknesses.push('Business model needs further validation');
    recommendations.push('Focus on developing and articulating unique value propositions');
  }

  // Traction insights
  if (scores.tractionScore >= 75) {
    strengths.push('Impressive traction and growth metrics');
  } else {
    weaknesses.push('Limited traction or growth indicators');
    recommendations.push('Develop clear metrics and milestones for growth tracking');
  }

  return {
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
  };
}