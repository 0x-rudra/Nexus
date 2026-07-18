import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTaskStore } from '@/store/useTaskStore';
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

export const MiniAnalyticsWidget: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);

  const data = React.useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const date = subDays(new Date(), 4 - i);
      const completedCount = tasks.filter(
        (task) => task.status === 'completed' && task.completedAt && isSameDay(new Date(task.completedAt), date)
      ).length;

      return {
        name: format(date, 'EEE'),
        completed: completedCount,
      };
    });
  }, [tasks]);

  return (
    <Card className="border-none shadow-md shadow-primary/5 bg-card/80 backdrop-blur-md h-full flex flex-col group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={5}
            />
            <Tooltip 
              cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid var(--border)', 
                backgroundColor: 'var(--background)',
                fontSize: '12px',
                padding: '4px 8px'
              }}
            />
            <Bar 
              dataKey="completed" 
              radius={[4, 4, 0, 0]}
              className="fill-primary/70 group-hover:fill-primary transition-colors duration-300"
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
