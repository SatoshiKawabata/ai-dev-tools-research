export class AuthService {
    private users: Map<string, { password: string }> = new Map();

    registerUser(username: string, password: string): boolean {
        if (this.users.has(username)) {
            return false; // User already exists
        }
        this.users.set(username, { password });
        return true; // Registration successful
    }

    loginUser(username: string, password: string): boolean {
        const user = this.users.get(username);
        if (user && user.password === password) {
            // Here you would generate a token in a real application
            return true; // Login successful
        }
        return false; // Invalid credentials
    }

    validateUser(username: string): boolean {
        return this.users.has(username);
    }
}