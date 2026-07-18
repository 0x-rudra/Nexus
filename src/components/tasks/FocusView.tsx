import React, { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Play, Pause, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProgressRing } from '@/components/ui/progress-ring';

export const FocusView: React.FC = () => {
  const { tasks, focusMode, setFocusMode, toggleTaskStatus, updateTask } = useTaskStore();

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes pomodoro
  const [isActive, setIsActive] = useState(false);

  const nextTask = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return a.createdAt.getTime() - b.createdAt.getTime();
    })[0];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };
  
  const endFocusSession = () => {
    setIsActive(false);
    setFocusMode(false);
  };

  const handleComplete = () => {
    if (nextTask) {
      toggleTaskStatus(nextTask.id);
      resetTimer();
    }
  };

  const toggleChecklistItem = (taskId: string, checklistItemId: string) => {
    if (!nextTask) return;
    const newChecklist = nextTask.checklist.map(item => 
      item.id === checklistItemId ? { ...item, completed: !item.completed } : item
    );
    updateTask(taskId, { checklist: newChecklist });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  if (!focusMode) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-zinc-950 text-zinc-50 flex items-center justify-center p-4 md:p-8"
      >
        <Button 
          variant="ghost" 
          onClick={endFocusSession}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-12 w-12"
        >
          <X size={24} />
        </Button>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          
          {/* Left Column - Timer */}
          <div className="flex flex-col items-center justify-center space-y-12">
            <ProgressRing 
              progress={progress} 
              size={280} 
              strokeWidth={8}
              color="hsl(var(--primary))"
              backgroundColor="rgba(255,255,255,0.05)"
            >
              <div className="text-6xl font-black tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </div>
              <div className="text-zinc-500 font-medium uppercase tracking-widest text-xs mt-2">
                Focus Session
              </div>
            </ProgressRing>

            <div className="flex items-center gap-4">
              <Button 
                onClick={toggleTimer}
                size="lg"
                className={cn(
                  "h-16 w-32 rounded-2xl text-lg font-bold transition-all duration-300",
                  isActive ? "bg-amber-500 hover:bg-amber-600 text-black" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
              >
                {isActive ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" fill="currentColor" /> Start</>}
              </Button>
              <Button 
                onClick={resetTimer}
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-2xl border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-400"
              >
                <RotateCcw size={24} />
              </Button>
            </div>
          </div>

          {/* Right Column - Task Details */}
          <div className="flex flex-col h-full justify-center space-y-8">
            {nextTask ? (
              <motion.div 
                key={nextTask.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-zinc-500 font-semibold tracking-wider text-sm uppercase mb-3 block">
                    Current Task
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    {nextTask.title}
                  </h2>
                  {nextTask.description && (
                    <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
                      {nextTask.description}
                    </p>
                  )}
                </div>

                {nextTask.checklist && nextTask.checklist.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Checklist</h4>
                    {nextTask.checklist.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => toggleChecklistItem(nextTask.id, item.id)}
                      >
                        <div className="text-zinc-600 group-hover:text-primary transition-colors">
                          {item.completed ? <CheckSquare className="text-primary" size={20} /> : <Square size={20} />}
                        </div>
                        <span className={cn(
                          "text-lg transition-all",
                          item.completed ? "text-zinc-500 line-through" : "text-zinc-200"
                        )}>
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-8">
                  <Button 
                    onClick={handleComplete}
                    className="w-full h-16 rounded-2xl text-lg font-bold bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="mr-3 h-6 w-6" /> Complete Task
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center space-y-6">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 mb-4">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-bold">You're all caught up!</h2>
                <p className="text-zinc-400 text-lg">No more pending tasks to focus on.</p>
                <Button 
                  onClick={endFocusSession}
                  className="mt-8 bg-white text-black hover:bg-zinc-200 h-12 px-8 rounded-xl font-bold"
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
