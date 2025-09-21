import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MLDetector } from '../utils/mlDetector';
import { LogManager } from '../utils/logManager';
import { NetworkSimulator } from '../utils/networkSimulator';
import { EncryptionManager } from '../utils/encryption';

interface SecurityState {
  systemStatus: 'active' | 'inactive' | 'maintenance';
  threats: Threat[];
  logs: SecureLog[];
  networkActivity: NetworkPacket[];
  blockedIPs: string[];
  alerts: Alert[];
  metrics: SystemMetrics;
  mlModel: any;
}

interface Threat {
  id: string;
  timestamp: Date;
  source: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  blocked: boolean;
}

interface SecureLog {
  id: string;
  timestamp: Date;
  event: string;
  hash: string;
  previousHash: string;
  encrypted: boolean;
}

interface NetworkPacket {
  id: string;
  timestamp: Date;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  anomalyScore: number;
}

interface Alert {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  acknowledged: boolean;
}

interface SystemMetrics {
  packetsProcessed: number;
  threatsDetected: number;
  threatsBlocked: number;
  systemUptime: number;
  cpuUsage: number;
  memoryUsage: number;
}

const SecurityContext = createContext<{
  state: SecurityState;
  dispatch: React.Dispatch<any>;
  mlDetector: MLDetector;
  logManager: LogManager;
  networkSim: NetworkSimulator;
  encryption: EncryptionManager;
} | null>(null);

const initialState: SecurityState = {
  systemStatus: 'active',
  threats: [],
  logs: [],
  networkActivity: [],
  blockedIPs: [],
  alerts: [],
  metrics: {
    packetsProcessed: 0,
    threatsDetected: 0,
    threatsBlocked: 0,
    systemUptime: 0,
    cpuUsage: 15,
    memoryUsage: 32,
  },
  mlModel: null,
};

function securityReducer(state: SecurityState, action: any): SecurityState {
  switch (action.type) {
    case 'ADD_THREAT':
      return {
        ...state,
        threats: [action.payload, ...state.threats.slice(0, 99)],
        metrics: {
          ...state.metrics,
          threatsDetected: state.metrics.threatsDetected + 1,
        },
      };

    case 'BLOCK_IP':
      return {
        ...state,
        blockedIPs: [...state.blockedIPs, action.payload],
        metrics: {
          ...state.metrics,
          threatsBlocked: state.metrics.threatsBlocked + 1,
        },
      };

    case 'ADD_LOG':
      return {
        ...state,
        logs: [action.payload, ...state.logs.slice(0, 999)],
      };

    case 'ADD_NETWORK_ACTIVITY':
      return {
        ...state,
        networkActivity: [action.payload, ...state.networkActivity.slice(0, 499)],
        metrics: {
          ...state.metrics,
          packetsProcessed: state.metrics.packetsProcessed + 1,
        },
      };

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts.slice(0, 99)],
      };

    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload },
      };

    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload ? { ...alert, acknowledged: true } : alert
        ),
      };

    default:
      return state;
  }
}

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(securityReducer, initialState);
  const mlDetector = new MLDetector();
  const logManager = new LogManager();
  const networkSim = new NetworkSimulator();
  const encryption = new EncryptionManager();

  useEffect(() => {
    // Initialize ML model
    mlDetector.initialize().then(() => {
      console.log('ML Detector initialized');
    });

    // Start network simulation
    const networkInterval = setInterval(() => {
      const packet = networkSim.generatePacket();
      const anomalyScore = mlDetector.analyzePacket(packet);
      
      const networkPacket = {
        ...packet,
        anomalyScore,
      };

      dispatch({ type: 'ADD_NETWORK_ACTIVITY', payload: networkPacket });

      // Check for anomalies
      if (anomalyScore > 0.7) {
        const threat: Threat = {
          id: `threat_${Date.now()}`,
          timestamp: new Date(),
          source: packet.source,
          type: 'Anomalous Network Activity',
          severity: anomalyScore > 0.9 ? 'critical' : anomalyScore > 0.8 ? 'high' : 'medium',
          description: `Suspicious traffic detected from ${packet.source}`,
          blocked: false,
        };

        dispatch({ type: 'ADD_THREAT', payload: threat });

        // Auto-block critical threats
        if (threat.severity === 'critical') {
          dispatch({ type: 'BLOCK_IP', payload: packet.source });
          
          const alert: Alert = {
            id: `alert_${Date.now()}`,
            timestamp: new Date(),
            type: 'IP_BLOCKED',
            message: `Critical threat detected and blocked: ${packet.source}`,
            severity: 'critical',
            acknowledged: false,
          };

          dispatch({ type: 'ADD_ALERT', payload: alert });
        }

        // Log the threat
        const logEntry = logManager.createSecureLog({
          event: `THREAT_DETECTED: ${threat.type} from ${threat.source}`,
          severity: threat.severity,
        });

        dispatch({ type: 'ADD_LOG', payload: logEntry });
      }
    }, 1000 + Math.random() * 2000);

    // Update system metrics
    const metricsInterval = setInterval(() => {
      dispatch({
        type: 'UPDATE_METRICS',
        payload: {
          systemUptime: state.metrics.systemUptime + 1,
          cpuUsage: 10 + Math.random() * 20,
          memoryUsage: 25 + Math.random() * 15,
        },
      });
    }, 1000);

    return () => {
      clearInterval(networkInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return (
    <SecurityContext.Provider value={{ state, dispatch, mlDetector, logManager, networkSim, encryption }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}