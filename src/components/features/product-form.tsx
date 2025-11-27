"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Link2 } from "lucide-react";

interface ProductFormProps {
    onAnalyze: (name: string, description: string, image?: File) => void;
    onScrapeUrl: (url: string) => Promise<{ name: string; description: string; imageUrl?: string }>;
    isAnalyzing: boolean;
}

export function ProductForm({ onAnalyze, onScrapeUrl, isAnalyzing }: ProductFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [productUrl, setProductUrl] = useState("");
    const [isScrapingUrl, setIsScrapingUrl] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && description.trim()) {
            onAnalyze(name, description, image || undefined);
        }
    };

    const handleScrapeUrl = async () => {
        if (!productUrl.trim()) return;

        setIsScrapingUrl(true);
        try {
            const data = await onScrapeUrl(productUrl);
            setName(data.name);
            setDescription(data.description);
            // Optionally fetch image from URL if provided
            if (data.imageUrl) {
                // You could fetch and convert to File here if needed
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
        } finally {
            setIsScrapingUrl(false);
        }
    };

    return (
        <Card className="p-8 bg-slate-900/50 border-white/10 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Analisar Produto
                    </h2>
                </div>
                <p className="text-slate-400">
                    Informe os dados do seu produto e receba sugestões profissionais
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        Link do Produto (opcional)
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            placeholder="Cole o link do Mercado Livre, Shopee, Amazon..."
                            className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 flex-1"
                            disabled={isAnalyzing || isScrapingUrl}
                        />
                        <Button
                            type="button"
                            onClick={handleScrapeUrl}
                            disabled={!productUrl.trim() || isAnalyzing || isScrapingUrl}
                            variant="outline"
                            className="gap-2"
                        >
                            {isScrapingUrl ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Link2 className="w-4 h-4" />
                                    Buscar
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                        Cole o link de um produto e clique em "Buscar" para preencher automaticamente
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-900 px-2 text-slate-500">ou preencha manualmente</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        Nome do Produto *
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Capa Painel Redondo Novembro Azul"
                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
                        required
                        disabled={isAnalyzing}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        Descrição do Produto *
                    </label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Painel decorativo de tecido sublimado, 1,5m de diâmetro, tema Novembro Azul com bigode e texto personalizado. Material: malha. Ideal para festas e eventos."
                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 min-h-[120px]"
                        required
                        disabled={isAnalyzing}
                    />
                    <p className="text-xs text-slate-500">
                        Quanto mais detalhes, melhores as sugestões!
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        Imagem do Produto (opcional)
                    </label>
                    <div className="relative">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="bg-slate-800/50 border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                            disabled={isAnalyzing}
                        />
                    </div>
                    {image && (
                        <p className="text-xs text-primary">
                            ✓ {image.name} selecionado
                        </p>
                    )}
                    <p className="text-xs text-slate-500">
                        Adicione uma foto para receber análise visual e sugestões de melhoria
                    </p>
                </div>

                <Button
                    type="submit"
                    variant="premium"
                    size="lg"
                    className="w-full"
                    disabled={isAnalyzing || !name.trim() || !description.trim()}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analisando com IA...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analisar Produto
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}
