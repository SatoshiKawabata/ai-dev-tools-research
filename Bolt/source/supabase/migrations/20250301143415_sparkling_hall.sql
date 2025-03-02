/*
  # Initial Schema Setup for Todo App

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `completed` (boolean)
      - `user_id` (uuid, foreign key to auth.users)
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp)
      - `username` (text)
      - `avatar_url` (text)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  completed boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  username text,
  avatar_url text
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for todos
CREATE POLICY "Users can create their own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for profiles
CREATE POLICY "Users can view any profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();