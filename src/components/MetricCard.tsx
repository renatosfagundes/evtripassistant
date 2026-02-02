import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  tooltip?: string;
  variant?: 'green' | 'blue' | 'default';
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  tooltip,
  variant = 'default',
  trend,
}: MetricCardProps) => {
  const variantStyles = {
    green: 'border-ev-green/30 hover:border-ev-green/50',
    blue: 'border-secondary/30 hover:border-secondary/50',
    default: 'border-border hover:border-muted-foreground/50',
  };

  const iconStyles = {
    green: 'text-ev-green',
    blue: 'text-secondary',
    default: 'text-muted-foreground',
  };

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-lg p-4 transition-all duration-300 cursor-default ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <motion.span
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-bold text-foreground"
            >
              {value}
            </motion.span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {trend && (
            <div className="mt-1">
              <span
                className={`text-xs ${
                  trend === 'up'
                    ? 'text-ev-green'
                    : trend === 'down'
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }`}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}{' '}
                {trend === 'up' ? 'Acima' : trend === 'down' ? 'Abaixo' : 'Na'} da média
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-2 rounded-lg bg-muted/50 ${iconStyles[variant]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{CardContent}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return CardContent;
};

export default MetricCard;
