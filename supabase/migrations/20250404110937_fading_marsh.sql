/*
  # Add Admin Role Support

  1. Changes
    - Update users table role check to include 'admin' role
    - Add admin-specific policies
    - Add initial admin user

  2. Security
    - Add policies for admin access
    - Ensure admins can access all data
*/

-- Update the role check constraint
ALTER TABLE users DROP CONSTRAINT users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('startup', 'investor', 'admin'));

-- Add admin policies for users table
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can modify all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Add admin policies for startup_profiles table
CREATE POLICY "Admins can manage all startup profiles"
  ON startup_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Add admin policies for evaluations table
CREATE POLICY "Admins can manage all evaluations"
  ON evaluations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );