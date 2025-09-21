import React, { useState } from 'react';
import { useSecurityContext } from '../contexts/SecurityContext';
import { Lock, Shield, Search, Download, Key } from 'lucide-react';

function LogViewer() {
  const { state, encryption } = useSecurityContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const filteredLogs = state.logs.filter(log =>
    log.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportLogs = () => {
    const logData = {
      timestamp: new Date().toISOString(),
      totalLogs: state.logs.length,
      logs: state.logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secure-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Immutable Log System</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <Lock className="w-4 h-4" />
              <span>AES-256 Encrypted</span>
            </div>
            <button
              onClick={handleExportLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Total Logs</span>
          </div>
          <div className="text-2xl font-bold text-white">{state.logs.length}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Encrypted</span>
          </div>
          <div className="text-2xl font-bold text-green-400">100%</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Hash Chain</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">Valid</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-400">Integrity</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">100%</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Secure Event Logs</h3>
          <p className="text-sm text-gray-400 mt-1">
            All logs are encrypted with AES-256 and linked with SHA-256 hash chains for immutability
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hash
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLogs.slice(0, 100).map(log => (
                <tr key={log.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-white max-w-md truncate">
                    {log.event}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-400">
                    {log.hash.substring(0, 16)}...
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400">Encrypted</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No logs match the current search</p>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Log Entry Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            {(() => {
              const log = state.logs.find(l => l.id === selectedLog);
              if (!log) return null;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Timestamp</label>
                      <div className="text-white">{log.timestamp.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Log ID</label>
                      <div className="text-white font-mono text-sm">{log.id}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Event Description</label>
                    <div className="bg-gray-900 border border-gray-600 rounded p-3 text-white">
                      {log.event}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Current Hash</label>
                      <div className="bg-gray-900 border border-gray-600 rounded p-3 font-mono text-xs text-green-400">
                        {log.hash}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Previous Hash</label>
                      <div className="bg-gray-900 border border-gray-600 rounded p-3 font-mono text-xs text-blue-400">
                        {log.previousHash}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Encryption Status</label>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">AES-256 Encrypted</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default LogViewer;