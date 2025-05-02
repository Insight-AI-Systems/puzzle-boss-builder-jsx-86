
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface ContentEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ initialValue, onChange }) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [htmlContent, setHtmlContent] = useState(initialValue);

  const handleContentChange = (newContent: string) => {
    setHtmlContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-0">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="p-4">
          <div className="bg-white rounded-md">
            <div 
              className="min-h-[200px] p-4 border rounded-md" 
              contentEditable
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="html" className="p-4">
          <Textarea 
            value={htmlContent} 
            onChange={(e) => handleContentChange(e.target.value)} 
            className="min-h-[200px] font-mono" 
          />
        </TabsContent>
      </Tabs>

      <div className="border-t p-2 bg-muted/50">
        <div className="flex gap-2">
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              document.execCommand('bold');
            }}
            type="button"
          >
            <strong>B</strong>
          </button>
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              document.execCommand('italic');
            }}
            type="button"
          >
            <em>I</em>
          </button>
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              const url = prompt('Enter link URL');
              if (url) document.execCommand('createLink', false, url);
            }}
            type="button"
          >
            Link
          </button>
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              document.execCommand('insertUnorderedList');
            }}
            type="button"
          >
            List
          </button>
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              document.execCommand('formatBlock', false, 'h2');
            }}
            type="button"
          >
            H2
          </button>
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              document.execCommand('formatBlock', false, 'h3');
            }}
            type="button"
          >
            H3
          </button>
          <button 
            className="p-1 hover:bg-muted rounded"
            onClick={() => {
              document.execCommand('formatBlock', false, 'p');
            }}
            type="button"
          >
            P
          </button>
        </div>
      </div>
    </div>
  );
};
