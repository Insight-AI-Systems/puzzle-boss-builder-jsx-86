
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  PlusCircle, 
  Edit, 
  Trash2,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { usePartnerManagement, PartnerProduct } from '@/hooks/admin/usePartnerManagement';
import ProductDialog from './ProductDialog';
import { Badge } from "@/components/ui/badge";

interface ProductManagementProps {
  partnerId: string;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ partnerId }) => {
  const { products, deleteProduct } = usePartnerManagement(partnerId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PartnerProduct | null>(null);

  const handleEdit = (product: PartnerProduct) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: PartnerProduct) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Partner Products</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description.length > 60 
                          ? `${product.description.substring(0, 60)}...` 
                          : product.description}
                      </div>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(product.status)}`}>
                        {formatStatus(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(product.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
              <p className="text-gray-500 mb-6">
                This partner doesn't have any products yet. Add their first product to get started.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        partnerId={partnerId}
      />

      {selectedProduct && (
        <ProductDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          partnerId={partnerId}
          editProduct={selectedProduct}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
