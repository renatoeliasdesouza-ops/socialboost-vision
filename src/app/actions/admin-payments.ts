"use server";

export interface Payment {
    id: string;
    clientId: string;
    clientName: string;
    amount: number;
    status: 'pending' | 'completed' | 'refunded' | 'cancelled';
    date: Date;
    method: string;
    description: string;
}

// Mock database
const MOCK_PAYMENTS: Payment[] = [
    {
        id: 'PAY001',
        clientId: '1',
        clientName: 'João Silva',
        amount: 99.90,
        status: 'completed',
        date: new Date('2024-11-01'),
        method: 'Cartão de Crédito',
        description: 'Plano Pro - Mensal'
    },
    {
        id: 'PAY002',
        clientId: '2',
        clientName: 'Maria Santos',
        amount: 49.90,
        status: 'completed',
        date: new Date('2024-11-05'),
        method: 'PIX',
        description: 'Plano Basic - Mensal'
    },
    {
        id: 'PAY003',
        clientId: '1',
        clientName: 'João Silva',
        amount: 99.90,
        status: 'pending',
        date: new Date('2024-11-27'),
        method: 'Cartão de Crédito',
        description: 'Plano Pro - Mensal'
    }
];

export async function getPayments() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PAYMENTS;
}

export async function getPaymentById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const payment = MOCK_PAYMENTS.find(p => p.id === id);
    if (!payment) {
        throw new Error('Pagamento não encontrado');
    }
    return payment;
}

export async function cancelSubscription(clientId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));

    // In real app, cancel subscription in payment gateway
    return {
        success: true,
        message: 'Assinatura cancelada com sucesso'
    };
}

export async function processRefund(paymentId: string, amount: number) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const payment = MOCK_PAYMENTS.find(p => p.id === paymentId);
    if (!payment) {
        throw new Error('Pagamento não encontrado');
    }

    if (payment.status === 'refunded') {
        throw new Error('Pagamento já foi reembolsado');
    }

    payment.status = 'refunded';

    return {
        success: true,
        message: `Reembolso de R$ ${amount.toFixed(2)} processado com sucesso`
    };
}

export async function updatePaymentStatus(id: string, status: Payment['status']) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const payment = MOCK_PAYMENTS.find(p => p.id === id);
    if (!payment) {
        throw new Error('Pagamento não encontrado');
    }

    payment.status = status;
    return payment;
}
