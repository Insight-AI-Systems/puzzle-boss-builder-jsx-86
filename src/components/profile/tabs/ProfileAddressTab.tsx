
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

interface ProfileAddressTabProps {
  addresses: any[];
  upsertAddress: (address: any) => Promise<any>;
  deleteAddress: (id: string) => Promise<any>;
}

export const ProfileAddressTab: React.FC<ProfileAddressTabProps> = ({ 
  addresses, 
  upsertAddress, 
  deleteAddress 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No addresses yet</h3>
              <p className="text-gray-500">Add your first address to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-gray-500">{address.city}, {address.state} {address.postal_code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={address.is_primary ? 'default' : 'secondary'}>
                      {address.is_primary ? 'Primary' : 'Secondary'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
