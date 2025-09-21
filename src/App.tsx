import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import NetworkMonitor from './components/NetworkMonitor';
import LogViewer from './components/LogViewer';
import AlertSystem from './components/AlertSystem';
import Configuration from './components/Configuration';
import { Shield, Activity, FileText, Bell, Settings } from 'lucide-react';
import { SecurityProvider } from './contexts/SecurityContext';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'monitor', label: 'Network Monitor', icon: Activity },
    { id: 'logs', label: 'Immutable Logs', icon: FileText },
    { id: 'alerts', label: 'Alert System', icon: Bell },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <SecurityProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800 border-b border-green-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Advanced IDS/IPS System
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">System Active</span>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-gray-800/50 px-6 py-3 border-b border-gray-700">
          <div className="flex space-x-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'monitor' && <NetworkMonitor />}
          {activeTab === 'logs' && <LogViewer />}
          {activeTab === 'alerts' && <AlertSystem />}
          {activeTab === 'config' && <Configuration />}
        </main>
      </div>
    </SecurityProvider>
  );
}

export default App;