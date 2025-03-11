import React, { useState, useEffect } from 'react';

interface TodoFormProps {
  onSubmit: (todo: { id?: string; title: string; completed: boolean }) => void;
  existingTodo?: { id: string; title: string; completed: boolean };
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, existingTodo }) => {
  const [title, setTitle] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
      setCompleted(existingTodo.completed);
    }
  }, [existingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: existingTodo?.id, title, completed });
    setTitle('');
    setCompleted(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>
      <button type="submit">{existingTodo ? 'Update Todo' : 'Add Todo'}</button>
    </form>
  );
};

export default TodoForm;