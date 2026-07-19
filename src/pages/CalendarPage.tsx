import React, { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay, isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TaskModal } from '@/components/tasks/TaskModal';

export const CalendarPage: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPriorityColor = (priority: string, isCompleted: boolean) => {
    if (isCompleted) return 'bg-muted text-muted-foreground line-through opacity-60 border-transparent';
    switch (priority) {
      case 'high': return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30';
      case 'low': return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto pb-8 animate-in fade-in zoom-in-95 duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground text-lg">Your monthly overview.</p>
        </div>

        <div className="flex items-center gap-2 bg-card border shadow-sm p-1.5 rounded-xl">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-lg hover:bg-muted">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="ghost" onClick={goToToday} className="rounded-lg font-medium hover:bg-muted px-4">
            Today
          </Button>
          <div className="w-[140px] text-center font-bold text-lg">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-lg hover:bg-muted">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-card border rounded-2xl shadow-xl shadow-primary/5 overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {days.map((day, i) => {
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            dayTasks.sort((a, b) => {
              if (a.status !== 'completed' && b.status === 'completed') return -1;
              if (a.status === 'completed' && b.status !== 'completed') return 1;
              const pMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
              return pMap[b.priority] - pMap[a.priority];
            });

            const displayTasks = dayTasks.slice(0, 4);
            const hasMore = dayTasks.length > 4;

            return (
              <div
                key={day.toString()}
                className={cn(
                  'min-h-[120px] p-1.5 border-r border-b transition-colors hover:bg-accent/5',
                  !isCurrentMonth && 'bg-muted/10 opacity-50',
                  (i + 1) % 7 === 0 && 'border-r-0'
                )}
              >
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className={cn(
                    'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                    isDayToday ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground'
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  {displayTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setEditingTaskId(task.id)}
                      className={cn(
                        'text-xs px-2 py-1 rounded-md truncate cursor-pointer transition-transform hover:scale-[1.02] border border-transparent shadow-sm',
                        getPriorityColor(task.priority, task.status === 'completed')
                      )}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {hasMore && (
                    <div className="text-[10px] font-semibold text-muted-foreground px-2 mt-0.5">
                      + {dayTasks.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingTaskId && (
        <TaskModal
          open={!!editingTaskId}
          onOpenChange={(open) => !open && setEditingTaskId(null)}
          taskId={editingTaskId}
        />
      )}
    </div>
  );
};
