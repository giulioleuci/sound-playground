import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface ModuleLayoutProps {
  moduleNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  nextModule?: { path: string; title: string };
  prevModule?: { path: string; title: string };
}

export const ModuleLayout = ({
  moduleNumber,
  title,
  description,
  children,
  nextModule,
  prevModule,
}: ModuleLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="text-border">/</span>
            <div className="flex items-center gap-2">
              <span className="info-badge">Modulo {moduleNumber}</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            {prevModule && (
              <Link 
                to={prevModule.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{prevModule.title}</span>
              </Link>
            )}
            {prevModule && nextModule && <span className="text-border">|</span>}
            {nextModule && (
              <Link 
                to={nextModule.path}
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                {nextModule.title} →
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Title section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Module content */}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
