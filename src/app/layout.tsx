import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "EarnQuest — Turn Your Computer Into an Opportunity Engine",
  description: "Global AI-powered platform helping everyday people discover legitimate real-world income paths using free AI tools, open-source software, and guided execution missions.",
  keywords: "EarnQuest, free AI tools, make money with PC, AI missions, freelance workflows, open source AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
