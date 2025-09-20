import React, { useState } from 'react';
import { Settings, Shield, Key, Network, Save, RefreshCw } from 'lucide-react';

function Configuration() {
  const [activeSection, setActiveSection] = useState('system');
  const [config, setConfig] = useState({
    system: {
      autoBlock: true,
      anomalyThreshold: 0.7,
      logRetention: 30,
      encryptionEnabled: true,
    },
    network: {
      monitorInterface: 'eth0',
      packetBufferSize: 1000,
      analysisDepth: 'deep',
      protocolFilter: ['TCP', 'UDP', 'ICMP'],
    },
    ml: {
      modelType: 'autoencoder',
      trainingInterval: 24,
      featureExtraction: 'advanced',
      adaptiveLearning: true,
    },
    security: {
      encryptionAlgorithm: 'AES-256',
      hashChaining: true,
      keyRotation: 7,
      backupLocation: '/secure/backups',
    },
  });

  const sections = [
    { id: 'system', label: 'System', icon: Settings },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'ml', label: 'ML Models', icon: RefreshCw },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    console.log('Configuration saved:', config);
    // In a real implementation, this would save to backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">System Configuration</h2>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
            <nav className="space-y-2">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            {activeSection === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">System Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-3 mb-4">
                        <input
                          type="checkbox"
                          checked={config.system.autoBlock}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            system: { ...prev.system, autoBlock: e.target.checked }
                          }))}
                          className="form-checkbox text-blue-500"
                        />
                        <span className="text-white">Enable Automatic IP Blocking</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Anomaly Detection Threshold
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={config.system.anomalyThreshold}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          system: { ...prev.system, anomalyThreshold: parseFloat(e.target.value) }
                        }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1</span>
                        <span>{config.system.anomalyThreshold}</span>
                        <span>1.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Log Retention (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={config.system.logRetention}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          system: { ...prev.system, logRetention: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.system.encryptionEnabled}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            system: { ...prev.system, encryptionEnabled: e.target.checked }
                          }))}
                          className="form-checkbox text-blue-500"
                        />
                        <span className="text-white">Enable Log Encryption</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'network' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Network Monitoring</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Network Interface
                      </label>
                      <select
                        value={config.network.monitorInterface}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          network: { ...prev.network, monitorInterface: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value="eth0">eth0</option>
                        <option value="wlan0">wlan0</option>
                        <option value="any">Any</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Packet Buffer Size
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="10000"
                        value={config.network.packetBufferSize}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          network: { ...prev.network, packetBufferSize: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Analysis Depth
                      </label>
                      <select
                        value={config.network.analysisDepth}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          network: { ...prev.network, analysisDepth: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="deep">Deep</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Protocol Filters
                      </label>
                      <div className="space-y-2">
                        {['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'].map(protocol => (
                          <label key={protocol} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={config.network.protocolFilter.includes(protocol)}
                              onChange={(e) => {
                                const updatedFilter = e.target.checked
                                  ? [...config.network.protocolFilter, protocol]
                                  : config.network.protocolFilter.filter(p => p !== protocol);
                                setConfig(prev => ({
                                  ...prev,
                                  network: { ...prev.network, protocolFilter: updatedFilter }
                                }));
                              }}
                              className="form-checkbox text-blue-500"
                            />
                            <span className="text-white">{protocol}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'ml' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Machine Learning Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ML Model Type
                      </label>
                      <select
                        value={config.ml.modelType}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          ml: { ...prev.ml, modelType: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value="autoencoder">Autoencoder + Isolation Forest</option>
                        <option value="lstm">LSTM Neural Network</option>
                        <option value="ensemble">Ensemble Model</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Model Retraining Interval (hours)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={config.ml.trainingInterval}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          ml: { ...prev.ml, trainingInterval: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Feature Extraction Level
                      </label>
                      <select
                        value={config.ml.featureExtraction}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          ml: { ...prev.ml, featureExtraction: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.ml.adaptiveLearning}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            ml: { ...prev.ml, adaptiveLearning: e.target.checked }
                          }))}
                          className="form-checkbox text-blue-500"
                        />
                        <span className="text-white">Enable Adaptive Learning</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Security & Encryption</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Encryption Algorithm
                      </label>
                      <select
                        value={config.security.encryptionAlgorithm}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          security: { ...prev.security, encryptionAlgorithm: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value="AES-256">AES-256</option>
                        <option value="AES-192">AES-192</option>
                        <option value="ChaCha20">ChaCha20-Poly1305</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.security.hashChaining}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            security: { ...prev.security, hashChaining: e.target.checked }
                          }))}
                          className="form-checkbox text-blue-500"
                        />
                        <span className="text-white">Enable Hash Chaining</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Rotation Interval (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={config.security.keyRotation}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          security: { ...prev.security, keyRotation: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Backup Location
                      </label>
                      <input
                        type="text"
                        value={config.security.backupLocation}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          security: { ...prev.security, backupLocation: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Encryption Key Management</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Encryption keys are automatically generated and rotated. Keys are securely transmitted to the admin device for backup purposes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuration;