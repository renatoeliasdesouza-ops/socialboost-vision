"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw, Share2, Instagram, ShoppingBag, Camera } from "lucide-react";
import { useState } from "react";
import { ProductAnalysisResult } from "@/app/actions/analyze-product";
import { ImageAnalysis } from "@/app/actions/analyze-image";

interface ProductResultsProps {
    result: ProductAnalysisResult;
    imageAnalysis?: ImageAnalysis | null;
    onReset: () => void;
}

export function ProductResults({ result, imageAnalysis, onReset }: ProductResultsProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleExport = () => {
        const content = `ANÁLISE DE PRODUTO - SocialBoost Vision

PRODUTO:
${result.product.name}

DESCRIÇÃO:
${result.product.description}

SCORE: ${result.score}/100

═══════════════════════════════════
SUGESTÕES PARA REDES SOCIAIS
═══════════════════════════════════

TÍTULOS:
${result.suggestions.socialMedia.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

LEGENDAS:
${result.suggestions.socialMedia.captions.map((c, i) => `\n${i + 1}. ${c}\n`).join('\n')}

HASHTAGS:
${result.suggestions.socialMedia.hashtags.join(' ')}

MELHORES HORÁRIOS:
${result.suggestions.socialMedia.bestTimes.join('\n')}

MELHORIAS:
${result.suggestions.socialMedia.improvements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

═══════════════════════════════════
SUGESTÕES PARA MARKETPLACE
═══════════════════════════════════

TÍTULO SEO:
${result.suggestions.marketplace.title}

DESCRIÇÃO:
${result.suggestions.marketplace.description}

PALAVRAS-CHAVE:
${result.suggestions.marketplace.keywords.join(', ')}

CATEGORIA:
${result.suggestions.marketplace.category}

MELHORIAS:
${result.suggestions.marketplace.improvements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

---
Gerado em: ${new Date().toLocaleString('pt-BR')}
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise-${result.product.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Header com Score */}
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{result.product.name}</h2>
                        <p className="text-slate-400">{result.product.description}</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary/30 bg-slate-900">
                            <span className="text-3xl font-bold text-white">{result.score}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">Potencial de Venda</p>
                    </div>
                </div>
            </Card>

            {/* Image Analysis */}
            {imageAnalysis && (
                <Card className="p-6 bg-slate-900/50 border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Camera className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">Análise Visual da Imagem</h3>
                        <div className="ml-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                                <span className="text-sm font-medium text-blue-400">Score: {imageAnalysis.commercialAppeal.score}/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Composição</label>
                            <p className="text-sm text-slate-200 bg-slate-800/50 border border-white/10 rounded-lg p-3 leading-relaxed">
                                {imageAnalysis.composition}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Iluminação</label>
                            <p className="text-sm text-slate-200 bg-slate-800/50 border border-white/10 rounded-lg p-3 leading-relaxed">
                                {imageAnalysis.lighting}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cores</label>
                            <p className="text-sm text-slate-200 bg-slate-800/50 border border-white/10 rounded-lg p-3 leading-relaxed">
                                {imageAnalysis.colors}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Qualidade Técnica</label>
                            <p className="text-sm text-slate-200 bg-slate-800/50 border border-white/10 rounded-lg p-3 leading-relaxed">
                                {imageAnalysis.quality}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-800/30 border border-green-500/20 rounded-lg p-4">
                            <p className="text-xs font-medium text-green-400 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                Pontos Fortes
                            </p>
                            <ul className="space-y-2">
                                {imageAnalysis.commercialAppeal.strengths.map((strength, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                        <span className="text-green-400 mt-0.5">✓</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-800/30 border border-orange-500/20 rounded-lg p-4">
                            <p className="text-xs font-medium text-orange-400 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                Pontos a Melhorar
                            </p>
                            <ul className="space-y-2">
                                {imageAnalysis.commercialAppeal.weaknesses.map((weakness, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                        <span className="text-orange-400 mt-0.5">⚠</span>
                                        <span>{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-400 mb-3 block uppercase tracking-wider">Sugestões de Melhoria</label>
                        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                            <ul className="space-y-2">
                                {imageAnalysis.improvements.map((improvement, i) => (
                                    <li key={i} className="text-sm text-slate-200 flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                                            {i + 1}
                                        </span>
                                        <span className="flex-1">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {/* Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Redes Sociais */}
                <Card className="p-6 bg-slate-900/50 border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Instagram className="w-6 h-6 text-pink-400" />
                        <h3 className="text-xl font-bold text-white">Redes Sociais</h3>
                    </div>

                    <div className="space-y-6">
                        <ContentSection
                            label="Títulos Sugeridos"
                            items={result.suggestions.socialMedia.titles}
                            onCopy={(text) => copyToClipboard(text, 'social-titles')}
                            isCopied={copiedField === 'social-titles'}
                        />

                        <ContentSection
                            label="Legendas"
                            items={result.suggestions.socialMedia.captions}
                            onCopy={(text) => copyToClipboard(text, 'social-captions')}
                            isCopied={copiedField === 'social-captions'}
                            multiline
                        />

                        <ContentSection
                            label="Hashtags"
                            items={[result.suggestions.socialMedia.hashtags.join(' ')]}
                            onCopy={(text) => copyToClipboard(text, 'social-hashtags')}
                            isCopied={copiedField === 'social-hashtags'}
                            highlight
                        />

                        <ContentSection
                            label="Melhores Horários"
                            items={result.suggestions.socialMedia.bestTimes}
                        />

                        <ContentSection
                            label="Sugestões de Melhoria"
                            items={result.suggestions.socialMedia.improvements}
                        />
                    </div>
                </Card>

                {/* Marketplace */}
                <Card className="p-6 bg-slate-900/50 border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingBag className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-bold text-white">Marketplace</h3>
                    </div>

                    <div className="space-y-6">
                        <ContentSection
                            label="Título SEO"
                            items={[result.suggestions.marketplace.title]}
                            onCopy={(text) => copyToClipboard(text, 'market-title')}
                            isCopied={copiedField === 'market-title'}
                        />

                        <ContentSection
                            label="Descrição"
                            items={[result.suggestions.marketplace.description]}
                            onCopy={(text) => copyToClipboard(text, 'market-desc')}
                            isCopied={copiedField === 'market-desc'}
                            multiline
                        />

                        <ContentSection
                            label="Palavras-Chave"
                            items={[result.suggestions.marketplace.keywords.join(', ')]}
                            onCopy={(text) => copyToClipboard(text, 'market-keywords')}
                            isCopied={copiedField === 'market-keywords'}
                        />

                        <ContentSection
                            label="Categoria Sugerida"
                            items={[result.suggestions.marketplace.category]}
                        />

                        <ContentSection
                            label="Sugestões de Melhoria"
                            items={result.suggestions.marketplace.improvements}
                        />
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Nova Análise
                </Button>
                <Button onClick={handleExport} variant="premium" size="lg" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Baixar Relatório
                </Button>
            </div>
        </div>
    );
}

function ContentSection({
    label,
    items,
    onCopy,
    isCopied,
    multiline = false,
    highlight = false
}: {
    label: string;
    items: string[];
    onCopy?: (text: string) => void;
    isCopied?: boolean;
    multiline?: boolean;
    highlight?: boolean;
}) {
    const content = items.join('\n\n');

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-400">{label}</label>
                {onCopy && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => onCopy(content)}
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
                )}
            </div>
            <div className={`bg-slate-800/50 border border-white/10 rounded-lg p-4 text-sm ${highlight ? 'text-primary font-medium' : 'text-slate-200'}`}>
                {multiline ? (
                    <div className="space-y-3">
                        {items.map((item, i) => (
                            <p key={i} className="leading-relaxed">{item}</p>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
