/*
  # Add position field to todos table

  1. Changes
    - Add `position` column to `todos` table to store the order of todos
    - Default value is set to 0
    - Update existing todos to have sequential positions

  2. Purpose
    - Enable drag and drop reordering of todos
    - Maintain consistent order across sessions
*/

-- Add position column to todos table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'todos' AND column_name = 'position'
  ) THEN
    ALTER TABLE todos ADD COLUMN position integer DEFAULT 0;
  END IF;
END $$;

-- Update existing todos to have sequential positions
-- This assigns positions based on created_at timestamp
DO $$
DECLARE
  todo_record RECORD;
  position_counter INTEGER := 0;
BEGIN
  FOR todo_record IN 
    SELECT id FROM todos ORDER BY created_at ASC
  LOOP
    UPDATE todos SET position = position_counter WHERE id = todo_record.id;
    position_counter := position_counter + 1;
  END LOOP;
END $$;