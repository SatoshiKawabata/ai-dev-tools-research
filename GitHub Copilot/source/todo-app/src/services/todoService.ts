export class TodoService {
    private todos: any[] = []; // This will hold the todos in memory for now

    public addTodo(todo: any): void {
        this.todos.push(todo);
    }

    public editTodo(id: string, updatedTodo: any): void {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = { ...this.todos[index], ...updatedTodo };
        }
    }

    public deleteTodo(id: string): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }

    public updateTodo(id: string, updatedFields: any): void {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = { ...this.todos[index], ...updatedFields };
        }
    }

    public getTodos(): any[] {
        return this.todos;
    }
}