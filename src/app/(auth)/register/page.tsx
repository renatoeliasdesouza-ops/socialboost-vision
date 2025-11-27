"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        login: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem!");
            return;
        }

        setLoading(true);

        try {
            const { registerUser } = await import("@/lib/auth-service");
            const user = await registerUser({
                name: formData.name,
                login: formData.login,
                email: formData.email,
                password: formData.password
            });

            login(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar conta");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>
                <p className="text-slate-400">Comece a otimizar seus posts hoje mesmo</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nome Completo</label>
                    <Input
                        name="name"
                        placeholder="João Silva"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Login</label>
                        <Input
                            name="login"
                            placeholder="joaosilva"
                            value={formData.login}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="joao@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Senha</label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Confirmar Senha</label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11"
                    variant="premium"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Criando conta...
                        </>
                    ) : (
                        "Cadastrar"
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-slate-400">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                    Faça login
                </Link>
            </div>
        </div>
    );
}
