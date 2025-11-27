"use server";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'active' | 'suspended';
    createdAt: Date;
    subscription?: {
        plan: 'free' | 'basic' | 'pro';
        status: 'active' | 'cancelled';
        startDate: Date;
        endDate?: Date;
    };
}

// Mock database
const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(11) 98765-4321',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        subscription: {
            plan: 'pro',
            status: 'active',
            startDate: new Date('2024-01-15'),
        }
    },
    {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '(21) 99876-5432',
        status: 'active',
        createdAt: new Date('2024-02-20'),
        subscription: {
            plan: 'basic',
            status: 'active',
            startDate: new Date('2024-02-20'),
        }
    },
    {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@example.com',
        status: 'suspended',
        createdAt: new Date('2024-03-10'),
        subscription: {
            plan: 'free',
            status: 'active',
            startDate: new Date('2024-03-10'),
        }
    }
];

export async function getClients() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CLIENTS;
}

export async function getClientById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const client = MOCK_CLIENTS.find(c => c.id === id);
    if (!client) {
        throw new Error('Cliente não encontrado');
    }
    return client;
}

export async function updateClient(id: string, data: Partial<Client>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CLIENTS.findIndex(c => c.id === id);
    if (index === -1) {
        throw new Error('Cliente não encontrado');
    }

    MOCK_CLIENTS[index] = { ...MOCK_CLIENTS[index], ...data };
    return MOCK_CLIENTS[index];
}

export async function deleteClient(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CLIENTS.findIndex(c => c.id === id);
    if (index === -1) {
        throw new Error('Cliente não encontrado');
    }

    MOCK_CLIENTS.splice(index, 1);
    return { success: true };
}

export async function resetClientPassword(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const client = MOCK_CLIENTS.find(c => c.id === id);
    if (!client) {
        throw new Error('Cliente não encontrado');
    }

    // In real app, send password reset email
    return {
        success: true,
        message: `Email de recuperação enviado para ${client.email}`
    };
}

export async function toggleClientStatus(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const client = MOCK_CLIENTS.find(c => c.id === id);
    if (!client) {
        throw new Error('Cliente não encontrado');
    }

    client.status = client.status === 'active' ? 'suspended' : 'active';
    return client;
}
