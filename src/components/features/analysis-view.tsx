"use client";

import { motion } from "framer-motion";
import { Scan, Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AnalysisView() {
    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <Card className="p-12 border-primary/20 bg-slate-900/80 backdrop-blur-md relative overflow-hidden">
                {/* Scanning Effect */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                        <Scan className="w-10 h-10 text-primary" />
                        <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Analisando seu conteúdo...
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Nossa IA está verificando diretrizes, qualidade visual e potencial de engajamento.
                    </p>

                    <div className="space-y-4 w-full max-w-sm text-left">
                        <StepItem text="Identificando elementos visuais" delay={0} />
                        <StepItem text="Verificando diretrizes do Instagram" delay={1} />
                        <StepItem text="Gerando sugestões de copy" delay={2} />
                        <StepItem text="Calculando score de viralização" delay={3} />
                    </div>
                </div>
            </Card>
        </div>
    );
}

function StepItem({ text, delay }: { text: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay * 0.8, duration: 0.5 }}
            className="flex items-center gap-3 text-sm text-slate-300"
        >
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span>{text}</span>
        </motion.div>
    );
}
