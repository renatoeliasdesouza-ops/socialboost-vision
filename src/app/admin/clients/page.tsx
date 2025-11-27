"use client";

import { useEffect, useState } from "react";
import { getClients, deleteClient, resetClientPassword, toggleClientStatus, type Client } from "@/app/actions/admin-clients";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Key, Ban, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() => {
        const filtered = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filtered);
    }, [searchTerm, clients]);

    async function loadClients() {
        try {
            const data = await getClients();
            setClients(data);
            setFilteredClients(data);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteClient(id);
            setClients(clients.filter(c => c.id !== id));
            setShowDeleteModal(false);
            setSelectedClient(null);
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            alert("Erro ao excluir cliente");
        }
    }

    async function handleResetPassword(id: string) {
        try {
            const result = await resetClientPassword(id);
            alert(result.message);
        } catch (error) {
            console.error("Erro ao resetar senha:", error);
            alert("Erro ao resetar senha");
        }
    }

    async function handleToggleStatus(id: string) {
        try {
            const updatedClient = await toggleClientStatus(id);
            setClients(clients.map(c => c.id === id ? updatedClient : c));
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status");
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Clientes</h1>
                    <p className="text-slate-400 mt-2">Gerencie todos os clientes da plataforma</p>
                </div>
            </div>

            {/* Search */}
            <Card className="p-4 bg-slate-900/50 border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou email..."
                        className="pl-10 bg-slate-800/50 border-white/10 text-white"
                    />
                </div>
            </Card>

            {/* Clients Table */}
            <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Cliente</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Plano</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Cadastro</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{client.name}</p>
                                            <p className="text-sm text-slate-400">{client.email}</p>
                                            {client.phone && (
                                                <p className="text-xs text-slate-500">{client.phone}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-2 py-1 rounded-full text-xs font-medium
                                            ${client.subscription?.plan === 'pro' ? 'bg-purple-500/20 text-purple-400' : ''}
                                            ${client.subscription?.plan === 'basic' ? 'bg-blue-500/20 text-blue-400' : ''}
                                            ${client.subscription?.plan === 'free' ? 'bg-gray-500/20 text-gray-400' : ''}
                                        `}>
                                            {client.subscription?.plan.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-2 py-1 rounded-full text-xs font-medium
                                            ${client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                                        `}>
                                            {client.status === 'active' ? 'Ativo' : 'Suspenso'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleResetPassword(client.id)}
                                                title="Resetar Senha"
                                            >
                                                <Key className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleStatus(client.id)}
                                                title={client.status === 'active' ? 'Suspender' : 'Ativar'}
                                            >
                                                {client.status === 'active' ? (
                                                    <Ban className="w-4 h-4 text-orange-400" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setShowDeleteModal(true);
                                                }}
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="p-6 bg-slate-900 border-white/10 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
                        <p className="text-slate-400 mb-6">
                            Tem certeza que deseja excluir o cliente <strong className="text-white">{selectedClient.name}</strong>?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedClient(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="premium"
                                onClick={() => handleDelete(selectedClient.id)}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Excluir
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
