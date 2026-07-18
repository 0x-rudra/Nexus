import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { TaskItem } from '../tasks/TaskItem';

export const CalendarView: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const tasks = useTaskStore((state) => state.tasks);

  const selectedDateTasks = tasks.filter(
    (task) => task.dueDate && date && isSameDay(task.dueDate, date)
  );

  return (
    <Card className="border-none shadow-md shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle>Calendar</CardTitle>
        <CardDescription>View tasks by their due date.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8 pt-6">
        <div className="flex-shrink-0 bg-background/80 p-3 rounded-2xl border shadow-sm self-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-4 text-primary">
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </h3>
          {selectedDateTasks.length > 0 ? (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed bg-muted/10">
              <p className="text-muted-foreground text-sm font-medium">No tasks scheduled for this date.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Select another date or add a task with a due date.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
