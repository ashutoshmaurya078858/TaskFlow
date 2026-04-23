import { CTABanner } from "@/components/(homepage)/cta-banner";
import { Features } from "@/components/(homepage)/features";
import { Footer } from "@/components/(homepage)/Footer";
import { Hero } from "@/components/(homepage)/hero";
import { HowItWorks } from "@/components/(homepage)/how-it-works";
import { Integrations } from "@/components/(homepage)/integrations";
import { Navbar } from "@/components/(homepage)/navbar";
import { Pricing } from "@/components/(homepage)/pricing";
import { ProductPreview } from "@/components/(homepage)/product-preview";
import { Testimonials } from "@/components/(homepage)/testimonials";
import { TrustedBy } from "@/components/(homepage)/trusted-by";

import { getCurrent } from "@/fetures/auth/action";
// ✅ import your own footer instead
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const user = await getCurrent();
  const safeUser = JSON.parse(JSON.stringify(user));

  return (
    <main className="font-sans antialiased">
      <Navbar user={safeUser} />
      <Hero />
      <TrustedBy />
      <Features />
      <ProductPreview />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Integrations />
      <CTABanner />
      <Footer />
    </main>
  );
}