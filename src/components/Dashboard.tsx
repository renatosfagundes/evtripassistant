import { motion } from 'framer-motion';
import { Battery, Zap, DollarSign, TrendingUp, RefreshCw, Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';
import MetricCard from './MetricCard';
import { RouteResult, TripData, generateConsumptionData, vehicleConsumption } from '@/lib/evCalculations';

interface DashboardProps {
  tripData: TripData | null;
  routeResult: RouteResult | null;
  onRefresh?: () => void;
}

export const Dashboard = ({ tripData, routeResult, onRefresh }: DashboardProps) => {
  // Generate chart data
  const chartData = tripData && routeResult 
    ? generateConsumptionData(tripData, routeResult)
    : [
        { km: 0, consumo: 15, media: 16 },
        { km: 50, consumo: 16.5, media: 16 },
        { km: 100, consumo: 15.2, media: 16 },
        { km: 150, consumo: 17.1, media: 16 },
        { km: 200, consumo: 16.3, media: 16 },
      ];

  // Calculate metrics
  const remainingRange = tripData && routeResult
    ? Math.round((tripData.batteryRange * tripData.currentCharge / 100) - (routeResult.totalDistance % tripData.batteryRange))
    : '--';

  const avgEfficiency = tripData
    ? vehicleConsumption[tripData.vehicleModel] || 16
    : '--';

  // No costEstimate or energyConsumption in new RouteResult
  const estimatedCost = 'R$ --';
  const efficiency = undefined;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-semibold">Dashboard de Eficiência</h2>
        </div>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          title="Autonomia Restante"
          value={typeof remainingRange === 'number' ? Math.max(0, remainingRange) : remainingRange}
          unit="km"
          icon={Battery}
          variant="green"
          tooltip="Autonomia estimada após a viagem"
        />
        <MetricCard
          title="Eficiência Média"
          value={avgEfficiency}
          unit="kWh/100km"
          icon={Gauge}
          variant="blue"
          trend={efficiency}
          tooltip="Consumo médio do veículo"
        />
        {/* Custo Estimado removed: not available in new RouteResult */}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium">Consumo por Trecho</h3>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height={192} minWidth={200} minHeight={120}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="consumoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(153, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(153, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="km" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(233, 15%, 65%)', fontSize: 12 }}
                tickFormatter={(value) => `${value}km`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(233, 15%, 65%)', fontSize: 12 }}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(233, 33%, 18%)',
                  border: '1px solid hsl(233, 25%, 25%)',
                  borderRadius: '8px',
                  color: 'white',
                }}
                labelFormatter={(value) => `${value} km`}
                formatter={(value: number) => [`${value} kWh/100km`, 'Consumo']}
              />
              <Area
                type="monotone"
                dataKey="consumo"
                stroke="hsl(153, 100%, 50%)"
                strokeWidth={2}
                fill="url(#consumoGradient)"
              />
              <Line
                type="monotone"
                dataKey="media"
                stroke="hsl(210, 100%, 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Consumo Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-secondary" style={{ borderStyle: 'dashed' }} />
            <span className="text-xs text-muted-foreground">Média Esperada</span>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {!tripData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 text-muted-foreground"
        >
          <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">
            Preencha o formulário de viagem para ver<br />métricas personalizadas
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
