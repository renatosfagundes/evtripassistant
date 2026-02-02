import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Battery, Gauge, Car, Navigation, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TripData, vehicleModels } from '@/lib/evCalculations';
import LoadingSpinner from './LoadingSpinner';

interface EVFormProps {
  onSubmit: (data: TripData) => Promise<void>;
  isLoading: boolean;
}

export const EVForm = ({ onSubmit, isLoading }: EVFormProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [batteryRange, setBatteryRange] = useState([350]);
  const [currentCharge, setCurrentCharge] = useState([80]);
  const [vehicleModel, setVehicleModel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!origin.trim()) {
      newErrors.origin = 'Origem é obrigatória';
    }
    if (!destination.trim()) {
      newErrors.destination = 'Destino é obrigatório';
    }
    if (!vehicleModel) {
      newErrors.vehicleModel = 'Selecione um modelo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit({
      origin: origin.trim(),
      destination: destination.trim(),
      batteryRange: batteryRange[0],
      currentCharge: currentCharge[0],
      vehicleModel,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit}
      className="glass-card rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Navigation className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Planejamento de Viagem</h2>
      </div>

      {/* Origin */}
      <div className="space-y-2">
        <Label htmlFor="origin" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ev-green" />
          Origem
        </Label>
        <Input
          id="origin"
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            if (errors.origin) setErrors({ ...errors, origin: '' });
          }}
          placeholder="Ex: São Paulo, SP"
          className={errors.origin ? 'border-destructive' : ''}
        />
        {errors.origin && (
          <p className="text-xs text-destructive">{errors.origin}</p>
        )}
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-secondary" />
          Destino
        </Label>
        <Input
          id="destination"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            if (errors.destination) setErrors({ ...errors, destination: '' });
          }}
          placeholder="Ex: Rio de Janeiro, RJ"
          className={errors.destination ? 'border-destructive' : ''}
        />
        {errors.destination && (
          <p className="text-xs text-destructive">{errors.destination}</p>
        )}
      </div>

      {/* Vehicle Model */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Car className="w-4 h-4 text-muted-foreground" />
          Modelo do Veículo
        </Label>
        <Select
          value={vehicleModel}
          onValueChange={(value) => {
            setVehicleModel(value);
            if (errors.vehicleModel) setErrors({ ...errors, vehicleModel: '' });
          }}
        >
          <SelectTrigger className={errors.vehicleModel ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selecione seu veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicleModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vehicleModel && (
          <p className="text-xs text-destructive">{errors.vehicleModel}</p>
        )}
      </div>

      {/* Battery Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            Autonomia da Bateria
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Autonomia máxima do veículo com carga completa</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <span className="text-sm font-medium text-primary">
            {batteryRange[0]} km
          </span>
        </div>
        <Slider
          value={batteryRange}
          onValueChange={setBatteryRange}
          min={100}
          max={600}
          step={10}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100 km</span>
          <span>600 km</span>
        </div>
      </div>

      {/* Current Charge Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-ev-green" />
            Carga Atual
          </Label>
          <span className="text-sm font-medium text-ev-green">
            {currentCharge[0]}%
          </span>
        </div>
        <Slider
          value={currentCharge}
          onValueChange={setCurrentCharge}
          min={10}
          max={100}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold py-5"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" text="Calculando..." />
        ) : (
          <>
            <Navigation className="w-4 h-4 mr-2" />
            Calcular Rota
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default EVForm;
