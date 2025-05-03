
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Edit, Trash2, Save } from 'lucide-react';
import { UserAddress, AddressType } from '@/types/memberTypes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ProfileAddressTabProps {
  addresses: UserAddress[];
  upsertAddress: any;
  deleteAddress: any;
}

export function ProfileAddressTab({ addresses, upsertAddress, deleteAddress }: ProfileAddressTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<UserAddress> & { id?: string }>({
    address_type: 'billing',
    is_default: false,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setCurrentAddress({
      address_type: 'billing',
      is_default: false,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (address: UserAddress) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setCurrentAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCurrentAddress(prev => ({ ...prev, is_default: checked }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertAddress.mutate(currentAddress, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const openDeleteDialog = (addressId: string) => {
    setAddressToDelete(addressId);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress.mutate(addressToDelete);
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    setAddressToDelete(null);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address_type" className="text-puzzle-white">Address Type</Label>
          <Select 
            value={currentAddress.address_type as string} 
            onValueChange={(value) => handleSelectChange('address_type', value)}
          >
            <SelectTrigger className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white">
              <SelectValue placeholder="Select address type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={currentAddress.is_default || false}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="is_default" className="text-puzzle-white cursor-pointer">
              Set as default {currentAddress.address_type} address
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_line1" className="text-puzzle-white">Address Line 1</Label>
          <Input
            id="address_line1"
            name="address_line1"
            value={currentAddress.address_line1 || ''}
            onChange={handleChange}
            className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_line2" className="text-puzzle-white">Address Line 2</Label>
          <Input
            id="address_line2"
            name="address_line2"
            value={currentAddress.address_line2 || ''}
            onChange={handleChange}
            className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-puzzle-white">City</Label>
            <Input
              id="city"
              name="city"
              value={currentAddress.city || ''}
              onChange={handleChange}
              className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-puzzle-white">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={currentAddress.state || ''}
              onChange={handleChange}
              className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postal_code" className="text-puzzle-white">Postal Code</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={currentAddress.postal_code || ''}
              onChange={handleChange}
              className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-puzzle-white">Country</Label>
            <Input
              id="country"
              name="country"
              value={currentAddress.country || ''}
              onChange={handleChange}
              className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
              required
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            type="submit" 
            className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
            disabled={upsertAddress.isPending}
          >
            {upsertAddress.isPending ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Address
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="border-puzzle-white/20 text-puzzle-white hover:bg-puzzle-white/10"
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-puzzle-white mb-4">You don't have any addresses yet</p>
          <Button 
            onClick={handleAddNew}
            className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNew}
              className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="bg-puzzle-black/70 border-puzzle-aqua/20">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-puzzle-white text-lg">
                    {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)} Address
                    {address.is_default && (
                      <span className="ml-2 text-xs bg-puzzle-aqua/20 text-puzzle-aqua py-1 px-2 rounded-full">
                        Default
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(address)}
                      className="h-8 w-8 text-puzzle-white hover:text-puzzle-aqua hover:bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDeleteDialog(address.id)}
                      className="h-8 w-8 text-puzzle-white hover:text-red-500 hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-puzzle-white/80">
                  <div>
                    {address.address_line1}
                    {address.address_line2 && <>, {address.address_line2}</>}
                  </div>
                  <div>
                    {address.city}, {address.state} {address.postal_code}
                  </div>
                  <div>{address.country}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <AlertDialog open={!!addressToDelete} onOpenChange={cancelDelete}>
        <AlertDialogContent className="bg-puzzle-black border-puzzle-aqua/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-puzzle-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-puzzle-white/70">
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-puzzle-white/20 text-puzzle-white hover:bg-puzzle-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
