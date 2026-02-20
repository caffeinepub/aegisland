import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Shield, Search, LayoutDashboard, Menu, Moon, Sun } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    navigate({ to: '/' });
  };

  const navItems = [
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, authRequired: true },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        if (item.authRequired && !isAuthenticated) return null;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:text-foreground ${
              mobile ? 'py-3 px-1' : ''
            }`}
            onClick={() => mobile && setMobileOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">AegisLand</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden transition-all duration-200 hover:bg-muted active:scale-95 md:inline-flex"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden transition-all duration-200 hover:bg-muted active:scale-95 md:inline-flex"
                >
                  <span className="max-w-[120px] truncate">
                    {identity.getPrincipal().toString().slice(0, 8)}...
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleLogin} 
              disabled={isLoggingIn} 
              size="sm" 
              className="hidden transition-all duration-200 hover:shadow-md active:scale-95 md:inline-flex"
            >
              {isLoggingIn ? 'Connecting...' : 'Login'}
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="transition-all duration-200 hover:bg-muted active:scale-95 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-8 pt-8">
                <nav className="flex flex-col gap-1">
                  <NavLinks mobile />
                </nav>
                <div className="flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs">
                        <div className="font-medium text-foreground">Connected</div>
                        <div className="mt-1.5 truncate text-muted-foreground">
                          {identity.getPrincipal().toString().slice(0, 16)}...
                        </div>
                      </div>
                      <Button 
                        onClick={handleLogout} 
                        variant="outline" 
                        size="sm"
                        className="transition-all duration-200 active:scale-95"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleLogin} 
                      disabled={isLoggingIn} 
                      size="sm"
                      className="transition-all duration-200 active:scale-95"
                    >
                      {isLoggingIn ? 'Connecting...' : 'Login'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="transition-all duration-200 active:scale-95"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
