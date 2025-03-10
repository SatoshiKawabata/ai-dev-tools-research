import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const fetchTodos = async () => {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
};

export const createTodo = async (todoData) => {
    const response = await axios.post(`${API_URL}/todos`, todoData);
    return response.data;
};

export const updateTodo = async (id, todoData) => {
    const response = await axios.put(`${API_URL}/todos/${id}`, todoData);
    return response.data;
};

export const deleteTodo = async (id) => {
    const response = await axios.delete(`${API_URL}/todos/${id}`);
    return response.data;
};

export const reorderTodos = async (todos) => {
    const response = await axios.put(`${API_URL}/todos/reorder`, { todos });
    return response.data;
};