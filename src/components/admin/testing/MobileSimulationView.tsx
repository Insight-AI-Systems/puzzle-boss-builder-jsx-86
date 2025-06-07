
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Maximize,
  Eye,
  Settings
} from 'lucide-react';

interface MobileSimulationViewProps {
  gameId: string;
  deviceMode: 'desktop' | 'mobile';
  onDeviceModeChange: (mode: 'desktop' | 'mobile') => void;
}

interface DeviceProfile {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'phone' | 'tablet' | 'desktop';
  userAgent: string;
}

const deviceProfiles: DeviceProfile[] = [
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    width: 375,
    height: 667,
    category: 'phone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: 'iphone-12',
    name: 'iPhone 12',
    width: 390,
    height: 844,
    category: 'phone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: 'iphone-12-pro-max',
    name: 'iPhone 12 Pro Max',
    width: 428,
    height: 926,
    category: 'phone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: 'pixel-5',
    name: 'Google Pixel 5',
    width: 393,
    height: 851,
    category: 'phone',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
  },
  {
    id: 'galaxy-s21',
    name: 'Samsung Galaxy S21',
    width: 384,
    height: 854,
    category: 'phone',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36'
  },
  {
    id: 'ipad',
    name: 'iPad',
    width: 768,
    height: 1024,
    category: 'tablet',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    category: 'tablet',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: 'desktop-1080',
    name: 'Desktop 1080p',
    width: 1920,
    height: 1080,
    category: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

export function MobileSimulationView({ 
  gameId, 
  deviceMode, 
  onDeviceModeChange 
}: MobileSimulationViewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceProfile>(deviceProfiles[1]); // iPhone 12 default
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [touchSimulation, setTouchSimulation] = useState(true);

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'phone': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const getDeviceDimensions = () => {
    if (orientation === 'landscape') {
      return {
        width: Math.max(selectedDevice.width, selectedDevice.height),
        height: Math.min(selectedDevice.width, selectedDevice.height)
      };
    }
    return {
      width: Math.min(selectedDevice.width, selectedDevice.height),
      height: Math.max(selectedDevice.width, selectedDevice.height)
    };
  };

  const dimensions = getDeviceDimensions();
  const scale = Math.min(0.8, Math.min(800 / dimensions.width, 600 / dimensions.height));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-puzzle-white">Mobile Device Simulation</h3>
          <p className="text-puzzle-aqua">
            Test game responsiveness across different devices and orientations
          </p>
        </div>
      </div>

      {/* Device Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Device Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Device Selection */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Device</label>
              <Select 
                value={selectedDevice.id} 
                onValueChange={(deviceId) => {
                  const device = deviceProfiles.find(d => d.id === deviceId);
                  if (device) setSelectedDevice(device);
                }}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceProfiles.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.category)}
                        <span>{device.name}</span>
                        <span className="text-xs text-gray-400">
                          {device.width}×{device.height}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orientation */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Orientation</label>
              <Select value={orientation} onValueChange={(value: any) => setOrientation(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Device Frame Toggle */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Display</label>
              <Button
                variant={showDeviceFrame ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDeviceFrame(!showDeviceFrame)}
                className={showDeviceFrame 
                  ? "bg-puzzle-aqua text-puzzle-black w-full" 
                  : "border-gray-600 text-gray-400 w-full"
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                {showDeviceFrame ? "With Frame" : "No Frame"}
              </Button>
            </div>

            {/* Touch Simulation */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Touch Events</label>
              <Button
                variant={touchSimulation ? "default" : "outline"}
                size="sm"
                onClick={() => setTouchSimulation(!touchSimulation)}
                className={touchSimulation 
                  ? "bg-puzzle-aqua text-puzzle-black w-full" 
                  : "border-gray-600 text-gray-400 w-full"
                }
              >
                {touchSimulation ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-puzzle-aqua">
              {dimensions.width}×{dimensions.height}
            </div>
            <div className="text-sm text-gray-400">Resolution</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-puzzle-gold">
              {(scale * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Scale</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-green-400">
              {selectedDevice.category}
            </div>
            <div className="text-sm text-gray-400">Category</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-purple-400">
              {orientation}
            </div>
            <div className="text-sm text-gray-400">Orientation</div>
          </CardContent>
        </Card>
      </div>

      {/* Device Simulation Area */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              {getDeviceIcon(selectedDevice.category)}
              {selectedDevice.name} Simulation
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                {dimensions.width} × {dimensions.height}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                className="border-gray-600 text-gray-400"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center p-6 bg-gray-800 rounded-lg">
            <div 
              className={`
                relative overflow-hidden
                ${showDeviceFrame ? 'rounded-lg border-4 border-gray-600 shadow-2xl' : 'border border-gray-600'}
                ${selectedDevice.category === 'phone' ? 'bg-black' : 'bg-gray-700'}
              `}
              style={{
                width: `${dimensions.width * scale}px`,
                height: `${dimensions.height * scale}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
            >
              {/* Device Frame Elements */}
              {showDeviceFrame && selectedDevice.category === 'phone' && (
                <>
                  {/* Home indicator for modern phones */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full"></div>
                  {/* Notch simulation for modern phones */}
                  {selectedDevice.name.includes('iPhone') && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-lg"></div>
                  )}
                </>
              )}
              
              {/* Game Simulation Content */}
              <div className="w-full h-full bg-puzzle-black p-4 overflow-auto">
                <div className="text-center text-puzzle-white">
                  <div className="text-2xl mb-4">🧩</div>
                  <h3 className="text-lg font-bold mb-2">Puzzle Game</h3>
                  <p className="text-sm text-puzzle-aqua mb-4">
                    Game simulation running on {selectedDevice.name}
                  </p>
                  
                  {/* Mock game interface elements */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Score: 1,250</span>
                      <span>Time: 02:15</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1 aspect-square bg-gray-800 rounded p-2">
                      {Array.from({length: 16}).map((_, i) => (
                        <div 
                          key={i}
                          className="aspect-square bg-puzzle-aqua/20 rounded border border-puzzle-aqua/30"
                        ></div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-puzzle-aqua/20 text-puzzle-aqua">
                        Pause
                      </Button>
                      <Button size="sm" className="flex-1 bg-puzzle-gold/20 text-puzzle-gold">
                        Hint
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics for Mobile */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Mobile Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">60fps</div>
              <div className="text-sm text-gray-400">Frame Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">95%</div>
              <div className="text-sm text-gray-400">Touch Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">2.1s</div>
              <div className="text-sm text-gray-400">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">28MB</div>
              <div className="text-sm text-gray-400">Memory Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
