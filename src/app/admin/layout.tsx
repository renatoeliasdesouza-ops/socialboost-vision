import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950">
            <AdminSidebar />
            <main className="lg:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
