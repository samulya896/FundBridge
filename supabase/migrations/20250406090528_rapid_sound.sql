/*
  # Add Default Admin User
  
  1. Changes
    - Add initial admin user credentials
    - Set up admin authentication
*/

-- Create admin user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'fd3d4c8e-9f3d-4b8c-8f9d-6f8e7f6e5d4c',
  'authenticated',
  'authenticated',
  'admin@fundbridge.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Add admin user profile
INSERT INTO public.users (
  id,
  email,
  role,
  created_at,
  updated_at
)
VALUES (
  'fd3d4c8e-9f3d-4b8c-8f9d-6f8e7f6e5d4c',
  'admin@fundbridge.com',
  'admin',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;