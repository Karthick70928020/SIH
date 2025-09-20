import React from 'react';
import { Cpu, HardDrive, Activity, Clock } from 'lucide-react';

interface SystemMetrics {
  packetsProcessed: number;
  threatsDetected: number;
  threatsBlocked: number;
  systemUptime: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface SystemHealthProps {
  metrics: SystemMetrics;
}

function SystemHealth({ metrics }: SystemHealthProps) {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHealthStatus = (value: number, type: 'cpu' | 'memory') => {
    if (type === 'cpu') {
      if (value > 80) return { status: 'critical', color: 'red' };
      if (value > 60) return { status: 'warning', color: 'yellow' };
      return { status: 'good', color: 'green' };
    }
    
    if (value > 85) return { status: 'critical', color: 'red' };
    if (value > 70) return { status: 'warning', color: 'yellow' };
    return { status: 'good', color: 'green' };
  };

  const cpuHealth = getHealthStatus(metrics.cpuUsage, 'cpu');
  const memoryHealth = getHealthStatus(metrics.memoryUsage, 'memory');

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">System Health</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Healthy</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className={`w-4 h-4 text-${cpuHealth.color}-400`} />
              <span className="text-sm text-white">CPU Usage</span>
            </div>
            <span className="text-sm text-gray-400">{metrics.cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-${cpuHealth.color}-400 transition-all duration-500`}
              style={{ width: `${metrics.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className={`w-4 h-4 text-${memoryHealth.color}-400`} />
              <span className="text-sm text-white">Memory Usage</span>
            </div>
            <span className="text-sm text-gray-400">{metrics.memoryUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-${memoryHealth.color}-400 transition-all duration-500`}
              style={{ width: `${metrics.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-sm text-gray-400">Uptime</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {formatUptime(metrics.systemUptime)}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <div className="text-lg font-semibold text-green-400">Active</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Packets/sec</span>
              <span className="text-white">{Math.floor(metrics.packetsProcessed / Math.max(metrics.systemUptime, 1))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Detection Rate</span>
              <span className="text-white">
                {metrics.packetsProcessed > 0 ? ((metrics.threatsDetected / metrics.packetsProcessed) * 100).toFixed(2) : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Block Rate</span>
              <span className="text-white">
                {metrics.threatsDetected > 0 ? ((metrics.threatsBlocked / metrics.threatsDetected) * 100).toFixed(2) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHealth;