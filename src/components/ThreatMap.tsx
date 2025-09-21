import React from 'react';
import { AlertTriangle, Shield, Activity } from 'lucide-react';

interface Threat {
  id: string;
  timestamp: Date;
  source: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  blocked: boolean;
}

interface ThreatMapProps {
  threats: Threat[];
}

function ThreatMap({ threats }: ThreatMapProps) {
  const severityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  const recentThreats = threats.slice(0, 10);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Threat Activity Map</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Threat visualization */}
      <div className="space-y-4">
        <div className="relative bg-gray-900 border border-gray-600 rounded-lg p-4 h-64 cyber-grid overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-16 h-16 text-green-400 mx-auto mb-2 opacity-20" />
              <div className="text-sm text-gray-500">Network Perimeter</div>
            </div>
          </div>

          {/* Animated threat indicators */}
          {recentThreats.map((threat, index) => (
            <div
              key={threat.id}
              className={`absolute w-3 h-3 rounded-full ${severityColors[threat.severity]} animate-pulse`}
              style={{
                left: `${20 + (index * 7) % 60}%`,
                top: `${30 + (index * 11) % 40}%`,
              }}
            />
          ))}
        </div>

        {/* Threat legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(severityColors).map(([severity, colorClass]) => (
            <div key={severity} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
              <span className="text-sm text-gray-400 capitalize">{severity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent threats list */}
      <div className="mt-6 space-y-3">
        <h4 className="text-md font-medium text-white">Recent Threats</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {recentThreats.map(threat => (
            <div key={threat.id} className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded">
              <AlertTriangle className={`w-4 h-4 ${
                threat.severity === 'critical' ? 'text-red-400' :
                threat.severity === 'high' ? 'text-orange-400' :
                threat.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
              }`} />
              <div className="flex-1">
                <div className="text-sm text-white">{threat.source}</div>
                <div className="text-xs text-gray-400">{threat.type}</div>
              </div>
              <div className="text-xs text-gray-500">
                {threat.timestamp.toLocaleTimeString()}
              </div>
              {threat.blocked && (
                <Shield className="w-4 h-4 text-green-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreatMap;