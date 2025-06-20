
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Building2, Search } from 'lucide-react';
import { useDepartments, useCreateTeam, useUpdateTeam, useDeleteTeam } from '@/hooks/useApiData';

const DivisionManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<any>(null);
  const [newDivision, setNewDivision] = useState({
    department_name: '',
    description: '',
    department_head: '',
  });

  const { data: departments = [], isLoading, error } = useDepartments();
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const filteredDivisions = departments.filter(dept =>
    dept.department_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDivision = async () => {
    try {
      await createTeamMutation.mutateAsync({
        team_name: newDivision.department_name,
        department_id: 'default-dept',
        creation_date: new Date(),
        member_count: 0,
      });
      setNewDivision({ department_name: '', description: '', department_head: '' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating division:', error);
    }
  };

  const handleUpdateDivision = async () => {
    if (!editingDivision) return;
    
    try {
      await updateTeamMutation.mutateAsync({
        id: editingDivision.department_id,
        data: {
          team_name: editingDivision.department_name,
        },
      });
      setEditingDivision(null);
    } catch (error) {
      console.error('Error updating division:', error);
    }
  };

  const handleDeleteDivision = async (divisionId: string) => {
    if (window.confirm('Are you sure you want to delete this division?')) {
      try {
        await deleteTeamMutation.mutateAsync(divisionId);
      } catch (error) {
        console.error('Error deleting division:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading divisions...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading divisions</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Division Management</h1>
            <p className="text-gray-600">Manage organizational divisions and departments</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Add Division
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Division</DialogTitle>
                <DialogDescription>
                  Add a new division to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Division Name</Label>
                  <Input
                    id="name"
                    value={newDivision.department_name}
                    onChange={(e) => setNewDivision({ ...newDivision, department_name: e.target.value })}
                    placeholder="Enter division name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newDivision.description}
                    onChange={(e) => setNewDivision({ ...newDivision, description: e.target.value })}
                    placeholder="Enter division description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDivision}>
                  Create Division
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Divisions</span>
              <Badge variant="secondary" className="ml-auto">
                {filteredDivisions.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Overview of all organizational divisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search divisions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDivisions.map((division) => (
                  <TableRow key={division.department_id}>
                    <TableCell className="font-medium">{division.department_name}</TableCell>
                    <TableCell>{division.description || 'No description'}</TableCell>
                    <TableCell>
                      <Badge variant={!division.is_deleted ? 'default' : 'secondary'}>
                        {!division.is_deleted ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDivision(division)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDivision(division.department_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingDivision} onOpenChange={() => setEditingDivision(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Division</DialogTitle>
              <DialogDescription>
                Update division information
              </DialogDescription>
            </DialogHeader>
            {editingDivision && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Division Name</Label>
                  <Input
                    id="edit-name"
                    value={editingDivision.department_name}
                    onChange={(e) => setEditingDivision({ ...editingDivision, department_name: e.target.value })}
                    placeholder="Enter division name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingDivision.description || ''}
                    onChange={(e) => setEditingDivision({ ...editingDivision, description: e.target.value })}
                    placeholder="Enter division description"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingDivision(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDivision}>
                Update Division
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DivisionManagement;
