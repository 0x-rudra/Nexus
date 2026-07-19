import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskList } from '@/components/tasks/TaskList';
import { StatCard } from '@/components/ui/stat-card';
import { CheckCircle2, Target, Flame, TrendingUp } from 'lucide-react';
import { isToday } from 'date-fns';

export const Dashboard: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const tasksDueToday = tasks.filter(t => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== 'completed').length;
  const completedToday = tasks.filter(t => t.completedAt && isToday(new Date(t.completedAt))).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks ? Math.round((tasks.filter(t => t.status === 'completed').length / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-20 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-1">
          {getGreeting()} 👋
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {todayStr} • You have <strong className="text-primary">{tasksDueToday}</strong> tasks due today.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <StatCard
          title="Tasks Due Today"
          value={tasksDueToday}
          icon={<Target className="text-blue-500" />}
          delay={0.1}
          className="bg-card"
        />
        <StatCard
          title="Completed Today"
          value={completedToday}
          icon={<CheckCircle2 className="text-green-500" />}
          trend={completedToday > 0 ? 'up' : 'neutral'}
          trendValue={completedToday > 0 ? '+1' : '0'}
          delay={0.2}
        />
        <StatCard
          title="Current Streak"
          value={completedToday > 0 ? 1 : 0}
          subtitle="Days in a row"
          icon={<Flame className="text-orange-500" />}
          delay={0.3}
        />
        <StatCard
          title="Productivity Score"
          value={`${completionRate}%`}
          subtitle="Overall completion"
          icon={<TrendingUp className="text-indigo-500" />}
          delay={0.4}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Today's Tasks Overview</h2>
        </div>
        <TaskList allowEditing={false} />
      </div>
    </div>
  );
};
