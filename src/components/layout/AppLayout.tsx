import React from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-background/95 text-foreground overflow-hidden selection:bg-primary/20">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg leading-none">N</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Nexus Tasks</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={20} />
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="p-4 md:p-8 pt-6 lg:pt-10 w-full max-w-5xl mx-auto min-h-full flex flex-col transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
