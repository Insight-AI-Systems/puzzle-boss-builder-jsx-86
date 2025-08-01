import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, List, Type } from 'lucide-react';

interface SecureContentEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

// Comprehensive HTML sanitization
const sanitizeHtml = (html: string): string => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Allowed tags with their allowed attributes
  const allowedTags = {
    'p': ['class'],
    'h1': ['class'],
    'h2': ['class'], 
    'h3': ['class'],
    'h4': ['class'],
    'h5': ['class'],
    'h6': ['class'],
    'strong': [],
    'b': [],
    'em': [],
    'i': [],
    'u': [],
    'ul': ['class'],
    'ol': ['class'],
    'li': ['class'],
    'br': [],
    'a': ['href', 'title', 'target'],
    'span': ['class'],
    'div': ['class']
  };
  
  // Remove all script tags and their content
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove all style tags and their content
  const styles = tempDiv.querySelectorAll('style');
  styles.forEach(style => style.remove());
  
  // Process all elements
  const processElement = (element: Element): void => {
    const tagName = element.tagName.toLowerCase();
    
    // Remove disallowed tags
    if (!allowedTags[tagName as keyof typeof allowedTags]) {
      element.remove();
      return;
    }
    
    // Remove disallowed attributes
    const allowedAttrs = allowedTags[tagName as keyof typeof allowedTags];
    Array.from(element.attributes).forEach(attr => {
      if (!allowedAttrs.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });
    
    // Sanitize href attributes
    if (tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && !href.match(/^(https?:\/\/|mailto:|#)/)) {
        element.removeAttribute('href');
      }
    }
    
    // Process child elements
    Array.from(element.children).forEach(child => processElement(child));
  };
  
  Array.from(tempDiv.children).forEach(child => processElement(child));
  
  return tempDiv.innerHTML;
};

export const SecureContentEditor: React.FC<SecureContentEditorProps> = ({ 
  initialValue, 
  onChange 
}) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [htmlContent, setHtmlContent] = useState(sanitizeHtml(initialValue));
  const editorRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (newContent: string) => {
    const sanitizedContent = sanitizeHtml(newContent);
    setHtmlContent(sanitizedContent);
    onChange(sanitizedContent);
  };

  const handleInput = () => {
    if (editorRef.current) {
      handleContentChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const createLink = () => {
    const url = prompt('Enter link URL (https:// or mailto:)');
    if (url && url.match(/^(https?:\/\/|mailto:)/)) {
      executeCommand('createLink', url);
    }
  };

  // Update editor content when switching tabs
  useEffect(() => {
    if (activeTab === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [activeTab, htmlContent]);

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-0">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="p-0">
          <div className="border-b p-2 bg-muted/50">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('bold')}
                type="button"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('italic')}
                type="button"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={createLink}
                type="button"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('insertUnorderedList')}
                type="button"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('formatBlock', 'h2')}
                type="button"
              >
                <Type className="h-4 w-4" />
                <span className="ml-1 text-xs">H2</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('formatBlock', 'h3')}
                type="button"
              >
                <Type className="h-4 w-4" />
                <span className="ml-1 text-xs">H3</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('formatBlock', 'p')}
                type="button"
              >
                <Type className="h-4 w-4" />
                <span className="ml-1 text-xs">P</span>
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <div 
              ref={editorRef}
              className="min-h-[200px] p-4 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary" 
              contentEditable
              onInput={handleInput}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                executeCommand('insertText', text);
              }}
              suppressContentEditableWarning={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="html" className="p-4">
          <Textarea 
            value={htmlContent} 
            onChange={(e) => handleContentChange(e.target.value)} 
            className="min-h-[200px] font-mono" 
            placeholder="Enter HTML content..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};