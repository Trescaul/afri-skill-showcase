import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Star, Shield, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Create Skill Card', path: '/create' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Donate', path: '/donate' },
];

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const isActivePath = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 hero-gradient rounded-lg">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="font-bold text-xl text-foreground">
                Skill Card <span className="text-accent">Africa</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActivePath(item.path)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {!loading && (
                user ? (
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="text-muted-foreground">{user.email}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button variant="hero" size="sm" asChild className="ml-4">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <nav className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-2 py-2 rounded-md text-sm font-medium transition-colors",
                      isActivePath(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {!loading && (
                  user ? (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center space-x-2 px-2 py-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }} 
                        className="flex items-center space-x-2 px-2 py-2 w-full text-left hover:bg-muted rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-t pt-4 mt-4">
                      <Link 
                        to="/auth" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="block px-2 py-2 hover:bg-muted rounded-md"
                      >
                        Sign In
                      </Link>
                    </div>
                  )
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 hero-gradient rounded-md">
                  <Star className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-foreground">
                  Skill Card <span className="text-accent">Africa</span>
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Empowering skilled professionals across Africa to showcase their talents, 
                build trust, and connect with opportunities.
              </p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Trusted by professionals across Africa</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigationItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: afriskill@gmail.com</p>
                <p>Phone: 0794780808</p>
                <p>Building trust across Africa</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Skill Card Africa. Founded by Francis Ndungu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}