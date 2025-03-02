import { Router } from 'express';
import TodoController from '../controllers/todoController';

const router = Router();
const todoController = new TodoController();

// Route to add a new todo
router.post('/todos', todoController.addTodo);

// Route to edit an existing todo
router.put('/todos/:id', todoController.editTodo);

// Route to delete a todo
router.delete('/todos/:id', todoController.deleteTodo);

// Route to update a todo
router.patch('/todos/:id', todoController.updateTodo);

export default router;