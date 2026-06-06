import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-background text-text-primary font-body antialiased">
                <Navbar />
                <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-12">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}