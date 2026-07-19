import React, { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const TaskList: React.FC<{ allowEditing?: boolean }> = ({ allowEditing = true }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (b.priority === 'high' && a.priority !== 'high') return 1;
    if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {sortedPendingTasks.map(task => (
            <div
              key={task.id}
              onClick={() => allowEditing && setEditingTaskId(task.id)}
              className={allowEditing ? 'cursor-pointer' : ''}
            >
              <TaskItem task={task} />
            </div>
          ))}
        </AnimatePresence>

        {sortedPendingTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-primary/20 bg-primary/5"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">You're all caught up!</h3>
            <p className="text-muted-foreground max-w-[250px]">
              Enjoy your free time or add a new task to stay productive.
            </p>
          </motion.div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-2 text-muted-foreground pb-2 border-b">
            <CheckCircle2 size={18} />
            <h3 className="font-medium">Completed ({completedTasks.length})</h3>
          </div>
          <div className="flex flex-col gap-3 opacity-60">
            <AnimatePresence mode="popLayout">
              {completedTasks
                .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
                .map(task => (
                  <div
                    key={task.id}
                    onClick={() => allowEditing && setEditingTaskId(task.id)}
                    className={allowEditing ? 'cursor-pointer' : ''}
                  >
                    <TaskItem task={task} />
                  </div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

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
