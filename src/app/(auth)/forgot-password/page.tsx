"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setSent(true);
    };

    if (sent) {
        return (
            <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Email enviado!</h1>
                    <p className="text-slate-400">
                        Verifique sua caixa de entrada para redefinir sua senha.
                    </p>
                </div>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Voltar para Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link
                href="/login"
                className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Link>

            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
                <p className="text-slate-400">Digite seu email para receber o link de redefinição</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                            Enviando...
                        </>
                    ) : (
                        "Enviar Link"
                    )}
                </Button>
            </form>
        </div>
    );
}
