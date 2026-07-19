import React from 'react';
import { TaskInput } from '@/components/tasks/TaskInput';
import { TaskList } from '@/components/tasks/TaskList';

export const TasksPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-20 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">All Tasks</h1>
        <p className="text-muted-foreground text-lg">Manage, create, and organize your tasks.</p>
      </div>

      <div className="space-y-6">
        <TaskInput />
        <TaskList allowEditing={true} />
      </div>
    </div>
  );
};
