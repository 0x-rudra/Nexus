import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTaskStore } from '@/store/useTaskStore';
import { DayPicker } from 'react-day-picker';
import { isSameDay } from 'date-fns';

export const MiniCalendarWidget: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  
  // Custom modifier to show dots under days with tasks
  const modifiers = {
    hasTask: (date: Date) => tasks.some(t => t.dueDate && isSameDay(new Date(t.dueDate), date) && t.status !== 'completed'),
    hasCompleted: (date: Date) => tasks.some(t => t.completedAt && isSameDay(new Date(t.completedAt), date)),
  };

  const modifiersStyles = {
    hasTask: { 
      fontWeight: 'bold',
      textDecoration: 'underline',
      textDecorationColor: 'var(--primary)',
      textUnderlineOffset: '4px'
    },
    hasCompleted: {
      color: 'var(--primary)'
    }
  };

  return (
    <Card className="border-none shadow-md shadow-primary/5 bg-card/80 backdrop-blur-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Calendar Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-6">
        <style>{`
          .rdp {
            --rdp-cell-size: 32px !important;
            --rdp-accent-color: hsl(var(--primary));
            --rdp-background-color: hsl(var(--primary) / 0.1);
            margin: 0;
          }
          .rdp-day_selected {
            font-weight: bold;
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={new Date()}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          showOutsideDays
          className="border-none"
        />
      </CardContent>
    </Card>
  );
};
