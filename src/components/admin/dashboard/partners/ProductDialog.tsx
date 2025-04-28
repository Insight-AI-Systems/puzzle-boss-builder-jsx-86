
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePartnerManagement, PartnerProduct } from '@/hooks/admin/usePartnerManagement';
import { useCategories } from '@/hooks/useCategories';

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().refine(
    val => !isNaN(Number(val)) && Number(val) >= 0, 
    { message: "Price must be a valid number" }
  ),
  quantity: z.string().refine(
    val => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), 
    { message: "Quantity must be a valid integer" }
  ),
  status: z.enum(['draft', 'pending_approval', 'approved', 'rejected']),
  category_id: z.string().optional(),
  shipping_info: z.object({
    origin: z.string().optional(),
    weight: z.string().optional(),
    dimensions: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  editProduct?: PartnerProduct;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ 
  open, 
  onOpenChange,
  partnerId,
  editProduct 
}) => {
  const { createProduct, updateProduct } = usePartnerManagement(partnerId);
  const { data: categories } = useCategories();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editProduct ? {
      name: editProduct.name,
      description: editProduct.description,
      price: editProduct.price.toString(),
      quantity: editProduct.quantity.toString(),
      status: editProduct.status,
      category_id: editProduct.category_id || undefined,
      shipping_info: {
        origin: editProduct.shipping_info?.origin || '',
        weight: editProduct.shipping_info?.weight || '',
        dimensions: editProduct.shipping_info?.dimensions || '',
        notes: editProduct.shipping_info?.notes || '',
      }
    } : {
      name: '',
      description: '',
      price: '',
      quantity: '',
      status: 'draft',
      category_id: undefined,
      shipping_info: {
        origin: '',
        weight: '',
        dimensions: '',
        notes: ''
      }
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const productData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
      status: data.status,
      category_id: data.category_id || null,
      shipping_info: data.shipping_info,
      partner_id: partnerId,
    };
    
    if (editProduct) {
      updateProduct(editProduct.id, productData);
    } else {
      createProduct(productData);
    }
    
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {editProduct 
              ? 'Update the product information below.' 
              : 'Fill out the form below to add a new product from this partner.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending_approval">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed product description"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Shipping Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shipping_info.origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ship From Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_info.weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2.5 kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_info.dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10 x 5 x 3 in" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shipping_info.notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional shipping information or requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
