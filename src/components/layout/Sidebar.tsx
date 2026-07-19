import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar as CalendarIcon, BarChart3, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/useTaskStore';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { setFocusMode, tasks } = useTaskStore();

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/80 backdrop-blur-md px-4 py-6 justify-between h-full transition-all duration-300">
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Nexus Tasks</h1>
        </div>

        <nav className="space-y-1.5">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={<ListTodo size={18} />} label="Tasks" to="/tasks" />
          <SidebarItem icon={<CalendarIcon size={18} />} label="Calendar" to="/calendar" />
          <SidebarItem icon={<BarChart3 size={18} />} label="Analytics" to="/analytics" />
        </nav>
      </div>

      <div className="space-y-6">
        <div className="px-2 space-y-1">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Pending</span>
            <span className="text-foreground">{pendingCount}</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Completed</span>
            <span className="text-foreground">{completedCount}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-accent/50 to-accent/10 border border-accent/20 p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h4 className="text-sm font-bold mb-1 relative z-10 text-foreground">Focus Mode</h4>
          <p className="text-xs text-muted-foreground mb-4 relative z-10 font-medium">Eliminate distractions and focus on your next task.</p>
          <Button
            onClick={() => setFocusMode(true)}
            variant="outline"
            className="w-full font-semibold border-primary/30 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm relative z-10"
            size="sm"
          >
            Enable Focus
          </Button>
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </NavLink>
  );
};
