import React from 'react';
import type { Task } from '@/types';
import { useTaskStore } from '@/store/useTaskStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Trash2, Clock, CheckCircle2, Tag, Timer } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
}

const PriorityIndicator = ({ priority }: { priority: string }) => {
  if (priority === 'high') return <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-destructive/80 to-destructive/20 opacity-100" />;
  if (priority === 'medium') return <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/80 to-orange-500/20 opacity-100" />;
  return <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/80 to-blue-500/20 opacity-100" />;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(task.title);
  const updateTask = useTaskStore((state) => state.updateTask);

  const isCompleted = task.status === 'completed';

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== task.title) {
      updateTask(task.id, { title: editValue.trim() });
    } else {
      setEditValue(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, h:mm a');
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && !isCompleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
      className={cn(
        "group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 overflow-hidden",
        isCompleted 
          ? "bg-muted/30 border-transparent shadow-none" 
          : "bg-card/80 backdrop-blur-sm border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5",
        isEditing && "ring-2 ring-primary/20 border-primary/50"
      )}
    >
      {/* Priority indicator strip */}
      {!isCompleted && <PriorityIndicator priority={task.priority} />}

      <div className="flex items-start gap-5 flex-1 overflow-hidden z-10">
        <div className="flex-shrink-0 pt-0.5">
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={() => toggleTaskStatus(task.id)} 
            className={cn(
              "h-6 w-6 rounded-full transition-all duration-300",
              isCompleted ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white shadow-sm" : "border-muted-foreground/30 hover:border-primary"
            )}
          />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="text-base font-semibold bg-transparent outline-none border-b border-primary/50 focus:border-primary py-0.5 w-full text-foreground"
            />
          ) : (
            <span 
              onClick={() => !isCompleted && setIsEditing(true)}
              className={cn(
                "text-base font-semibold truncate transition-all duration-300 cursor-text",
                isCompleted ? "text-muted-foreground line-through font-medium" : "text-foreground hover:text-primary/80"
              )}
            >
              {task.title}
            </span>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.category && (
              <span className={cn(
                "flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors",
                isCompleted ? "bg-muted text-muted-foreground" : "bg-accent/40 text-accent-foreground border border-accent/20"
              )}>
                <Tag size={10} />
                {task.category}
              </span>
            )}

            {task.dueDate && (
              <span 
                className={cn(
                  "flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors border",
                  isOverdue 
                    ? "bg-destructive/10 text-destructive border-destructive/20" 
                    : isCompleted 
                      ? "text-muted-foreground border-transparent" 
                      : "bg-primary/10 text-primary border-primary/20"
                )}
              >
                {isOverdue ? <Clock size={10} /> : <CalendarIcon size={10} />}
                {formatDueDate(task.dueDate)}
              </span>
            )}

            {task.estimatedTime && !isCompleted && (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full text-muted-foreground bg-muted/50 border border-border">
                <Timer size={10} />
                {task.estimatedTime}m
              </span>
            )}
            
            {task.completedAt && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-1">
                <CheckCircle2 size={11} className="text-green-500" />
                Done {format(task.completedAt, 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 ml-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => deleteTask(task.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </motion.div>
  );
};
