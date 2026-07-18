import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTaskStore } from '@/store/useTaskStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChecklistItem } from '@/types';
import { Plus, X } from 'lucide-react';

type TaskFormValues = {
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number | null;
};

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string; // If provided, we are editing
}

export const TaskModal: React.FC<TaskModalProps> = ({ open, onOpenChange, taskId }) => {
  const { tasks, addTask, updateTask } = useTaskStore();
  const existingTask = taskId ? tasks.find(t => t.id === taskId) : undefined;

  const [checklist, setChecklist] = React.useState<ChecklistItem[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = React.useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: 'General',
      priority: 'medium',
      estimatedTime: null,
    }
  });

  const watchPriority = watch('priority');

  useEffect(() => {
    if (open) {
      if (existingTask) {
        reset({
          title: existingTask.title,
          description: existingTask.description || '',
          category: existingTask.category || 'General',
          priority: existingTask.priority,
          estimatedTime: existingTask.estimatedTime || null,
        });
        setChecklist(existingTask.checklist || []);
      } else {
        reset({
          title: '',
          description: '',
          category: 'General',
          priority: 'medium',
          estimatedTime: null,
        });
        setChecklist([]);
      }
    }
  }, [open, existingTask, reset]);

  const addChecklistItem = () => {
    if (newChecklistTitle.trim()) {
      setChecklist([...checklist, { id: crypto.randomUUID(), title: newChecklistTitle.trim(), completed: false }]);
      setNewChecklistTitle('');
    }
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      estimatedTime: data.estimatedTime ? Number(data.estimatedTime) : undefined,
      checklist,
    };

    if (existingTask) {
      updateTask(existingTask.id, finalData);
    } else {
      addTask({
        ...finalData,
        status: 'todo',
        dueDate: null, // could add date picker here later
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {existingTask ? 'Make changes to your task here.' : 'Add a new task with advanced details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title <span className="text-destructive">*</span></label>
            <Input id="title" placeholder="E.g., Complete project proposal" {...register('title', { required: 'Title is required' })} className={errors.title ? 'border-destructive' : ''} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
            <textarea id="description" placeholder="Add more details..." {...register('description')} rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
              <Input id="category" placeholder="E.g., Work, Personal" {...register('category')} />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="estimatedTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Est. Time (mins)</label>
              <Input id="estimatedTime" type="number" placeholder="45" {...register('estimatedTime', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant={watchPriority === 'low' ? 'default' : 'outline'} className={watchPriority === 'low' ? 'bg-blue-500 hover:bg-blue-600' : ''} onClick={() => setValue('priority', 'low')}>Low</Button>
              <Button type="button" variant={watchPriority === 'medium' ? 'default' : 'outline'} className={watchPriority === 'medium' ? 'bg-orange-500 hover:bg-orange-600' : ''} onClick={() => setValue('priority', 'medium')}>Medium</Button>
              <Button type="button" variant={watchPriority === 'high' ? 'default' : 'outline'} className={watchPriority === 'high' ? 'bg-destructive hover:bg-destructive/90' : ''} onClick={() => setValue('priority', 'high')}>High</Button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sub-tasks / Checklist</label>
            <div className="flex gap-2">
              <Input 
                value={newChecklistTitle} 
                onChange={(e) => setNewChecklistTitle(e.target.value)} 
                placeholder="Add sub-task..." 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
              />
              <Button type="button" variant="secondary" onClick={addChecklistItem}><Plus size={16} /></Button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md text-sm">
                  <span>{item.title}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeChecklistItem(item.id)}>
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{existingTask ? 'Save Changes' : 'Create Task'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
