"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Clientes', href: '/admin/clients', icon: Users },
    { name: 'Pagamentos', href: '/admin/payments', icon: CreditCard },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-white/10
                transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                        <p className="text-sm text-slate-400 mt-1">SocialBoost Vision</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-white font-bold">A</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">Administrador</p>
                                <p className="text-xs text-slate-400">admin@socialboost.com</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sair</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
