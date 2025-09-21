import React from 'react';
import { Network, AlertCircle, CheckCircle } from 'lucide-react';

interface Threat {
  id: string;
  timestamp: Date;
  source: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  blocked: boolean;
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

interface RecentActivityProps {
  threats: Threat[];
  networkActivity: NetworkPacket[];
}

function RecentActivity({ threats, networkActivity }: RecentActivityProps) {
  // Combine and sort activities by timestamp
  const combinedActivity = [
    ...threats.map(threat => ({
      ...threat,
      type: 'threat' as const,
      score: threat.severity,
    })),
    ...networkActivity.map(packet => ({
      ...packet,
      type: 'network' as const,
      score: packet.anomalyScore > 0.7 ? 'suspicious' : 'normal',
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Network className="w-4 h-4" />
          <span>Live Feed</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {combinedActivity.map((activity, index) => (
          <div key={`${activity.type}-${activity.id}`} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors animate-slide-in">
            <div className={`w-2 h-2 rounded-full ${
              activity.type === 'threat' 
                ? activity.score === 'critical' ? 'bg-red-500' :
                  activity.score === 'high' ? 'bg-orange-500' :
                  activity.score === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                : activity.score === 'suspicious' ? 'bg-red-400' : 'bg-green-400'
            }`}></div>
            
            <div className={`p-1 rounded ${
              activity.type === 'threat' ? 'bg-red-500/20' : 'bg-blue-500/20'
            }`}>
              {activity.type === 'threat' ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : (
                <Network className="w-4 h-4 text-blue-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">
                  {activity.type === 'threat' ? activity.source : `${activity.source} → ${activity.destination}`}
                </div>
                <div className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {activity.type === 'threat' 
                  ? (activity as any).description 
                  : `${(activity as any).protocol} - ${(activity as any).size} bytes`
                }
              </div>
            </div>

            {activity.type === 'threat' && (activity as any).blocked && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        ))}

        {combinedActivity.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Network className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivity;