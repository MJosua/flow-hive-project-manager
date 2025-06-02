import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon } from 'lucide-react';

interface ManageCategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const ManageCategoriesModal = ({ open, onOpenChange, projectId }: ManageCategoriesModalProps) => {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Frontend', color: '#3B82F6', description: 'UI/UX related tasks' },
    { id: '2', name: 'Backend', color: '#10B981', description: 'Server and API development' },
    { id: '3', name: 'Design', color: '#F59E0B', description: 'Design and visual assets' },
    { id: '4', name: 'Testing', color: '#EF4444', description: 'QA and testing tasks' }
  ]);

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        ...newCategory
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', color: '#3B82F6', description: '' });
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleUpdateCategory = (id: string, field: string, value: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Categories Data:', {
      projectId,
      categories
    });
    // Here you'll connect to backend
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Project Categories</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing Categories */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Current Categories</Label>
            {categories.map((category) => (
              <div key={category.id} className="grid grid-cols-4 gap-4 p-4 border rounded-lg items-end">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input
                    value={category.name}
                    onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      value={category.color}
                      onChange={(e) => handleUpdateCategory(category.id, 'color', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Badge style={{ backgroundColor: category.color, color: 'white' }}>
                      {category.name}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={category.description}
                    onChange={(e) => handleUpdateCategory(category.id, 'description', e.target.value)}
                    placeholder="Category description"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Category */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-lg font-semibold">Add New Category</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-12 h-10"
                  />
                  <Input
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>
            </div>
            <Button type="button" onClick={handleAddCategory} variant="outline">
              Add Category
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
              Save Categories
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCategoriesModal;
