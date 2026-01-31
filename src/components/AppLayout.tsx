import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import prepmateLogo from '@/assets/prepmate-logo.png';
import {
  LayoutDashboard,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Compass,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Career Guidance', href: '/career', icon: Compass },
  { name: 'Study Planner', href: '/planner', icon: Calendar },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={prepmateLogo} alt="PrepMate" className="h-9 w-auto" />
            <span className="font-bold text-foreground text-lg">PrepMate</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden fixed top-14 left-0 right-0 z-40 bg-card border-b border-border transform transition-transform duration-200",
        mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:overflow-y-auto lg:bg-sidebar lg:pb-4">
        <Link to="/" className="flex h-20 shrink-0 items-center gap-3 px-6 hover:opacity-90 transition-opacity border-b border-sidebar-border">
          <img src={prepmateLogo} alt="PrepMate" className="h-11 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">PrepMate</h1>
            <p className="text-xs text-sidebar-foreground/60">Shape Your Career</p>
          </div>
        </Link>

        <nav className="mt-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-8">
          {/* Theme toggle in sidebar */}
          <div className="flex items-center justify-between px-4 py-2 mb-4">
            <span className="text-sm text-sidebar-foreground/70">Theme</span>
            <ThemeToggle />
          </div>
          
          <div className="rounded-2xl bg-sidebar-accent p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-sidebar-primary/20 flex items-center justify-center ring-2 ring-sidebar-primary/30">
                <span className="text-sidebar-foreground font-semibold text-sm">
                  {profile?.display_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {profile?.display_name || 'Student'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-border"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
