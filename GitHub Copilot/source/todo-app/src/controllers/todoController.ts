export class TodoController {
    private todoService: any; // Replace with actual TodoService type

    constructor(todoService: any) { // Replace with actual TodoService type
        this.todoService = todoService;
    }

    public async addTodo(req: any, res: any): Promise<void> {
        try {
            const todoData = req.body;
            const newTodo = await this.todoService.createTodo(todoData);
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async editTodo(req: any, res: any): Promise<void> {
        try {
            const todoId = req.params.id;
            const updatedData = req.body;
            const updatedTodo = await this.todoService.updateTodo(todoId, updatedData);
            res.status(200).json(updatedTodo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async deleteTodo(req: any, res: any): Promise<void> {
        try {
            const todoId = req.params.id;
            await this.todoService.deleteTodo(todoId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    public async updateTodo(req: any, res: any): Promise<void> {
        try {
            const todoId = req.params.id;
            const updatedData = req.body;
            const updatedTodo = await this.todoService.updateTodo(todoId, updatedData);
            res.status(200).json(updatedTodo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}