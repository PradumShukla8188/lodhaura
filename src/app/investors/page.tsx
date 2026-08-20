import type { Metadata } from "next";
import { ArrowRight, MapPin, Building, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/SectionTitle";
import { InvestorContactForm } from "@/components/investors/InvestorContactForm";
import { 
  villageInfo, 
  whyInvestReasons, 
  investmentOpportunities, 
  investmentBenefits, 
  communityImpacts,
  villageStats
} from "@/lib/village-data";
import * as LucideIcons from "lucide-react";

export const metadata: Metadata = {
  title: "Invest in Lodhaura",
  description: "Explore investment and business opportunities in Lodhaura. Establish companies, NGOs, or partner with our growing community for sustainable development.",
};

// Helper to render dynamic lucide icons
const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  // Convert kebab-case to PascalCase (e.g., trending-up -> TrendingUp)
  const iconName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName];
  return Icon ? <Icon className={className} /> : <div className={className} />;
};

export default function InvestorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-village opacity-[0.08] dark:opacity-[0.15]" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="glass" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
            <Building className="h-4 w-4 text-accent" />
            Lodhaura Investment Hub
          </Badge>
          
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Invest in Our Village.<br />
            <span className="text-gradient-village">Build Opportunities for the Future.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {villageInfo.name} welcomes responsible investment, startups, and organizations. Partner with our community to drive sustainable growth, establish new ventures, and create meaningful impact.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#opportunities">
              <Button size="lg" className="gap-2 px-8">
                Explore Opportunities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#contact">
              <Button variant="outline" size="lg" className="px-8">
                Contact Us
              </Button>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Transparent Governance
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Strategic Location
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Ready for Growth
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Invest With Us? */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Why Invest in Lodhaura?" 
            subtitle="Strategic advantages for your business and our community" 
          />
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyInvestReasons.map((reason, index) => (
              <div key={index} className="glass overflow-hidden rounded-2xl border-white/20 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IconComponent name={reason.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Investment Opportunities */}
      <section id="opportunities" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Potential Areas</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Investment Opportunities</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              While {villageInfo.name} has a strong agricultural base, we are actively seeking partnerships in the following potential growth areas to diversify our local economy.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {investmentOpportunities.map((opp, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-6 transition-all hover:border-primary/50">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <IconComponent name={opp.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold">{opp.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "Start Something Here" & 9. Open an Organization */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/50" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Have an Idea? Build It Here.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Looking to establish a company, startup, NGO, or social enterprise? 
            {villageInfo.name} welcomes proposals from entrepreneurs and organizations across all sectors. We provide a supportive environment for manufacturing units, healthcare facilities, schools, and community initiatives.
          </p>
          <div className="mt-10">
            <a href="#contact">
              <Button size="lg" variant="secondary" className="gap-2 px-8 text-primary hover:bg-white">
                Submit Your Proposal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 5. Benefits & 6. Community Impact */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
            {/* Benefits */}
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight">Investor Benefits</h2>
              <p className="mb-8 text-muted-foreground">
                Partnering with our community offers strategic advantages while contributing to sustainable rural development.
              </p>
              <ul className="space-y-4">
                {investmentBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Impact */}
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight">Community Impact</h2>
              <p className="mb-8 text-muted-foreground">
                Investment is not just about business; it&apos;s about lifting the entire community and creating a sustainable ecosystem.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {communityImpacts.map((impact, index) => (
                  <div key={index} className="glass rounded-xl p-5 border-white/10">
                    <h4 className="font-bold text-primary mb-1">{impact.title}</h4>
                    <p className="text-sm text-muted-foreground">{impact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Existing Development / Village Highlights */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="A Foundation for Growth" 
            subtitle="Our current infrastructure and community strength" 
          />
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {villageStats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl border-white/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IconComponent name={stat.icon} className="h-6 w-6" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">{stat.value}</h4>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5 lg:pt-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Discuss?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you have a fully formed business plan or just an initial idea, our development committee is ready to listen and assist.
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      Panchayat Bhawan, {villageInfo.name}, {villageInfo.district}, {villageInfo.state} {villageInfo.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <LucideIcons.Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Official Phone</h4>
                    <p className="text-sm text-muted-foreground">+91 8188898587</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <LucideIcons.Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email Inquiries</h4>
                    <p className="text-sm text-muted-foreground">pradumshukla1133@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <InvestorContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
