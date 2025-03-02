export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserModel {
    private users: User[] = [];

    public createUser(user: User): User {
        this.users.push(user);
        return user;
    }

    public getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    public updateUser(id: string, updatedData: Partial<User>): User | undefined {
        const user = this.getUserById(id);
        if (user) {
            Object.assign(user, updatedData);
            return user;
        }
        return undefined;
    }

    public deleteUser(id: string): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    public getAllUsers(): User[] {
        return this.users;
    }
}