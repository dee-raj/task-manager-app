import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed?: boolean;
}

export const initialTasks: Task[] = [
  { id: '1', title: 'Task 1', description: 'Description 1', dueDate: new Date() },
  { id: '2', title: 'Task 2', description: 'Description 2', dueDate: new Date() },
  { id: '3', title: 'Task 3', description: 'Description 3', dueDate: new Date() },
];

export const getTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem('tasks');
    if (tasksJson !== null) {
      const tasks: Task[] = JSON.parse(tasksJson);
      return tasks.map(task => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
    }
    return initialTasks;
  } catch (error) {
    console.error('Error retrieving tasks from storage:', error);
    return initialTasks;
  }
};

export const saveTasksToStorage = async (tasks: Task[]): Promise<void> => {
  try {
    const tasksJson = JSON.stringify(tasks);
    await AsyncStorage.setItem('tasks', tasksJson);
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};
