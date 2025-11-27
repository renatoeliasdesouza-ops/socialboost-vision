"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getRecentActivity, type DashboardStats, type RecentActivity } from "@/app/actions/admin-analytics";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [statsData, activitiesData] = await Promise.all([
                    getDashboardStats(),
                    getRecentActivity()
                ]);
                setStats(statsData);
                setActivities(activitiesData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-2">Visão geral do sistema</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total de Clientes"
                    value={stats?.totalClients || 0}
                    subtitle={`${stats?.activeClients || 0} ativos`}
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Receita Total"
                    value={`R$ ${(stats?.totalRevenue || 0).toFixed(2)}`}
                    subtitle={`R$ ${(stats?.monthlyRevenue || 0).toFixed(2)} este mês`}
                    icon={DollarSign}
                    color="green"
                />
                <StatsCard
                    title="Análises Realizadas"
                    value={stats?.totalAnalyses || 0}
                    subtitle={`${stats?.todayAnalyses || 0} hoje`}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatsCard
                    title="Taxa de Conversão"
                    value="68%"
                    subtitle="+5% vs mês anterior"
                    icon={Activity}
                    color="orange"
                />
            </div>

            {/* Recent Activity */}
            <Card className="p-6 bg-slate-900/50 border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Atividades Recentes</h2>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50">
                            <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
                            <div className="flex-1">
                                <p className="text-white font-medium">{activity.clientName}</p>
                                <p className="text-sm text-slate-400">{activity.description}</p>
                            </div>
                            <span className="text-xs text-slate-500">
                                {formatTimestamp(activity.timestamp)}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, subtitle, icon: Icon, color }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: string;
}) {
    const colorClasses = {
        blue: 'bg-blue-500/20 text-blue-400',
        green: 'bg-green-500/20 text-green-400',
        purple: 'bg-purple-500/20 text-purple-400',
        orange: 'bg-orange-500/20 text-orange-400',
    }[color];

    return (
        <Card className="p-6 bg-slate-900/50 border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </Card>
    );
}

function getActivityColor(type: string) {
    const colors = {
        signup: 'bg-green-400',
        payment: 'bg-blue-400',
        analysis: 'bg-purple-400',
        cancellation: 'bg-red-400',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-400';
}

function formatTimestamp(date: Date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
}
