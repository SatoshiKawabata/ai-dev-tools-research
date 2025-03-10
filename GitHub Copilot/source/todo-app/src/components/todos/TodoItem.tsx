import React from 'react';

interface TodoItemProps {
    id: string;
    title: string;
    completed: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, onEdit, onDelete }) => {
    return (
        <div className="todo-item">
            <input
                type="checkbox"
                checked={completed}
                readOnly
            />
            <span className={completed ? 'completed' : ''}>{title}</span>
            <button onClick={() => onEdit(id)}>Edit</button>
            <button onClick={() => onDelete(id)}>Delete</button>
        </div>
    );
};

export default TodoItem;