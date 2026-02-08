import Footer from "@/components/layout/Footer";
import { HeaderForDesktop } from "@/components/layout/Header";
import DynamicBackground from "@/components/ui/Bg";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicBackground>
      <HeaderForDesktop />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </DynamicBackground>
  );
}
