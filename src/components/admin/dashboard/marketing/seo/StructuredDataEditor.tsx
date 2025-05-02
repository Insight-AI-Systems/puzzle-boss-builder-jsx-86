
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

export const StructuredDataEditor: React.FC = () => {
  const { toast } = useToast();
  const [schemaType, setSchemaType] = useState('organization');
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);
  
  const [organizationSchema, setOrganizationSchema] = useState({
    name: 'Puzzle Boss',
    description: 'Create engaging puzzle experiences with real rewards',
    url: 'https://puzzleboss.com',
    logo: 'https://puzzleboss.com/logo.png',
    sameAs: [
      'https://facebook.com/puzzleboss',
      'https://twitter.com/puzzleboss',
      'https://instagram.com/puzzleboss_official'
    ]
  });
  
  const [productSchema, setProductSchema] = useState({
    name: 'Premium Puzzle Membership',
    description: 'Access to exclusive puzzles with higher rewards',
    image: 'https://puzzleboss.com/premium-membership.jpg',
    price: '19.99',
    priceCurrency: 'USD',
    availability: 'InStock'
  });

  const handleValidate = () => {
    // Simulate validation
    setTimeout(() => {
      setValidationStatus('valid');
      toast({
        title: "Schema validation successful",
        description: "Your structured data is valid according to schema.org standards.",
      });
    }, 1000);
  };

  const handleSave = () => {
    toast({
      title: "Structured data saved",
      description: "Schema has been successfully saved and applied to your site.",
    });
  };

  const generateOrganizationJSON = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      ...organizationSchema
    };
    return JSON.stringify(schema, null, 2);
  };

  const generateProductJSON = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      ...productSchema,
      offers: {
        "@type": "Offer",
        price: productSchema.price,
        priceCurrency: productSchema.priceCurrency,
        availability: `https://schema.org/${productSchema.availability}`
      }
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Structured Data</h3>
          <p className="text-sm text-muted-foreground">
            Add Schema.org markup to help search engines understand your content
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleValidate}>Validate Schema</Button>
          <Button onClick={handleSave}>Save Schema</Button>
        </div>
      </div>
      
      {validationStatus === 'valid' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Schema validation successful. Your structured data is valid.</span>
        </div>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="schema-type">Schema Type</Label>
              <Select value={schemaType} onValueChange={setSchemaType}>
                <SelectTrigger id="schema-type" className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select schema type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="faq">FAQ Page</SelectItem>
                  <SelectItem value="local">Local Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={schemaType} onValueChange={setSchemaType} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="article">Article</TabsTrigger>
              </TabsList>
              
              <TabsContent value="organization" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input 
                      id="org-name" 
                      value={organizationSchema.name}
                      onChange={(e) => setOrganizationSchema({...organizationSchema, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="org-url">Website URL</Label>
                    <Input 
                      id="org-url" 
                      value={organizationSchema.url}
                      onChange={(e) => setOrganizationSchema({...organizationSchema, url: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="org-description">Description</Label>
                    <Textarea 
                      id="org-description" 
                      value={organizationSchema.description}
                      onChange={(e) => setOrganizationSchema({...organizationSchema, description: e.target.value})}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="org-logo">Logo URL</Label>
                    <Input 
                      id="org-logo" 
                      value={organizationSchema.logo}
                      onChange={(e) => setOrganizationSchema({...organizationSchema, logo: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Generated JSON-LD</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md">
                    <pre className="text-xs overflow-auto">{generateOrganizationJSON()}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="product" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input 
                      id="product-name" 
                      value={productSchema.name}
                      onChange={(e) => setProductSchema({...productSchema, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="product-image">Image URL</Label>
                    <Input 
                      id="product-image" 
                      value={productSchema.image}
                      onChange={(e) => setProductSchema({...productSchema, image: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea 
                      id="product-description" 
                      value={productSchema.description}
                      onChange={(e) => setProductSchema({...productSchema, description: e.target.value})}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input 
                      id="product-price" 
                      value={productSchema.price}
                      onChange={(e) => setProductSchema({...productSchema, price: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="product-currency">Currency</Label>
                    <Input 
                      id="product-currency" 
                      value={productSchema.priceCurrency}
                      onChange={(e) => setProductSchema({...productSchema, priceCurrency: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="product-availability">Availability</Label>
                    <Select 
                      value={productSchema.availability}
                      onValueChange={(value) => setProductSchema({...productSchema, availability: value})}
                    >
                      <SelectTrigger id="product-availability">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="InStock">In Stock</SelectItem>
                        <SelectItem value="OutOfStock">Out of Stock</SelectItem>
                        <SelectItem value="PreOrder">Pre-Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Generated JSON-LD</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md">
                    <pre className="text-xs overflow-auto">{generateProductJSON()}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="article">
                <p className="py-4 text-center">Article schema implementation in progress</p>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
