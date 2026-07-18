import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Flame, Timer, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, YAxis, Legend } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AnalyticsPage: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  
  const totalCompleted = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const completionRate = tasks.length ? Math.round((totalCompleted / tasks.length) * 100) : 0;
  
  // Fake streak and focus time for demo purposes as we don't track focus time globally yet
  const currentStreak = totalCompleted > 0 ? 3 : 0;
  const avgFocusTime = totalCompleted > 0 ? '45m' : '0m';

  // Weekly Completion Data
  const weeklyData = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const completedOnDate = tasks.filter(
        (task) => task.status === 'completed' && task.completedAt && isSameDay(new Date(task.completedAt), date)
      ).length;
      return {
        name: format(date, 'EEE'),
        completed: completedOnDate,
      };
    });
  }, [tasks]);

  // Category Distribution Data
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const cat = t.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [tasks]);

  // Task Status Data
  const statusData = [
    { name: 'Completed', value: totalCompleted },
    { name: 'Pending', value: pendingTasks },
    { name: 'Overdue', value: tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()).length }
  ];

  // GitHub style Heatmap (last 30 days)
  const heatmapData = React.useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => {
      const date = subDays(new Date(), 34 - i);
      const completedOnDate = tasks.filter(
        (task) => task.status === 'completed' && task.completedAt && isSameDay(new Date(task.completedAt), date)
      ).length;
      return { date, count: completedOnDate };
    });
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="h-32 w-32 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <BarChart3 size={64} className="text-primary/40" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">No productivity data yet</h2>
        <p className="text-muted-foreground text-lg max-w-md">
          Complete a few tasks to unlock insights, trends, and productivity analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-lg">Review your productivity trends and insights.</p>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <StatCard 
          title="Total Completed" 
          value={totalCompleted} 
          icon={<CheckCircle2 className="text-green-500" />} 
          delay={0.1}
          className="bg-card"
        />
        <StatCard 
          title="Current Streak" 
          value={`${currentStreak} Days`} 
          icon={<Flame className="text-orange-500" />} 
          delay={0.2}
        />
        <StatCard 
          title="Average Focus Time" 
          value={avgFocusTime} 
          icon={<Timer className="text-blue-500" />} 
          delay={0.3}
        />
        <StatCard 
          title="Productivity Score" 
          value={`${completionRate}%`} 
          icon={<TrendingUp className="text-indigo-500" />} 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion */}
        <Card className="border-none shadow-md bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Completion</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'var(--primary)', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]} className="fill-primary" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Trend */}
        <Card className="border-none shadow-md bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Completion Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-none shadow-md bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card className="border-none shadow-md bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Task Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={2} dataKey="value">
                  <Cell fill="#10b981" /> {/* Completed */}
                  <Cell fill="#3b82f6" /> {/* Pending */}
                  <Cell fill="#ef4444" /> {/* Overdue */}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity Heatmap */}
        <Card className="border-none shadow-md bg-card/80 backdrop-blur-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Productivity Heatmap (Last 35 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mt-4">
              {heatmapData.map((day, i) => (
                <div
                  key={i}
                  title={`${format(day.date, 'MMM d')}: ${day.count} tasks`}
                  className={`w-8 h-8 rounded-md transition-all hover:scale-110 cursor-pointer
                    ${day.count === 0 ? 'bg-muted' : 
                      day.count === 1 ? 'bg-primary/30' : 
                      day.count === 2 ? 'bg-primary/60' : 
                      day.count === 3 ? 'bg-primary/80' : 'bg-primary'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-sm bg-muted" />
                <div className="w-4 h-4 rounded-sm bg-primary/30" />
                <div className="w-4 h-4 rounded-sm bg-primary/60" />
                <div className="w-4 h-4 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
