
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scrollarea';
import { Users, Calendar, Target } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import type { Project } from '@/types/projectTypes';

interface ProjectJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: number;
}

export const ProjectJoinModal: React.FC<ProjectJoinModalProps> = ({
  isOpen,
  onClose,
  departmentId
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && departmentId) {
      fetchDepartmentProjects();
    }
  }, [isOpen, departmentId]);

  const fetchDepartmentProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjects({ 
        department_id: departmentId,
        status: 'active',
        allow_join: true 
      });
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching department projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRequest = async (projectId: number, projectName: string) => {
    try {
      await apiService.requestProjectJoin(projectId);
      toast({
        title: "Join Request Sent",
        description: `Your request to join "${projectName}" has been sent to the project manager.`
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send join request",
        variant: "destructive"
      });
    }
  };

  const statusColors: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'planning': 'bg-yellow-100 text-yellow-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    'completed': 'bg-blue-100 text-blue-800',
  };

  const priorityColors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Join Department Projects</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No available projects to join in your department
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.project_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <div className="flex flex-col gap-1">
                          <Badge className={statusColors[project.status]}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className={priorityColors[project.priority]}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.manager_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                        {project.budget && (
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>${project.budget.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button 
                          onClick={() => handleJoinRequest(project.project_id, project.name)}
                          className="w-full"
                          size="sm"
                        >
                          Request to Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
