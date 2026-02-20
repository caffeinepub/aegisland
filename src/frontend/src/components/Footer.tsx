import { SiGithub, SiX } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'aegisland';

  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">AegisLand</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Blockchain-powered national land registry system built on the Internet Computer Protocol.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="/search" 
                  className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  Search Properties
                </a>
              </li>
              <li>
                <a 
                  href="/dashboard" 
                  className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/register" 
                  className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  Register Property
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-foreground"
                aria-label="GitHub"
              >
                <SiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-foreground"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {currentYear} AegisLand. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors duration-200 hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
