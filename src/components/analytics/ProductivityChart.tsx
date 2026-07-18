import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

export const ProductivityChart: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  // Generate last 7 days data
  const data = React.useMemo(() => {
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

  const totalCompleted = tasks.filter(t => t.status === 'completed').length;

  return (
    <Card className="border-none shadow-md shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-primary/10 transition-all duration-300">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="text-xl">Productivity Pulse</CardTitle>
        <CardDescription>
          Tasks completed over the last 7 days. Total completed: <strong className="text-primary">{totalCompleted}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border)', 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  backgroundColor: 'var(--background)'
                }}
              />
              <Bar 
                dataKey="completed" 
                fill="currentColor" 
                radius={[6, 6, 0, 0]}
                className="fill-primary/80 group-hover:fill-primary transition-colors duration-300"
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
