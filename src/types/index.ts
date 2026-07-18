export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: TaskStatus;
  dueDate: Date | null;
  priority: Priority;
  estimatedTime?: number; // in minutes
  checklist: ChecklistItem[];
  createdAt: Date;
  completedAt: Date | null;
}

export interface TaskStore {
  tasks: Task[];
  focusMode: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'checklist'> & { checklist?: ChecklistItem[] }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  setFocusMode: (active: boolean) => void;
  clearCompleted: () => void;
}
