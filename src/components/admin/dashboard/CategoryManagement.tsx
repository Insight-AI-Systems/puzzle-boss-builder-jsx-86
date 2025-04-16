
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Trash2, Edit, Plus, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample puzzle categories data
const sampleCategories = [
  { 
    id: "1", 
    name: "Smartphones", 
    imageUrl: "/placeholder.svg", 
    puzzleCount: 12, 
    activeCount: 4,
    status: "active" 
  },
  { 
    id: "2", 
    name: "Laptops", 
    imageUrl: "/placeholder.svg", 
    puzzleCount: 8, 
    activeCount: 2,
    status: "active" 
  },
  { 
    id: "3", 
    name: "Headphones", 
    imageUrl: "/placeholder.svg", 
    puzzleCount: 6, 
    activeCount: 3,
    status: "active" 
  },
  { 
    id: "4", 
    name: "Smartwatches", 
    imageUrl: "/placeholder.svg", 
    puzzleCount: 5, 
    activeCount: 2,
    status: "inactive" 
  },
  { 
    id: "5", 
    name: "Gaming Consoles", 
    imageUrl: "/placeholder.svg", 
    puzzleCount: 7, 
    activeCount: 4,
    status: "active" 
  },
];

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState(sampleCategories);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const handleEditCategory = (category: any) => {
    setEditingCategory({...category});
  };
  
  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
    }
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };
  
  const handleAddCategory = () => {
    const newCategory = {
      id: `${Date.now()}`,
      name: "New Category",
      imageUrl: "/placeholder.svg",
      puzzleCount: 0,
      activeCount: 0,
      status: "inactive"
    };
    
    setCategories([...categories, newCategory]);
    setEditingCategory(newCategory);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Category Management
          </CardTitle>
          <CardDescription>Manage puzzle categories and items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Categories</h3>
              <p className="text-sm text-muted-foreground">
                {categories.length} total categories, {categories.filter(c => c.status === "active").length} active
              </p>
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Puzzles</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img 
                          src={category.imageUrl} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.puzzleCount} puzzles</TableCell>
                    <TableCell>{category.activeCount} active</TableCell>
                    <TableCell>
                      <Badge variant={category.status === "active" ? "default" : "secondary"}>
                        {category.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                              Make changes to the category details below.
                            </DialogDescription>
                          </DialogHeader>
                          
                          {editingCategory && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  value={editingCategory.name}
                                  onChange={(e) => setEditingCategory({
                                    ...editingCategory,
                                    name: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                  id="status"
                                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  value={editingCategory.status}
                                  onChange={(e) => setEditingCategory({
                                    ...editingCategory,
                                    status: e.target.value
                                  })}
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleSaveCategory}>Save Changes</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Categories will be available for puzzle creation once activated.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
