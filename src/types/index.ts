import { User, Task, Application } from "@prisma/client";

export type TaskWithCreator = Task & {
  creator: User;
};

export type TaskWithDetails = Task & {
  creator: User;
  _count: {
    applications: number;
  };
};

export type ApplicationWithUserAndTask = Application & {
  user: User;
  task: Task;
};

export interface TaskFormData {
  title: string;
  description: string;
  duration?: string;
  deadline?: string;
}
