import React, { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { parseTaskInput } from '@/lib/nlp';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

import { TaskModal } from './TaskModal';

export const TaskInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{ title: string; dueDate: Date | null } | null>(null);
  const addTask = useTaskStore((state) => state.addTask);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const parsed = parseTaskInput(value);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const { title, dueDate } = parseTaskInput(inputValue);
    addTask({ 
      title, 
      dueDate, 
      status: 'todo', 
      priority: 'medium', 
      category: 'General', 
      checklist: [] 
    });
    setInputValue('');
    setParsedPreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full mb-12 z-10">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-30 group-focus-within:opacity-100 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center shadow-lg rounded-2xl bg-card/90 backdrop-blur border overflow-hidden transition-all duration-300">
          <div className="pl-5 text-muted-foreground">
            <Sparkles size={20} className="text-primary/70" />
          </div>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="What needs to be done? (e.g., 'Team meeting tomorrow at 2pm')"
            className="border-0 shadow-none focus-visible:ring-0 text-base md:text-lg py-8 pl-4 pr-32 bg-transparent placeholder:text-muted-foreground/60 font-medium"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Advanced Details"
            >
              <Sparkles size={18} />
            </Button>
            <Button
              type="submit"
              disabled={!inputValue.trim()}
              className="rounded-xl h-12 px-5 transition-all hover:scale-[1.03] active:scale-[0.97] bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
            >
              <Plus size={20} className="mr-1.5" /> Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* NLP Preview Panel */}
      {parsedPreview && (parsedPreview.title !== inputValue || parsedPreview.dueDate) && (
        <div className="absolute -bottom-14 left-6 flex items-center gap-3 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 backdrop-blur-md px-4 py-2 rounded-full shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
          <Sparkles size={14} className="text-primary/70" />
          <span className="max-w-[200px] truncate">"{parsedPreview.title}"</span>
          {parsedPreview.dueDate && (
            <>
              <div className="w-px h-3 bg-primary/30" />
              <CalendarIcon size={14} />
              <span>{format(parsedPreview.dueDate, 'MMM d, h:mm a')}</span>
            </>
          )}
        </div>
      )}

      <TaskModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </form>
  );
};
