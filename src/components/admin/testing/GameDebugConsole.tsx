
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Filter,
  Bug,
  Info,
  AlertTriangle,
  XCircle,
  Play
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
}

interface GameDebugConsoleProps {
  gameId: string;
  testMode: boolean;
}

export function GameDebugConsole({ gameId, testMode }: GameDebugConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [command, setCommand] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'debug'>('all');
  const [isCapturing, setIsCapturing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock log generation for demonstration
  useEffect(() => {
    if (!isCapturing) return;

    const generateMockLog = () => {
      const categories = ['game', 'timer', 'score', 'input', 'network', 'storage'];
      const levels: LogEntry['level'][] = ['info', 'warn', 'error', 'debug'];
      const messages = {
        info: [
          'Game initialized successfully',
          'Player connected to session',
          'Score updated',
          'Timer started',
          'Piece placed correctly',
          'Game state saved'
        ],
        warn: [
          'Slow network detected',
          'High memory usage',
          'Frame rate dropped below 60fps',
          'Timer drift detected',
          'Score calculation took longer than expected'
        ],
        error: [
          'Failed to load game asset',
          'Network connection lost',
          'Invalid piece position',
          'Score submission failed',
          'Timer synchronization error'
        ],
        debug: [
          'Piece collision detected',
          'Touch event registered',
          'State transition completed',
          'Cache miss on asset load',
          'Websocket heartbeat sent'
        ]
      };

      const level = levels[Math.floor(Math.random() * levels.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const messageList = messages[level];
      const message = messageList[Math.floor(Math.random() * messageList.length)];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level,
        category,
        message,
        data: level === 'debug' ? { 
          gameId, 
          testMode, 
          randomValue: Math.random() 
        } : undefined
      };

      setLogs(prev => [...prev, newLog].slice(-1000)); // Keep last 1000 logs
    };

    const interval = setInterval(generateMockLog, Math.random() * 3000 + 1000);
    return () => clearInterval(interval);
  }, [gameId, testMode, isCapturing]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const executeCommand = () => {
    if (!command.trim()) return;

    // Add command to logs
    const commandLog: LogEntry = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date(),
      level: 'info',
      category: 'console',
      message: `> ${command}`,
    };

    // Mock command execution
    let responseLog: LogEntry;
    if (command.toLowerCase().includes('clear')) {
      setLogs([]);
      setCommand('');
      return;
    } else if (command.toLowerCase().includes('help')) {
      responseLog = {
        id: `response-${Date.now()}`,
        timestamp: new Date(),
        level: 'info',
        category: 'console',
        message: 'Available commands: clear, help, status, test, debug [category]',
      };
    } else if (command.toLowerCase().includes('status')) {
      responseLog = {
        id: `response-${Date.now()}`,
        timestamp: new Date(),
        level: 'info',
        category: 'console',
        message: `Game Status: ${testMode ? 'Test Mode' : 'Production'}, Logs: ${logs.length}, Capturing: ${isCapturing}`,
      };
    } else if (command.toLowerCase().includes('test')) {
      responseLog = {
        id: `response-${Date.now()}`,
        timestamp: new Date(),
        level: 'debug',
        category: 'console',
        message: 'Running diagnostic test...',
        data: { testResults: { performance: 95, memory: 'OK', errors: 0 } }
      };
    } else {
      responseLog = {
        id: `response-${Date.now()}`,
        timestamp: new Date(),
        level: 'warn',
        category: 'console',
        message: `Unknown command: ${command}. Type 'help' for available commands.`,
      };
    }

    setLogs(prev => [...prev, commandLog, responseLog]);
    setCommand('');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logData = logs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      category: log.category,
      message: log.message,
      data: log.data
    }));

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-logs-${gameId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <Info className="h-3 w-3 text-blue-400" />;
      case 'warn': return <AlertTriangle className="h-3 w-3 text-yellow-400" />;
      case 'error': return <XCircle className="h-3 w-3 text-red-400" />;
      case 'debug': return <Bug className="h-3 w-3 text-green-400" />;
      default: return <Info className="h-3 w-3 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warn': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'debug': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const filteredLogs = logs.filter(log => 
    filterLevel === 'all' || log.level === filterLevel
  );

  const logCounts = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warn: logs.filter(l => l.level === 'warn').length,
    error: logs.filter(l => l.level === 'error').length,
    debug: logs.filter(l => l.level === 'debug').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-puzzle-white">Debug Console</h3>
          <p className="text-puzzle-aqua">
            Real-time game debugging and log monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isCapturing ? "default" : "outline"}
              onClick={() => setIsCapturing(!isCapturing)}
              className={isCapturing 
                ? "bg-puzzle-aqua text-puzzle-black" 
                : "border-gray-600 text-gray-400"
              }
            >
              <Play className="h-4 w-4 mr-2" />
              {isCapturing ? 'Capturing' : 'Paused'}
            </Button>
            
            <Button 
              size="sm"
              onClick={clearLogs}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Button 
              size="sm"
              onClick={exportLogs}
              variant="outline"
              className="border-gray-600 text-gray-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-puzzle-white">{logCounts.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-400">{logCounts.info}</div>
            <div className="text-xs text-gray-400">Info</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">{logCounts.warn}</div>
            <div className="text-xs text-gray-400">Warnings</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-red-400">{logCounts.error}</div>
            <div className="text-xs text-gray-400">Errors</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-400">{logCounts.debug}</div>
            <div className="text-xs text-gray-400">Debug</div>
          </CardContent>
        </Card>
      </div>

      {/* Console Interface */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Console Output
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-puzzle-white"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors</option>
                <option value="debug">Debug</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Log Display */}
            <ScrollArea 
              ref={scrollRef}
              className="h-96 bg-gray-950 rounded border border-gray-700 font-mono text-sm"
            >
              <div className="p-3 space-y-1">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 hover:bg-gray-800/50 px-2 py-1 rounded">
                    <div className="text-xs text-gray-500 min-w-[60px]">
                      {log.timestamp.toLocaleTimeString()}
                    </div>
                    
                    <div className="flex items-center gap-1 min-w-[60px]">
                      {getLevelIcon(log.level)}
                      <span className={`text-xs uppercase ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1 py-0 min-w-[60px] border-gray-600"
                    >
                      {log.category}
                    </Badge>
                    
                    <div className="flex-1 text-gray-300">
                      {log.message}
                      {log.data && (
                        <details className="mt-1">
                          <summary className="text-xs text-gray-500 cursor-pointer">
                            Show data
                          </summary>
                          <pre className="text-xs text-gray-400 mt-1 ml-4">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredLogs.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No logs to display
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Command Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                  placeholder="Enter console command..."
                  className="pl-10 bg-gray-800 border-gray-600 text-puzzle-white font-mono"
                />
              </div>
              <Button 
                onClick={executeCommand}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                Execute
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Panel */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white text-sm">Available Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-mono text-puzzle-aqua">clear</div>
              <div className="text-gray-400">Clear all console logs</div>
            </div>
            <div>
              <div className="font-mono text-puzzle-aqua">help</div>
              <div className="text-gray-400">Show available commands</div>
            </div>
            <div>
              <div className="font-mono text-puzzle-aqua">status</div>
              <div className="text-gray-400">Show current game status</div>
            </div>
            <div>
              <div className="font-mono text-puzzle-aqua">test</div>
              <div className="text-gray-400">Run diagnostic test</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
