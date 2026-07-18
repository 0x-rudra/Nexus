import * as chrono from 'chrono-node';

export interface ParseResult {
  title: string;
  dueDate: Date | null;
}

export const parseTaskInput = (input: string): ParseResult => {
  const results = chrono.parse(input);
  
  if (results.length === 0) {
    return { title: input.trim(), dueDate: null };
  }

  // Get the first parsed date
  const parsedDate = results[0];
  const date = parsedDate.start.date();
  
  // Remove the text that matched the date to get a clean title
  const title = input.replace(parsedDate.text, '').replace(/\s+/g, ' ').trim();
  
  // Clean up hanging prepositions (like "on", "at") if left at the end
  const cleanTitle = title.replace(/\b(on|at|in|by|for)\s*$/i, '').trim();
  
  return { title: cleanTitle || "New Task", dueDate: date };
};
