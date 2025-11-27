"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [geminiKey, setGeminiKey] = useState("");
    const [openaiKey, setOpenaiKey] = useState("");
    const [saved, setSaved] = useState(false);

    function handleSave() {
        // In real app, save to database/env
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Configurações</h1>
                <p className="text-slate-400 mt-2">Gerencie as configurações do sistema</p>
            </div>

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
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
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
                            value={openaiKey}
                            onChange={(e) => setOpenaiKey(e.target.value)}
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
                            defaultValue="1000"
                            className="bg-slate-800/50 border-white/10 text-white"
                        />
                    </div>
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    variant="premium"
                    onClick={handleSave}
                    className="gap-2"
                >
                    <Save className="w-4 h-4" />
                    {saved ? 'Salvo!' : 'Salvar Configurações'}
                </Button>
            </div>
        </div>
    );
}
