import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
}

function MetricsCard({ title, value, icon: Icon, color, change }: MetricsCardProps) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm text-gray-400">{change}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  );
}

export default MetricsCard;