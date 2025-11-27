"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductForm } from "@/components/features/product-form";
import { ProductResults } from "@/components/features/product-results";
import { analyzeProductAction, ProductAnalysisResult } from "@/app/actions/analyze-product";
import { analyzeImageAction, ImageAnalysis } from "@/app/actions/analyze-image";
import { scrapeProductUrl } from "@/app/actions/scrape-product";
import { Loader2 } from "lucide-react";

export default function AppPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ProductAnalysisResult | null>(null);
    const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (name: string, description: string, image?: File) => {
        setIsAnalyzing(true);
        setError(null);
        setImageAnalysis(null);

        try {
            // Analyze product text
            const analysis = await analyzeProductAction(name, description);
            setResult(analysis);

            // Analyze image if provided
            if (image) {
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const base64 = (reader.result as string).split(',')[1];
                        const imgAnalysis = await analyzeImageAction(base64, image.type);
                        setImageAnalysis(imgAnalysis);
                    } catch (imgErr) {
                        console.error("Erro na análise da imagem:", imgErr);
                        // Don't fail the whole operation if image analysis fails
                    }
                };
                reader.readAsDataURL(image);
            }
        } catch (err) {
            console.error("Erro na análise:", err);
            setError(err instanceof Error ? err.message : "Não foi possível analisar o produto. Tente novamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setImageAnalysis(null);
        setError(null);
    };

    const handleScrapeUrl = async (url: string) => {
        try {
            const data = await scrapeProductUrl(url);
            return data;
        } catch (err) {
            console.error("Erro ao buscar produto:", err);
            setError(err instanceof Error ? err.message : "Não foi possível buscar o produto. Tente novamente.");
            throw err;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-950 to-slate-950 pointer-events-none" />

            <Header />

            <main className="flex-1 relative z-10 flex items-center justify-center pt-24 pb-16 px-4">
                <div className="w-full">
                    {!result && !isAnalyzing && (
                        <ProductForm
                            onAnalyze={handleAnalyze}
                            onScrapeUrl={handleScrapeUrl}
                            isAnalyzing={isAnalyzing}
                        />
                    )}

                    {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                            <p className="text-white text-lg font-medium">Analisando produto com IA...</p>
                            <p className="text-slate-400 text-sm mt-2">Isso pode levar alguns segundos</p>
                        </div>
                    )}

                    {result && (
                        <ProductResults result={result} imageAnalysis={imageAnalysis} onReset={handleReset} />
                    )}

                    {error && (
                        <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                            {error}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
