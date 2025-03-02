export interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class TodoModel {
    private todos: Todo[] = [];

    public addTodo(todo: Todo): Todo {
        this.todos.push(todo);
        return todo;
    }

    public editTodo(id: string, updatedTodo: Partial<Todo>): Todo | null {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = { ...this.todos[index], ...updatedTodo };
            return this.todos[index];
        }
        return null;
    }

    public deleteTodo(id: string): boolean {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return true;
        }
        return false;
    }

    public updateTodo(id: string, completed: boolean): Todo | null {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index].completed = completed;
            return this.todos[index];
        }
        return null;
    }

    public getTodos(): Todo[] {
        return this.todos;
    }
}