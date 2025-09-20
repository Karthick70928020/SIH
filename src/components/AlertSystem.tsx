import React, { useState } from 'react';
import { useSecurityContext } from '../contexts/SecurityContext';
import { Bell, Check, X, AlertTriangle, Shield, Mail } from 'lucide-react';

function AlertSystem() {
  const { state, dispatch } = useSecurityContext();
  const [filter, setFilter] = useState('all');

  const filteredAlerts = state.alerts.filter(alert => {
    if (filter === 'unread') return !alert.acknowledged;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const handleAcknowledge = (alertId: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alertId });
  };

  const unreadCount = state.alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-white">Alert Management</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-400">
            <Bell className="w-4 h-4" />
            <span>Real-time Monitoring</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Filter:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Alerts' },
              { key: 'unread', label: 'Unread' },
              { key: 'critical', label: 'Critical' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-sm rounded ${
                  filter === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Total Alerts</span>
          </div>
          <div className="text-2xl font-bold text-white">{state.alerts.length}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {state.alerts.filter(a => a.severity === 'critical').length}
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-400">Unread</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{unreadCount}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Acknowledged</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {state.alerts.filter(a => a.acknowledged).length}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
        </div>
        
        <div className="divide-y divide-gray-700">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-6 transition-colors ${
                !alert.acknowledged ? 'bg-gray-700/30' : 'hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`mt-1 p-2 rounded ${
                    alert.severity === 'critical' ? 'bg-red-500/20' :
                    alert.severity === 'error' ? 'bg-orange-500/20' :
                    alert.severity === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                  }`}>
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : alert.type === 'IP_BLOCKED' ? (
                      <Shield className="w-5 h-5 text-green-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-white">{alert.type.replace('_', ' ')}</h4>
                      <span className={`px-2 py-1 text-xs rounded uppercase ${
                        alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        alert.severity === 'error' ? 'bg-orange-500/20 text-orange-400' :
                        alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.severity}
                      </span>
                      {!alert.acknowledged && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-2">{alert.message}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{alert.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.acknowledged ? (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      title="Acknowledge Alert"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="p-2 bg-green-500/20 text-green-400 rounded">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No alerts match the current filter</p>
          </div>
        )}
      </div>

      {/* Alert Configuration Panel */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Alert Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-white">Notification Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox text-blue-500" defaultChecked />
                <span className="text-gray-300">Real-time console alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox text-blue-500" defaultChecked />
                <span className="text-gray-300">Critical threat notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span className="text-gray-300">Email notifications</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-white">Severity Thresholds</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Anomaly Score Threshold</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>70%</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Auto-block Threshold</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="90"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>90%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertSystem;