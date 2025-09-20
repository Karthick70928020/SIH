import React from 'react';
import { useSecurityContext } from '../contexts/SecurityContext';
import MetricsCard from './MetricsCard';
import ThreatMap from './ThreatMap';
import RecentActivity from './RecentActivity';
import SystemHealth from './SystemHealth';
import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react';

function Dashboard() {
  const { state } = useSecurityContext();

  const metricsCards = [
    {
      title: 'Packets Processed',
      value: state.metrics.packetsProcessed.toLocaleString(),
      icon: Eye,
      color: 'blue',
      change: '+12.5%',
    },
    {
      title: 'Threats Detected',
      value: state.metrics.threatsDetected.toString(),
      icon: AlertTriangle,
      color: 'red',
      change: state.metrics.threatsDetected > 0 ? '+' + state.metrics.threatsDetected : '0',
    },
    {
      title: 'IPs Blocked',
      value: state.blockedIPs.length.toString(),
      icon: Shield,
      color: 'green',
      change: state.blockedIPs.length > 0 ? 'Active' : 'None',
    },
    {
      title: 'Secure Logs',
      value: state.logs.length.toString(),
      icon: Lock,
      color: 'purple',
      change: '100% Encrypted',
    },
  ];

  return (
    <div className="space-y-6">
      {/* System Status Banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-green-400">System Operational</h2>
            <span className="text-sm text-gray-400">
              Uptime: {Math.floor(state.metrics.systemUptime / 3600)}h {Math.floor((state.metrics.systemUptime % 3600) / 60)}m
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((card, index) => (
          <MetricsCard key={index} {...card} />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ThreatMap threats={state.threats} />
          <RecentActivity 
            threats={state.threats.slice(0, 10)} 
            networkActivity={state.networkActivity.slice(0, 10)} 
          />
        </div>
        <div className="space-y-6">
          <SystemHealth metrics={state.metrics} />
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {state.alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'error' ? 'bg-orange-500' :
                    alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{alert.type}</div>
                    <div className="text-xs text-gray-400">{alert.message}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {state.alerts.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No recent alerts
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;