// Mock database of users
const MOCK_USERS = [
    {
        login: "Admin",
        password: "Admin",
        name: "Administrador",
        email: "admin@socialboost.com"
    }
];

export interface LoginCredentials {
    loginOrEmail: string;
    password: string;
}

export interface RegisterData {
    name: string;
    login: string;
    email: string;
    password: string;
}

export async function authenticateUser(credentials: LoginCredentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(
        u => (u.login === credentials.loginOrEmail || u.email === credentials.loginOrEmail)
            && u.password === credentials.password
    );

    if (!user) {
        throw new Error("Credenciais inválidas");
    }

    return {
        name: user.name,
        email: user.email,
        login: user.login
    };
}

export async function registerUser(data: RegisterData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const exists = MOCK_USERS.find(
        u => u.login === data.login || u.email === data.email
    );

    if (exists) {
        throw new Error("Usuário ou email já cadastrado");
    }

    // In a real app, this would save to database
    // For now, we just return the user data
    return {
        name: data.name,
        email: data.email,
        login: data.login
    };
}
