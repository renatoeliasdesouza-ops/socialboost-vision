"use server";

export interface DashboardStats {
    totalClients: number;
    activeClients: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalAnalyses: number;
    todayAnalyses: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        totalClients: 156,
        activeClients: 142,
        totalRevenue: 15680.50,
        monthlyRevenue: 4250.00,
        totalAnalyses: 3420,
        todayAnalyses: 87
    };
}

export interface RecentActivity {
    id: string;
    type: 'signup' | 'payment' | 'analysis' | 'cancellation';
    description: string;
    timestamp: Date;
    clientName: string;
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return [
        {
            id: '1',
            type: 'signup',
            description: 'Novo cadastro',
            timestamp: new Date(),
            clientName: 'Ana Paula'
        },
        {
            id: '2',
            type: 'payment',
            description: 'Pagamento recebido - R$ 99,90',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            clientName: 'João Silva'
        },
        {
            id: '3',
            type: 'analysis',
            description: 'Análise de produto realizada',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            clientName: 'Maria Santos'
        }
    ];
}
