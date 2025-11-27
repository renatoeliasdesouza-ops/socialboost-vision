"use client";

import { motion } from "framer-motion";
import { Check, Copy, Star, TrendingUp, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalysisResult } from "@/lib/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResultsViewProps {
    result: AnalysisResult;
    onReset: () => void;
}

export function ResultsView({ result, onReset }: ResultsViewProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleExport = () => {
        const content = `ANÁLISE DE POSTAGEM - SocialBoost Vision
    
Score de Engajamento: ${result.score}/100

TÍTULO SUGERIDO:
${result.title}

LEGENDA:
${result.caption}

HASHTAGS:
${result.hashtags.join(' ')}

DICAS DE MELHORIA:
${result.improvements.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---
Gerado em: ${new Date().toLocaleString('pt-BR')}
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Preview & Score */}
                <div className="space-y-6">
                    <Card className="p-4 overflow-hidden bg-slate-900/50 border-white/10">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-800 mb-4 relative">
                            <img
                                src={result.previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                {result.type === 'image' ? 'Imagem' : 'Produto'}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary/30 bg-slate-900 mb-2 relative">
                                <span className="text-3xl font-bold text-white">{result.score}</span>
                                <TrendingUp className="absolute -top-2 -right-2 w-8 h-8 text-green-400 bg-slate-900 rounded-full p-1 border border-slate-800" />
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Score de Engajamento</p>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900/50 border-white/10">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            Dicas de Melhoria
                        </h3>
                        <ul className="space-y-3">
                            {result.improvements.map((item, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900/50 border-white/10">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-secondary" />
                            Melhores Horários
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Hoje</span>
                                <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">18:30 - 19:30</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Amanhã</span>
                                <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">09:00 - 10:30</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Generated Content */}
                <div className="md:col-span-2 space-y-6">
                    <ContentBlock
                        label="Título Sugerido"
                        content={result.title}
                        onCopy={() => copyToClipboard(result.title, 'title')}
                        isCopied={copiedField === 'title'}
                    />

                    <ContentBlock
                        label="Legenda Otimizada"
                        content={result.caption}
                        onCopy={() => copyToClipboard(result.caption, 'caption')}
                        isCopied={copiedField === 'caption'}
                        multiline
                    />

                    <ContentBlock
                        label="Hashtags Virais"
                        content={result.hashtags.join(" ")}
                        onCopy={() => copyToClipboard(result.hashtags.join(" "), 'hashtags')}
                        isCopied={copiedField === 'hashtags'}
                        highlight
                    />

                    <div className="flex gap-4 pt-4">
                        <Button onClick={onReset} variant="outline" className="flex-1 gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Nova Análise
                        </Button>
                        <Button className="flex-1 gap-2" variant="premium" onClick={handleExport}>
                            <Share2 className="w-4 h-4" />
                            Baixar Relatório
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContentBlock({
    label,
    content,
    onCopy,
    isCopied,
    multiline = false,
    highlight = false
}: {
    label: string;
    content: string;
    onCopy: () => void;
    isCopied: boolean;
    multiline?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-400">{label}</label>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1.5 hover:bg-white/5"
                    onClick={onCopy}
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            Copiar
                        </>
                    )}
                </Button>
            </div>
            <div className={cn(
                "bg-slate-900/50 border border-white/10 rounded-lg p-4 text-slate-200 text-sm",
                highlight && "text-primary font-medium"
            )}>
                {multiline ? (
                    <p className="whitespace-pre-line leading-relaxed">{content}</p>
                ) : (
                    <p>{content}</p>
                )}
            </div>
        </div>
    );
}
