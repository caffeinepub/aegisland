import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, FileCheck, Users, Search, Zap } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Immutable Records',
      description: 'Land ownership records secured by blockchain technology, preventing fraud and duplication.',
    },
    {
      icon: Lock,
      title: 'Secure Identity',
      description: 'Internet Identity integration ensures secure, privacy-preserving authentication.',
    },
    {
      icon: FileCheck,
      title: 'Document Verification',
      description: 'Cryptographic hashing of deeds and documents for tamper-proof verification.',
    },
    {
      icon: Users,
      title: 'Multi-Signature Governance',
      description: 'Government authorities collaborate through secure multi-signature approvals.',
    },
    {
      icon: Search,
      title: 'Public Search',
      description: 'Transparent property search and ownership verification for all citizens.',
    },
    {
      icon: Zap,
      title: 'Automated Transfers',
      description: 'Smart contracts automate property transfers with built-in compliance checks.',
    },
  ];

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container relative z-10 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <Shield className="h-4 w-4" />
              Government-Grade Security
            </div>
            <h1 className="mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Blockchain-Based National Land Registry
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Eliminate land fraud with immutable ownership records, automated transfers, and transparent verification
              on the Internet Computer Protocol.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                asChild 
                size="lg" 
                className="h-12 px-8 text-base shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Search Properties
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="h-12 px-8 text-base transition-all duration-200 hover:bg-muted active:scale-95"
              >
                <Link to="/register">Register Property</Link>
              </Button>
            </div>
          </div>
        </div>
        <div 
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, rgb(128 128 128 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(128 128 128 / 0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="container py-24 md:py-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">Enterprise-Grade Features</h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Built with world-class engineering standards for government and institutional use.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-border/50 bg-card shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 text-5xl font-semibold text-primary md:text-6xl">100%</div>
              <div className="text-sm font-medium text-muted-foreground">Immutable Records</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-5xl font-semibold text-primary md:text-6xl">Zero</div>
              <div className="text-sm font-medium text-muted-foreground">Title Duplication</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-5xl font-semibold text-primary md:text-6xl">24/7</div>
              <div className="text-sm font-medium text-muted-foreground">Public Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 md:py-32">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <CardTitle className="text-3xl md:text-4xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-base leading-relaxed md:text-lg">
              Search existing properties or register new land parcels on the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              asChild 
              size="lg"
              className="h-12 px-8 shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <Link to="/search">Search Properties</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="h-12 px-8 transition-all duration-200 hover:bg-muted active:scale-95"
            >
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
