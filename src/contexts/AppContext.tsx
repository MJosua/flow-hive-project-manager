
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Project, Task, Approval, Notification } from '@/types';
import { mockUsers, mockProjects, mockTasks, mockApprovals, mockNotifications } from '@/data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
  approvals: Approval[];
  notifications: Notification[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  createProject: (project: Omit<Project, 'id'>) => void;
  createTask: (task: Omit<Task, 'id'>) => void;
  updateApproval: (approvalId: string, status: 'approved' | 'rejected', notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users] = useState<User[]>(mockUsers);
  const [aplicationName] = useState("KanCaBoard");

  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentUser] = useState<User>(mockUsers[0]); // Current logged-in user

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const createProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const createTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateApproval = (approvalId: string, status: 'approved' | 'rejected', notes?: string) => {
    setApprovals(prev => prev.map(approval =>
      approval.id === approvalId
        ? { ...approval, status, notes, resolvedAt: new Date() }
        : approval
    ));
  };


  return (
    <AppContext.Provider value={{
      aplicationName,
      currentUser,
      users,
      projects,
      tasks,
      approvals,
      notifications,
      selectedProject,
      setSelectedProject,
      updateTask,
      updateProject,
      createProject,
      createTask,
      updateApproval
    }}>
      {children}
    </AppContext.Provider>
  );
};
