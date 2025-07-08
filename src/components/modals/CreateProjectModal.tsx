
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Calendar } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CustomAttribute {
  name: string;
  value: string;
  type: 'text' | 'number' | 'date';
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    estimated_hours: '',
    budget: '',
    priority: 'medium'
  });
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([]);
  const [isDepartmentLeader, setIsDepartmentLeader] = useState(false);

  useEffect(() => {
    if (user && user.department_id) {
      // Check if user is department leader
      checkDepartmentLeadership();
    }
  }, [user]);

  const checkDepartmentLeadership = async () => {
    try {
      if (user?.department_id) {
        const response = await apiService.getDepartmentDetail(user.department_id.toString());
        setIsDepartmentLeader(response.data?.department_head === user?.user_id);
      }
    } catch (error) {
      console.error('Error checking department leadership:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const projectData = {
        ...formData,
        manager_id: user?.user_id,
        department_id: user?.department_id || 1,
        custom_attributes: customAttributes.reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as Record<string, string>),
        needs_approval: !isDepartmentLeader
      };

      await apiService.createProject(projectData);
      
      toast({
        title: "Success",
        description: isDepartmentLeader 
          ? "Project created successfully" 
          : "Project submitted for approval"
      });
      
      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      estimated_hours: '',
      budget: '',
      priority: 'medium'
    });
    setCustomAttributes([]);
  };

  const addCustomAttribute = () => {
    setCustomAttributes([...customAttributes, { name: '', value: '', type: 'text' }]);
  };

  const removeCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const updateCustomAttribute = (index: number, field: keyof CustomAttribute, value: string) => {
    const updated = [...customAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setCustomAttributes(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          {!isDepartmentLeader && (
            <Badge variant="outline" className="w-fit">
              Requires Department Leader Approval
            </Badge>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <Input
                id="estimated_hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Custom Attributes</Label>
              <Button type="button" onClick={addCustomAttribute} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Attribute
              </Button>
            </div>
            
            {customAttributes.map((attr, index) => (
              <div key={index} className="flex gap-2 mb-2 p-3 border rounded">
                <Input
                  placeholder="Attribute name"
                  value={attr.name}
                  onChange={(e) => updateCustomAttribute(index, 'name', e.target.value)}
                />
                <select
                  value={attr.type}
                  onChange={(e) => updateCustomAttribute(index, 'type', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
                <Input
                  placeholder="Value"
                  type={attr.type}
                  value={attr.value}
                  onChange={(e) => updateCustomAttribute(index, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => removeCustomAttribute(index)}
                  size="sm"
                  variant="outline"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : (isDepartmentLeader ? 'Create Project' : 'Submit for Approval')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
