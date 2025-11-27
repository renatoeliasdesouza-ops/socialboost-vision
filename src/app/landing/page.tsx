import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Upload, Sparkles, TrendingUp, Download, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    const steps = [
        {
            icon: Upload,
            number: "1",
            title: "Faça Upload",
            description: "Envie uma imagem do seu produto ou cole o link de uma página de venda (Mercado Livre, Shopee, Amazon, etc.)",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10"
        },
        {
            icon: Sparkles,
            number: "2",
            title: "Análise com IA",
            description: "Nossa inteligência artificial analisa elementos visuais, composição, cores e identifica oportunidades de melhoria em segundos",
            color: "text-purple-400",
            bgColor: "bg-purple-500/10"
        },
        {
            icon: TrendingUp,
            number: "3",
            title: "Receba Sugestões",
            description: "Obtenha um score de engajamento, títulos chamativos, legendas persuasivas, hashtags virais e dicas visuais personalizadas",
            color: "text-green-400",
            bgColor: "bg-green-500/10"
        },
        {
            icon: Download,
            number: "4",
            title: "Exporte e Publique",
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
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

            <Header />

            <main className="flex-1 relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent leading-tight">
                            Como Funciona?
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
                            Transforme suas postagens em máquinas de engajamento com apenas 4 passos simples
                        </p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {steps.map((step, index) => (
                                <Card key={index} className="p-8 bg-slate-900/50 border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                                    <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                                        {step.number}
                                    </div>
                                    <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-6 relative z-10`}>
                                        <step.icon className={`w-8 h-8 ${step.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 bg-slate-900/30">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                            O que você recebe
                        </h2>
                        <p className="text-slate-400 text-center mb-16 text-lg max-w-2xl mx-auto">
                            Ferramentas poderosas para maximizar o engajamento das suas postagens
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="p-6 bg-slate-900/50 border-white/10 hover:border-primary/20 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-2 text-lg">{feature.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <Card className="p-12 md:p-16 bg-gradient-to-br from-primary/10 via-slate-900/50 to-secondary/10 border-primary/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Pronto para começar?
                                </h2>
                                <p className="text-slate-300 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
                                    Crie sua conta gratuitamente e otimize sua primeira postagem em menos de 1 minuto
                                </p>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    <Button variant="premium" size="lg" className="text-lg px-8 h-14 group" asChild>
                                        <Link href="/register">
                                            Começar Agora
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="text-lg px-8 h-14" asChild>
                                        <Link href="/login">Já tenho conta</Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
