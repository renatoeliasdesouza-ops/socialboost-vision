"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useState } from "react";
import { updateSettings } from "@/app/actions/admin-settings";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        setMessage(null);

        try {
            const result = await updateSettings(formData);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Erro ao salvar configurações." });
        } finally {
            setIsSaving(false);
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Configurações</h1>
                <p className="text-slate-400 mt-2">Gerencie as configurações do sistema</p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                {/* API Keys */}
                <Card className="p-6 bg-slate-900/50 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Chaves de API</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                Google Gemini API Key
                            </label>
                            <Input
                                type="password"
                                name="geminiKey"
                                placeholder="AIza..."
                                className="bg-slate-800/50 border-white/10 text-white"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Chave para análise de produtos e imagens
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                OpenAI API Key (Fallback)
                            </label>
                            <Input
                                type="password"
                                name="openaiKey"
                                placeholder="sk-..."
                                className="bg-slate-800/50 border-white/10 text-white"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Chave de backup quando Gemini estiver indisponível
                            </p>
                        </div>
                    </div>
                </Card>

                {/* System Settings */}
                <Card className="p-6 bg-slate-900/50 border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Configurações do Sistema</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                Limite de Análises (Plano Free)
                            </label>
                            <Input
                                type="number"
                                name="limitFree"
                                defaultValue="10"
                                className="bg-slate-800/50 border-white/10 text-white"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                Limite de Análises (Plano Basic)
                            </label>
                            <Input
                                type="number"
                                name="limitBasic"
                                defaultValue="100"
                                className="bg-slate-800/50 border-white/10 text-white"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                Limite de Análises (Plano Pro)
                            </label>
                            <Input
                                type="number"
                                name="limitPro"
                                defaultValue="1000"
                                className="bg-slate-800/50 border-white/10 text-white"
                            />
                        </div>
                    </div>
                </Card>

                {/* Feedback Message */}
                {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="premium"
                        disabled={isSaving}
                        className="gap-2"
                    >
                        {isSaving ? (
                            <>Salvnado...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Salvar Configurações
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
