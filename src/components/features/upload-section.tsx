"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link as LinkIcon, ArrowRight, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadSectionProps {
    onAnalyze: (content: File | string, type: 'image' | 'link') => void;
}

export function UploadSection({ onAnalyze }: UploadSectionProps) {
    const [activeTab, setActiveTab] = useState<"image" | "link">("image");
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [link, setLink] = useState("");

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-center mb-8">
                <div className="bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-sm inline-flex">
                    <button
                        onClick={() => setActiveTab("image")}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                            activeTab === "image"
                                ? "bg-primary text-white shadow-lg"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Upload Imagem
                    </button>
                    <button
                        onClick={() => setActiveTab("link")}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                            activeTab === "link"
                                ? "bg-secondary text-white shadow-lg"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        <LinkIcon className="w-4 h-4" />
                        Link do Produto
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "image" ? (
                    <motion.div
                        key="image-upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            className={cn(
                                "border-2 border-dashed transition-all duration-300 relative overflow-hidden",
                                dragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-white/10 hover:border-white/20"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="p-12 text-center">
                                {preview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-64 rounded-lg shadow-2xl border border-white/10"
                                        />
                                        <button
                                            onClick={clearFile}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            Arraste sua imagem aqui
                                        </h3>
                                        <p className="text-slate-400 mb-6">
                                            ou clique para selecionar do seu computador
                                        </p>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                className="hidden"
                                                id="file-upload"
                                                onChange={handleChange}
                                                accept="image/*"
                                            />
                                            <label htmlFor="file-upload">
                                                <Button
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                    asChild
                                                >
                                                    <span>Selecionar Arquivo</span>
                                                </Button>
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                            {preview && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-sm border-t border-white/10 flex justify-end">
                                    <Button
                                        className="gap-2 group"
                                        onClick={() => file && onAnalyze(file, 'image')}
                                    >
                                        Analisar Imagem
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="link-upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="p-8">
                            <div className="flex flex-col gap-4">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                                        <LinkIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Cole o link do produto
                                    </h3>
                                    <p className="text-slate-400">
                                        Analisamos Mercado Livre, Shopee, Amazon e mais
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://..."
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <Button
                                    className="w-full h-12 text-lg gap-2 group"
                                    variant="secondary"
                                    disabled={!link}
                                    onClick={() => onAnalyze(link, 'link')}
                                >
                                    Analisar Link
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
