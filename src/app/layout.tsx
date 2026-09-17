import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalAIGuideWidget } from "@/components/GlobalAIGuideWidget";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EarnQuest — Turn Your Computer Into an Opportunity Engine",
  description:
    "Global platform helping everyday people discover legitimate real-world income paths using free AI tools, open-source software, and guided execution missions.",
  keywords:
    "EarnQuest, free AI tools, make money with PC, AI missions, freelance workflows, open source AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.className} bg-slate-950 text-slate-100 flex flex-col min-h-screen bg-grid-pattern`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <GlobalAIGuideWidget />
      </body>
    </html>
  );
}
