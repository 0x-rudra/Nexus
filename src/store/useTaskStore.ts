import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, TaskStore, TaskStatus } from '../types';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      focusMode: false,
      addTask: (taskInput) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: taskInput.title,
          description: taskInput.description || '',
          category: taskInput.category || 'General',
          status: taskInput.status || 'todo',
          dueDate: taskInput.dueDate || null,
          priority: taskInput.priority || 'medium',
          estimatedTime: taskInput.estimatedTime,
          checklist: taskInput.checklist || [],
          createdAt: new Date(),
          completedAt: taskInput.status === 'completed' ? new Date() : null,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },
      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
              return {
                ...task,
                status: newStatus,
                completedAt: newStatus === 'completed' ? new Date() : null,
              };
            }
            return task;
          }),
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const updated = { ...task, ...updates };
              // Handle completion logic if status was updated
              if (updates.status && updates.status !== task.status) {
                updated.completedAt = updates.status === 'completed' ? new Date() : null;
              }
              return updated;
            }
            return task;
          }),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      setFocusMode: (active) => set({ focusMode: active }),
      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== 'completed'),
        })),
    }),
    {
      name: 'nexus-tasks-storage-v2', // Changed storage key to force reset due to schema breaking changes
      storage: createJSONStorage(() => localStorage, {
        reviver: (_key, value) => {
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
          return value;
        },
      }),
    }
  )
);
