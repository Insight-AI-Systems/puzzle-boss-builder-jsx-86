import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JigsawGame } from './JigsawGame';

interface MinimalJigsawGameProps {
  imageUrl?: string;
  pieceCount?: 20 | 100 | 500;
  onComplete?: () => void;
}

// Global variables that the original puzzle engine expects
declare global {
  var createjs: any;
  var CMain: any;
  var CANVAS_WIDTH: number;
  var CANVAS_HEIGHT: number;
}

export function MinimalJigsawGame({ 
  imageUrl, 
  pieceCount,
  onComplete 
}: MinimalJigsawGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);
  const [sandboxStatus, setSandboxStatus] = useState<string>('init');

  // Load all puzzle scripts into a sandboxed iframe and let the original engine take over
  const [lastSrcDoc, setLastSrcDoc] = useState<string | null>(null);
  const initializePuzzleEngine = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('🚀 DEBUGGING: Starting puzzle engine initialization (iframe sandbox)...');

      // Fetch JavaScript files from database
      console.log('📡 DEBUGGING: Fetching JS files from database...');
      const { data: jsFiles, error: dbError } = await supabase
        .from('puzzle_js_files')
        .select('filename, content')
        .order('filename');

      console.log('📊 DEBUGGING: Database query result:', {
        filesCount: jsFiles?.length || 0,
        error: dbError?.message || 'none',
        sampleFile: jsFiles?.[0] ? jsFiles[0].filename : 'none'
      });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);
      if (!jsFiles || jsFiles.length === 0) throw new Error('No puzzle JavaScript files found in database');

      // Build srcdoc for sandboxed iframe
      const srcDoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Jigsaw Engine Sandbox</title>
  <style>html,body{margin:0;padding:0;background:#111;color:#ddd;font:14px/1.4 system-ui,sans-serif}#wrap{padding:8px}#status{font-size:12px;color:#8aa}#game{display:flex;justify-content:center;padding:8px}</style>
  <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
</head>
<body>
  <div id="wrap">
    <div id="status">Loading engine scripts...</div>
    <div id="game"><canvas id="canvas" width="960" height="540"></canvas></div>
  </div>
  <script>
    // Provide common globals many CodeCanyon engines expect
    try {
      var canvas = document.getElementById('canvas');
      window.CANVAS_WIDTH = canvas ? canvas.width : 960;
      window.CANVAS_HEIGHT = canvas ? canvas.height : 540;
      window.s_oCanvas = canvas;
      window.PUZZLE_CONFIG = {
        imageUrl: ${JSON.stringify(imageUrl || '/placeholder.svg')},
        pieceCount: ${pieceCount ?? 'null'}
      };
      window.addEventListener('error', function(e){ var s=document.getElementById('status'); if(s){ s.textContent = 'Runtime error: ' + (e.message||e); } try { parent && parent.postMessage({ source: 'jigsaw-sandbox', type: 'engine-error', payload: { message: e.message } }, '*'); } catch(_){} });
      window.addEventListener('unhandledrejection', function(e){ var s=document.getElementById('status'); if(s){ s.textContent = 'Promise rejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason); } try { parent && parent.postMessage({ source: 'jigsaw-sandbox', type: 'engine-error', payload: { message: e.reason && e.reason.message ? e.reason.message : String(e.reason) } }, '*'); } catch(_){} });
      console.log('[Sandbox] Globals set', { CANVAS_WIDTH: window.CANVAS_WIDTH, CANVAS_HEIGHT: window.CANVAS_HEIGHT, PUZZLE_CONFIG: window.PUZZLE_CONFIG });
    } catch(e) { console.warn('[Sandbox] Global setup failed', e); }
    try { console.log('[Sandbox] createjs', typeof createjs); } catch(e) {}

    // Helper to notify host
    function postToHost(type, payload){
      try { parent && parent.postMessage({ source: 'jigsaw-sandbox', type: type, payload: payload }, '*'); } catch(_){/* noop */}
    }

    // Instrument PreloadJS to surface stuck preload reasons
    try {
      if (window.createjs && createjs.LoadQueue) {
        var OriginalLoadQueue = createjs.LoadQueue;
        createjs.LoadQueue = function(useXHR, basePath, crossOrigin){
          var q = new OriginalLoadQueue(useXHR, basePath, crossOrigin);
          var s = document.getElementById('status');
          q.addEventListener('error', function(e){ console.error('[PreloadJS] error', e); if(s){ s.textContent = 'Preload error: ' + (e && (e.data && e.data.src || e.message || e.type || 'unknown')); } postToHost('preload-error', { error: e && (e.data && e.data.src || e.message || e.type || 'unknown') }); });
          q.addEventListener('fileerror', function(e){ console.error('[PreloadJS] fileerror', e); if(s){ s.textContent = 'File error: ' + (e && (e.data && e.data.src || e.item && e.item.src || 'unknown')); } postToHost('preload-error', { file: e && (e.data && e.data.src || e.item && e.item.src || 'unknown') }); });
          q.addEventListener('fileload', function(e){ console.log('[PreloadJS] fileload', e && e.item && e.item.src); postToHost('preload-fileload', { src: e && e.item && e.item.src }); });
          q.addEventListener('progress', function(e){ var p = Math.round(((e && e.progress) || 0) * 100); if(s){ s.textContent = 'Loading assets... ' + p + '%'; } postToHost('preload-progress', { progress: p }); });
          q.addEventListener('complete', function(){ if(s){ s.textContent = 'Assets loaded. Starting...'; } postToHost('preload-complete'); });
          return q;
        };
        createjs.LoadQueue.prototype = OriginalLoadQueue.prototype;
        createjs.LoadQueue.prototype.constructor = createjs.LoadQueue;
        console.log('[Sandbox] PreloadJS instrumentation active');
      } else {
        console.log('[Sandbox] PreloadJS not available yet');
      }
    } catch(e) { console.warn('[Sandbox] PreloadJS instrumentation failed', e); }
  </script>
  ${jsFiles
    .map((f) => `<!-- ${f.filename} -->\n<script>\ntry {\nconsole.log('Loading ${f.filename}...');\n${f.content}\nconsole.log('✅ ${f.filename} loaded');\n} catch(e) {\nconsole.error('❌ Error in ${f.filename}:', e);\nvar s=document.getElementById('status'); if(s){ s.textContent='Error in ${f.filename}: '+e.message; }\n}\n<\/script>`) 
    .join('\n')}
  <script>
    // Try common init patterns
    setTimeout(function(){
      var s=document.getElementById('status');
      try {
        var canvas = document.getElementById('canvas');
        window.CANVAS_WIDTH = canvas ? canvas.width : 960;
        window.CANVAS_HEIGHT = canvas ? canvas.height : 540;
        window.s_oCanvas = canvas;

        if (window.CMain) {
          s && (s.textContent='Starting engine...');
          var main = null;
          try { main = new window.CMain(canvas); console.log('[Sandbox] CMain(canvas) constructed'); } catch(e) { console.warn('[Sandbox] CMain(canvas) failed', e); }
          if (!main) {
            try { main = new window.CMain(); console.log('[Sandbox] CMain() constructed'); } catch(e) { console.warn('[Sandbox] CMain() failed', e); }
          }
          if (main && typeof main.init === 'function') { try { main.init(); console.log('[Sandbox] main.init() called'); } catch(e){ console.warn('[Sandbox] main.init() failed', e); } }
          s && (s.textContent='Engine started (watch console for preload)');
        } else {
          s && (s.textContent='CMain not found. Check console.');
        }
      } catch(e){ console.error('Engine start error', e); s && (s.textContent='Engine start error: '+e.message); }
    }, 100);
  </script>
</body>
</html>`;

      setLastSrcDoc(srcDoc);

      // Write to iframe via srcdoc
      const iframe = iframeRef.current;
      if (!iframe) throw new Error('Iframe not ready');

      const onLoad = () => {
        console.log('✅ Iframe content loaded');
        setIsLoading(false);
        iframe.removeEventListener('load', onLoad);
      };
      iframe.addEventListener('load', onLoad);
      // 10s fail-safe
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.warn('⏱️ Engine load timeout');
          setError('Engine load timeout');
          setIsLoading(false);
          iframe.removeEventListener('load', onLoad);
        }
      }, 10000);

      // Assign srcdoc triggers load
      iframe.srcdoc = srcDoc;

      // Clear timeout when load completes
      const cleanupOnLoad = () => clearTimeout(timeout);
      iframe.addEventListener('load', cleanupOnLoad, { once: true });
    } catch (err) {
      console.error('❌ Error loading puzzle engine:', err);
      setError(`Failed to load puzzle: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Open the same sandbox in a standalone window (for debugging)
  const openStandalone = () => {
    if (!lastSrcDoc) return;
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(lastSrcDoc);
      w.document.close();
    } else {
      alert('Popup blocked');
    }
  };

  useEffect(() => {
    console.log('🎮 Iframe ready, initializing puzzle engine...');
    initializePuzzleEngine();
  }, []);

  // Listen to messages from sandbox to decide on fallback
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = (e as any).data;
      if (!data || data.source !== 'jigsaw-sandbox') return;
      console.log('[Host] Sandbox message:', data);
      setSandboxStatus(data.type || 'unknown');
      if (data.type === 'preload-complete') {
        // Engine assets loaded; keep iframe
        setFallbackActive(false);
      } else if (data.type === 'preload-error' || data.type === 'engine-error') {
        // Critical error; switch to fallback
        setFallbackActive(true);
      }
    };
    window.addEventListener('message', onMessage as any);
    return () => window.removeEventListener('message', onMessage as any);
  }, []);

  // If sandbox stalls too long, activate fallback engine
  useEffect(() => {
    if (fallbackActive) return;
    if (sandboxStatus === 'preload-complete') return;
    const timer = setTimeout(() => {
      if (!fallbackActive && sandboxStatus !== 'preload-complete') {
        console.warn('🧩 Activating fallback engine due to sandbox stall');
        setFallbackActive(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [sandboxStatus, fallbackActive]);

  // Fallback: use internal headbreaker-based engine if sandboxed engine fails or stalls
  if (fallbackActive) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="text-sm mb-3">Running fallback engine (headbreaker) due to sandbox issue: {sandboxStatus}</div>
        <JigsawGame
          imageUrl={imageUrl || '/placeholder.svg'}
          pieceCount={pieceCount || 20}
          onComplete={() => onComplete?.()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex justify-center">
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts"
            className="border rounded shadow-lg w-full min-h-[540px]"
            title="Jigsaw Engine Sandbox"
          />
        </div>
        <div className="text-center text-sm text-muted-foreground mt-3">Loading original puzzle engine...</div>
        <div className="flex justify-center mt-2">
          <button onClick={openStandalone} className="px-3 py-1.5 bg-gray-600 text-white rounded">
            Open Standalone
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="text-red-600">Error: {error}</div>
        <div className="flex gap-3">
          <button onClick={initializePuzzleEngine} className="px-4 py-2 bg-blue-500 text-white rounded">
            Try Again
          </button>
          <button onClick={openStandalone} className="px-4 py-2 bg-gray-600 text-white rounded">
            Open Standalone
          </button>
        </div>
      </div>
    );
  }

  // Minimal container - let the original engine handle everything
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-center">
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          className="border rounded shadow-lg w-full min-h-[540px]"
          title="Jigsaw Engine Sandbox"
        />
      </div>
      <div className="flex justify-end mt-2">
        <button onClick={openStandalone} className="px-3 py-1.5 bg-gray-600 text-white rounded">
          Open Standalone
        </button>
      </div>
    </div>
  );
}