import React, { useState } from 'react';
import { useSecurityContext } from '../contexts/SecurityContext';
import { Network, Filter, Eye, EyeOff, AlertTriangle } from 'lucide-react';

function NetworkMonitor() {
  const { state } = useSecurityContext();
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredActivity = state.networkActivity.filter(packet => {
    if (filter === 'all') return true;
    if (filter === 'suspicious') return packet.anomalyScore > 0.7;
    if (filter === 'normal') return packet.anomalyScore <= 0.7;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Network Traffic Monitor</h2>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <Network className="w-4 h-4" />
            <span>Real-time Analysis</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Traffic' },
              { key: 'suspicious', label: 'Suspicious' },
              { key: 'normal', label: 'Normal' },
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

      {/* Traffic Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Live Traffic Analysis</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Protocol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredActivity.slice(0, 50).map(packet => (
                <tr key={packet.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {packet.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-white">
                    {packet.source}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-white">
                    {packet.destination}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <span className={`px-2 py-1 text-xs rounded ${
                      packet.protocol === 'TCP' ? 'bg-blue-500/20 text-blue-400' :
                      packet.protocol === 'UDP' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {packet.protocol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {packet.size.toLocaleString()} B
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          packet.anomalyScore > 0.8 ? 'bg-red-500' :
                          packet.anomalyScore > 0.6 ? 'bg-orange-500' :
                          packet.anomalyScore > 0.4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      ></div>
                      <span className={`text-sm ${
                        packet.anomalyScore > 0.7 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {(packet.anomalyScore * 100).toFixed(1)}%
                      </span>
                      {packet.anomalyScore > 0.7 && (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setShowDetails(showDetails === packet.id ? null : packet.id)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {showDetails === packet.id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredActivity.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No network activity matches the current filter</p>
          </div>
        )}
      </div>

      {/* Packet Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Packet Details</h3>
              <button
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            {/* Packet detail content would go here */}
            <div className="text-sm text-gray-300">
              <p>Detailed packet analysis and ML feature extraction results would be displayed here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkMonitor;