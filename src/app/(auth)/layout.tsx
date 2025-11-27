import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <Link href="/" className="flex items-center gap-2 group mb-8">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            SocialBoost Vision
                        </span>
                    </Link>

                    {children}
                </div>

                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
            </div>

            {/* Right Side - Image/Showcase */}
            <div className="hidden md:flex flex-col justify-center items-center p-12 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <div className="relative z-10 max-w-lg text-center space-y-6">
                    <h2 className="text-4xl font-bold text-white">
                        Potencialize sua presença digital
                    </h2>
                    <p className="text-lg text-slate-400">
                        Junte-se a milhares de criadores e marcas que usam nossa IA para engajar mais e vender melhor.
                    </p>
                </div>
            </div>
        </div>
    );
}
