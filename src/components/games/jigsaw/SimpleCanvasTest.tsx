import React, { useEffect, useRef } from 'react';

export function SimpleCanvasTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Canvas element created');
    
    // Just draw something basic to test canvas works
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 100, 100);
      ctx.fillStyle = 'blue';
      ctx.fillText('Canvas Works!', 20, 140);
    }

    // Test if headbreaker is available
    console.log('Testing headbreaker availability...');
    
    try {
      // @ts-ignore
      console.log('headbreaker object:', window.headbreaker || headbreaker);
      
      // Try the simplest possible headbreaker usage
      const script = document.createElement('script');
      script.innerHTML = `
        console.log('Inline script running...');
        console.log('headbreaker in inline script:', typeof headbreaker);
      `;
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Error testing headbreaker:', error);
    }

  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <h1 className="text-2xl mb-4">Simple Canvas Test</h1>
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-black bg-white"
      />
    </div>
  );
}