/*
  # Initial Schema Setup for FundBridge

  1. New Tables
    - `users`
      - Stores user profiles for both startups and investors
      - Contains role information and basic user data
    
    - `startup_profiles`
      - Stores detailed information about startups
      - Contains all submission form data
      - Links to user accounts
    
    - `evaluations`
      - Stores AI-generated evaluation results
      - Contains detailed metrics and insights
      - Links to startup profiles

  2. Security
    - Enable RLS on all tables
    - Add policies for proper data access control
    - Ensure users can only access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('startup', 'investor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create startup profiles table
CREATE TABLE IF NOT EXISTS startup_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  company_name text NOT NULL,
  industry text NOT NULL,
  founding_date date NOT NULL,
  business_model text NOT NULL,
  funding_needed numeric NOT NULL,
  equity_offered numeric NOT NULL,
  team_size integer NOT NULL,
  team_experience text NOT NULL,
  current_revenue numeric NOT NULL,
  traction_metrics text NOT NULL,
  market_size numeric NOT NULL,
  competition_analysis text NOT NULL,
  pitch_deck_url text,
  financials_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES startup_profiles(id) NOT NULL,
  overall_score numeric NOT NULL,
  metrics jsonb NOT NULL,
  insights jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for startup profiles
CREATE POLICY "Startups can manage own profiles"
  ON startup_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Investors can view all startup profiles"
  ON startup_profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'investor'
  ));

-- RLS Policies for evaluations
CREATE POLICY "Startups can view own evaluations"
  ON evaluations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM startup_profiles
    WHERE startup_profiles.id = evaluations.startup_id
    AND startup_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Investors can view all evaluations"
  ON evaluations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'investor'
  ));