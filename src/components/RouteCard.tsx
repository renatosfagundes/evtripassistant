import { motion } from 'framer-motion';
import { MapPin, Clock, Zap, Battery, DollarSign, Navigation } from 'lucide-react';
import { RouteResult, formatTime } from '@/lib/evCalculations';

interface RouteCardProps {
  result: RouteResult;
  origin: string;
  destination: string;
}

export const RouteCard = ({ result, origin, destination }: RouteCardProps) => {
  const metrics = [
    {
      icon: Navigation,
      label: 'Distância Total',
      value: `${result.totalDistance}`,
      unit: 'km',
      color: 'text-secondary',
    },
    {
      icon: Battery,
      label: 'Paradas p/ Carga',
      value: result.stopsNeeded.toString(),
      unit: result.stopsNeeded === 1 ? 'parada' : 'paradas',
      color: 'text-ev-green',
    },
    {
      icon: Clock,
      label: 'Tempo Estimado',
      value: result.durationTotal || '',
      unit: '',
      color: 'text-ev-blue',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl p-5 gradient-border"
    >
      {/* Route Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        <div className="flex-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ev-green" />
            <span className="text-sm font-medium truncate" title={result.origin.displayName}>
              {result.origin.displayName.length > 32
                ? result.origin.displayName.slice(0, 32) + '...'
                : result.origin.displayName}
            </span>
        </div>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <span className="text-muted-foreground">→</span>
        </motion.div>
        <div className="flex-1 flex items-center gap-2 justify-end">
            <span className="text-sm font-medium truncate" title={result.destination.displayName}>
              {result.destination.displayName.length > 32
                ? result.destination.displayName.slice(0, 32) + '...'
                : result.destination.displayName}
            </span>
          <MapPin className="w-4 h-4 text-secondary" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-muted/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">{metric.value}</span>
              {metric.unit && (
                <span className="text-xs text-muted-foreground">{metric.unit}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charging Info */}
      {/* Optionally show charging stops or summary here if needed */}
    </motion.div>
  );
};

export default RouteCard;
