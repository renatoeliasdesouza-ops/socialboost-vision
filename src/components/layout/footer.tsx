import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-950 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-slate-600" />
                        <span className="font-semibold text-slate-400">SocialBoost Vision</span>
                    </div>
                    <p className="text-sm text-slate-600">
                        © 2024 SocialBoost Vision. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
