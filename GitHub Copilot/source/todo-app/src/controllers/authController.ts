class AuthController {
    constructor(private authService: AuthService) {}

    async registerUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            const newUser = await this.authService.register(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

export default AuthController;