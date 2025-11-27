"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadSection } from "./upload-section";
import { AnalysisView } from "./analysis-view";
import { ResultsView } from "./results-view";
import { AnalysisResult } from "@/lib/types";
import { analyzeContent } from "@/lib/mock-service";

export function AppFlow() {
    const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleAnalyze = async (content: File | string, type: 'image' | 'link') => {
        setStep('analyzing');
        try {
            const data = await analyzeContent(content, type);
            setResult(data);
            setStep('results');
        } catch (error) {
            console.error("Analysis failed", error);
            setStep('upload');
        }
    };

    const handleReset = () => {
        setResult(null);
        setStep('upload');
    };

    return (
        <AnimatePresence mode="wait">
            {step === 'upload' && (
                <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <UploadSection onAnalyze={handleAnalyze} />
                </motion.div>
            )}

            {step === 'analyzing' && (
                <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <AnalysisView />
                </motion.div>
            )}

            {step === 'results' && result && (
                <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <ResultsView result={result} onReset={handleReset} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
