"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { authenticateUser } = await import("@/lib/auth-service");
            const user = await authenticateUser({
                loginOrEmail: email,
                password: password
            });

            login(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao fazer login");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">Bem-vindo de volta</h1>
                <p className="text-slate-400">Entre com suas credenciais para acessar</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email ou Login</label>
                    <Input
                        type="text"
                        placeholder="Admin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300">Senha</label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
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
                            Entrando...
                        </>
                    ) : (
                        "Entrar"
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-slate-400">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                    Cadastre-se
                </Link>
            </div>
        </div>
    );
}
