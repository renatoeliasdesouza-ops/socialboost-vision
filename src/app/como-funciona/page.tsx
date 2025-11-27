import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Upload, Sparkles, TrendingUp, Download, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
    const steps = [
        {
            icon: Upload,
            title: "1. Faça Upload",
            description: "Envie uma imagem do seu produto ou cole o link de uma página de venda (Mercado Livre, Shopee, Amazon, etc.)",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10"
        },
        {
            icon: Sparkles,
            title: "2. Análise com IA",
            description: "Nossa inteligência artificial analisa elementos visuais, composição, cores e identifica oportunidades de melhoria em segundos",
            color: "text-purple-400",
            bgColor: "bg-purple-500/10"
        },
        {
            icon: TrendingUp,
            title: "3. Receba Sugestões",
            description: "Obtenha um score de engajamento, títulos chamativos, legendas persuasivas, hashtags virais e dicas visuais personalizadas",
            color: "text-green-400",
            bgColor: "bg-green-500/10"
        },
        {
            icon: Download,
            title: "4. Exporte e Publique",
            description: "Copie o conteúdo gerado, baixe o relatório completo e publique nos melhores horários sugeridos pela plataforma",
            color: "text-orange-400",
            bgColor: "bg-orange-500/10"
        }
    ];

    const features = [
        {
            title: "Score de Engajamento (0-100)",
            description: "Avaliação instantânea do potencial de engajamento da sua postagem baseada em elementos visuais, composição e apelo comercial"
        },
        {
            title: "Títulos otimizados para cliques",
            description: "Sugestões de títulos chamativos e persuasivos que aumentam a taxa de cliques e despertam curiosidade no público"
        },
        {
            title: "Legendas com call-to-action",
            description: "Textos estratégicos que contam histórias, geram conexão emocional e incentivam ações como curtir, comentar e comprar"
        },
        {
            title: "Hashtags segmentadas por nicho",
            description: "Conjunto de hashtags virais e relevantes para o seu nicho, aumentando o alcance orgânico e atraindo o público certo"
        },
        {
            title: "Análise de elementos visuais",
            description: "Identificação de pontos fortes e fracos na composição, iluminação, cores e enquadramento da sua imagem"
        },
        {
            title: "Sugestão de horários de postagem",
            description: "Recomendações baseadas em dados de quando seu público está mais ativo e engajado nas redes sociais"
        },
        {
            title: "Relatório exportável em .txt",
            description: "Documento completo com todas as sugestões, pronto para salvar, compartilhar ou usar como referência futura"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-950 to-slate-950 pointer-events-none" />

            <Header />

            <main className="flex-1 relative z-10 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                            Como Funciona?
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Transforme suas postagens em máquinas de engajamento com apenas 4 passos simples
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {steps.map((step, index) => (
                            <Card key={index} className="p-6 bg-slate-900/50 border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                                <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center mb-4 mx-auto`}>
                                    <step.icon className={`w-8 h-8 ${step.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                                <p className="text-slate-400 text-sm text-center leading-relaxed">{step.description}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Features Grid */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white text-center mb-8">
                            O que você recebe
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {features.map((feature, index) => (
                                <Card key={index} className="p-6 bg-slate-900/30 border-white/10 hover:border-primary/20 transition-all">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <Card className="p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Pronto para começar?
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                Crie sua conta gratuitamente e otimize sua primeira postagem em menos de 1 minuto
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Button variant="premium" size="lg" asChild>
                                    <Link href="/register">Começar Agora</Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/login">Já tenho conta</Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
