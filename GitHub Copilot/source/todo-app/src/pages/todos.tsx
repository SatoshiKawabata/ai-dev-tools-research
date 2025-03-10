import React from 'react';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';

const TodosPage: React.FC = () => {
    return (
        <div>
            <h1>Todo List</h1>
            <TodoForm />
            <TodoList />
        </div>
    );
};

export default TodosPage;