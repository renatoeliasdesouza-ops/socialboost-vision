"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { updateSettings, getSettings } from "@/app/actions/admin-settings";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [settings, setSettings] = useState<{ geminiKey: string, openaiKey: string, limits: any } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (error) {
            console.error("Erro ao carregar configurações:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        setMessage(null);

        try {
            const result = await updateSettings(formData);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                loadSettings(); // Reload to update state
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Erro ao salvar configurações." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    }

    async function handleDeleteKey(keyName: 'geminiKey' | 'openaiKey') {
        if (!confirm("Tem certeza que deseja remover esta chave?")) return;

        setIsSaving(true);
        try {
            const { deleteKey } = await import("@/app/actions/admin-settings");
            const result = await deleteKey(keyName);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                loadSettings();
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Erro ao remover chave." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    }

    if (isLoading) {
        return <div className="text-white">Carregando configurações...</div>;
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
                    <div className="space-y-6">
                        {/* Gemini Key */}
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                Google Gemini API Key
                            </label>
                            <div className="flex gap-3">
                                {settings?.geminiKey ? (
                                    <div className="flex-1 flex items-center justify-between bg-slate-800/50 border border-green-500/30 rounded-md px-3 py-2">
                                        <span className="text-slate-400 font-mono">••••••••••••••••</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-green-400 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                Ativa
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteKey('geminiKey')}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                                                title="Remover chave"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        type="password"
                                        name="geminiKey"
                                        placeholder="Cole sua chave AIza aqui..."
                                        className="bg-slate-800/50 border-white/10 text-white"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Chave principal para análise de produtos e imagens
                            </p>
                        </div>

                        {/* OpenAI Key */}
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">
                                OpenAI API Key (Fallback)
                            </label>
                            <div className="flex gap-3">
                                {settings?.openaiKey ? (
                                    <div className="flex-1 flex items-center justify-between bg-slate-800/50 border border-green-500/30 rounded-md px-3 py-2">
                                        <span className="text-slate-400 font-mono">sk-••••••••••••••••</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-green-400 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                Ativa
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteKey('openaiKey')}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                                                title="Remover chave"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        type="password"
                                        name="openaiKey"
                                        placeholder="Cole sua chave sk-... aqui"
                                        className="bg-slate-800/50 border-white/10 text-white"
                                    />
                                )}
                            </div>
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
                                defaultValue={settings?.limits?.free || 10}
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
                                defaultValue={settings?.limits?.basic || 100}
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
                                defaultValue={settings?.limits?.pro || 1000}
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
                            <>Salvando...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Salvar Alterações
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
