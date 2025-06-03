import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskAssignmentDialog } from '@/components/tasks/TaskAssignmentDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const Kanban = () => {
  const { projects, selectedProject, setSelectedProject, currentUser } = useApp();
  const { searchQuery } = useSearch();
  const isTeamLead = currentUser.role === 'admin' || currentUser.role === 'manager';

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600">
            Manage tasks with drag-and-drop interface
            {searchQuery && (
              <span className="ml-2 text-sm text-yellow-600">
                • Filtering by: "{searchQuery}"
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select 
            value={selectedProject?.id || 'all'} 
            onValueChange={(value) => {
              const project = value === 'all' ? null : projects.find(p => p.id === value);
              setSelectedProject(project || null);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          {isTeamLead && <TaskAssignmentDialog />}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </Layout>
  );
};

export default Kanban;
