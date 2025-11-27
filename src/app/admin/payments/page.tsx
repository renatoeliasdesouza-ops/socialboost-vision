"use client";

import { useEffect, useState } from "react";
import { getPayments, processRefund, type Payment } from "@/app/actions/admin-payments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, RefreshCw } from "lucide-react";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState("");

    useEffect(() => {
        loadPayments();
    }, []);

    useEffect(() => {
        const filtered = payments.filter(payment =>
            payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPayments(filtered);
    }, [searchTerm, payments]);

    async function loadPayments() {
        try {
            const data = await getPayments();
            setPayments(data);
            setFilteredPayments(data);
        } catch (error) {
            console.error("Erro ao carregar pagamentos:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRefund() {
        if (!selectedPayment || !refundAmount) return;

        try {
            const result = await processRefund(selectedPayment.id, parseFloat(refundAmount));
            alert(result.message);
            loadPayments();
            setShowRefundModal(false);
            setSelectedPayment(null);
            setRefundAmount("");
        } catch (error: any) {
            alert(error.message || "Erro ao processar reembolso");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Pagamentos</h1>
                <p className="text-slate-400 mt-2">Gerencie todas as transações da plataforma</p>
            </div>

            {/* Search */}
            <Card className="p-4 bg-slate-900/50 border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por cliente ou ID..."
                        className="pl-10 bg-slate-800/50 border-white/10 text-white"
                    />
                </div>
            </Card>

            {/* Payments Table */}
            <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Cliente</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Descrição</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Valor</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Data</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{payment.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{payment.clientName}</p>
                                            <p className="text-xs text-slate-500">{payment.method}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{payment.description}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">
                                            R$ {payment.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-2 py-1 rounded-full text-xs font-medium
                                            ${payment.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                                            ${payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                            ${payment.status === 'refunded' ? 'bg-blue-500/20 text-blue-400' : ''}
                                            ${payment.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
                                        `}>
                                            {payment.status === 'completed' && 'Concluído'}
                                            {payment.status === 'pending' && 'Pendente'}
                                            {payment.status === 'refunded' && 'Reembolsado'}
                                            {payment.status === 'cancelled' && 'Cancelado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(payment.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {payment.status === 'completed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedPayment(payment);
                                                        setRefundAmount(payment.amount.toString());
                                                        setShowRefundModal(true);
                                                    }}
                                                    title="Processar Reembolso"
                                                >
                                                    <RefreshCw className="w-4 h-4 text-blue-400" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Refund Modal */}
            {showRefundModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="p-6 bg-slate-900 border-white/10 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">Processar Reembolso</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-sm text-slate-400">Cliente</p>
                                <p className="text-white font-medium">{selectedPayment.clientName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Pagamento</p>
                                <p className="text-white font-medium">{selectedPayment.id}</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Valor do Reembolso</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        max={selectedPayment.amount}
                                        className="pl-10 bg-slate-800/50 border-white/10 text-white"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Máximo: R$ {selectedPayment.amount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowRefundModal(false);
                                    setSelectedPayment(null);
                                    setRefundAmount("");
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="premium"
                                onClick={handleRefund}
                                disabled={!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > selectedPayment.amount}
                            >
                                Processar Reembolso
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
