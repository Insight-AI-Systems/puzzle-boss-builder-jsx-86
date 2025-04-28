
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Puzzle, Upload } from "lucide-react";

interface PieceStyleManagerProps {
  currentStyle: string;
  customSvg?: string;
  onSelectStyle: (style: string) => void;
  onCustomSvgChange: (svg: string) => void;
}

const PIECE_STYLES = [
  { id: 'classic', name: 'Classic', description: 'Traditional jigsaw puzzle pieces' },
  { id: 'rounded', name: 'Rounded', description: 'Smooth, rounded edges' },
  { id: 'modern', name: 'Modern', description: 'Clean, geometric style' },
  { id: 'custom', name: 'Custom SVG', description: 'Upload or paste your own SVG' },
];

export const PieceStyleManager: React.FC<PieceStyleManagerProps> = ({
  currentStyle,
  customSvg = '',
  onSelectStyle,
  onCustomSvgChange
}) => {
  const [svgInput, setSvgInput] = useState(customSvg);
  const { toast } = useToast();

  const handleSvgInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgInput(e.target.value);
  };

  const applyCustomSvg = () => {
    onCustomSvgChange(svgInput);
    toast({
      title: 'Custom SVG Applied',
      description: 'Your custom piece style has been applied',
    });
  };

  const handleSvgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSvgInput(content);
        onCustomSvgChange(content);
        onSelectStyle('custom');
        toast({
          title: 'SVG Uploaded',
          description: 'Your custom SVG has been uploaded and applied',
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Puzzle className="h-5 w-5 mr-2" />
          Piece Styles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={currentStyle} onValueChange={onSelectStyle}>
          {PIECE_STYLES.map(style => (
            <div key={style.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-accent">
              <RadioGroupItem value={style.id} id={style.id} />
              <div className="grid gap-1.5">
                <Label htmlFor={style.id} className="font-medium">
                  {style.name}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {style.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>

        {currentStyle === 'custom' && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="upload-svg">Upload SVG File</Label>
              <div className="flex items-center">
                <label htmlFor="upload-svg" className="w-full cursor-pointer">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-500" />
                      <div className="text-sm text-gray-500">
                        Click to upload SVG
                      </div>
                    </div>
                  </div>
                  <Input
                    id="upload-svg"
                    type="file"
                    accept=".svg"
                    className="hidden"
                    onChange={handleSvgFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="svg-input">Or paste SVG code</Label>
              <Textarea
                id="svg-input"
                value={svgInput}
                onChange={handleSvgInputChange}
                placeholder="<svg>...</svg>"
                rows={6}
              />
              <Button onClick={applyCustomSvg} size="sm">
                Apply SVG
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
