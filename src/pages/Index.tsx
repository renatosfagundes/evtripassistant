import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, BarChart3, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EVForm from '@/components/EVForm';
import RouteCard from '@/components/RouteCard';
import ChatBot from '@/components/ChatBot';
import Dashboard from '@/components/Dashboard';
import { TripData, RouteResult } from '@/lib/evCalculations';
import { planTrip, getEfficiencyDashboard } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { RouteMap } from '@/components/RouteMap';

const Index = () => {
  type RouteErrorType = { message: string; suggestion?: string } | null;
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeMapData, setRouteMapData] = useState<any | null>(null);
  const [routeError, setRouteError] = useState<RouteErrorType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleCalculateRoute = async (data: TripData) => {
    setIsLoading(true);
    setRouteMapData(null);
    setRouteError(null);
    try {
      const autonomy = data.batteryRange;
      const response = await planTrip(data.origin, data.destination, autonomy);
      if (response.success && response.data) {
        const backend = response.data;
        // If backend error object exists, show formatted error window
        if (backend.error) {
          setRouteError({
            message: backend.error.message,
            suggestion: backend.error.suggestion,
          });
          toast({
            title: 'Erro ao calcular rota',
            description: backend.error.message,
            variant: 'destructive',
          });
          return;
        }
        // Map backend response to RouteResult shape if needed
        const result: RouteResult = {
          totalDistance: backend.distanceTotal,
          stopsNeeded: backend.requiredStops,
          durationTotal: backend.durationTotal || '',
          origin: backend.origin,
          destination: backend.destination,
          chargingStops: backend.chargingStops || [],
        };
        setTripData(data);
        setRouteResult(result);
        setRouteMapData({
          polyline: backend.routeGeometry,
          origin: {
            lat: backend.origin.lat,
            lng: backend.origin.lon,
            name: backend.origin.displayName,
          },
          destination: {
            lat: backend.destination.lat,
            lng: backend.destination.lon,
            name: backend.destination.displayName,
          },
          chargingStops: (backend.chargingStops || []).map(stop => ({
            lat: stop.lat,
            lng: stop.lon,
            name: stop.name,
            address: stop.address,
            chargingTime: stop.chargingTime,
            id: stop.id,
          })),
          distance: backend.distanceTotal * 1000,
          duration: backend.durationTotal,
        });
        if (window.innerWidth < 1024) {
          setFormCollapsed(true);
        }
      } else {
        let errorMsg = response.message || 'Erro desconhecido do servidor.';
        if (response.chatMessage) {
          errorMsg += '\n\n' + response.chatMessage;
        }
        setRouteError({ message: errorMsg });
        toast({
          title: 'Erro ao calcular rota',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setRouteError(error?.message || 'Erro desconhecido ao conectar ao servidor.');
      toast({
        title: 'Erro de rede',
        description: error?.message || 'Erro desconhecido ao conectar ao servidor.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshDashboard = async () => {
    if (tripData && routeResult) {
      setIsLoading(true);
      try {
        // Use totalDistance and battery percentage for dashboard
        const dist = routeResult.totalDistance;
        const bat = tripData.currentCharge;
        const response = await getEfficiencyDashboard(dist, bat);
        if (response.success && response.data) {
          // Optionally, update routeResult with new metrics if needed
          // Optionally, update routeResult with new metrics if needed
          // No costEstimate field anymore
          // Optionally, store consumptionGraph in state if needed for chart
        }
      } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Error Window for Route Calculation */}
      <AnimatePresence>
        {routeError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 z-[100] w-full max-w-lg -translate-x-1/2 bg-destructive text-destructive-foreground border border-destructive rounded-lg shadow-lg p-6 flex flex-col gap-3"
            style={{ whiteSpace: 'pre-line' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-lg">Erro ao calcular rota</div>
              <X className="w-5 h-5 flex-shrink-0 cursor-pointer" onClick={() => setRouteError(null)} role="button" aria-label="Fechar erro" />
            </div>
            <div className="text-base font-semibold mb-2">{routeError.message}</div>
            {routeError.suggestion && (
              <div className="bg-background/80 rounded-md p-3 text-sm overflow-y-auto max-h-96 border border-border">
                <div className="font-bold mb-2">Sugestão e Explicação</div>
                <div dangerouslySetInnerHTML={{ __html: routeError.suggestion.replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-green">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">EV Trip Assistant</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Planejamento inteligente para veículos elétricos
                </p>
              </div>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MessageCircle className="w-4 h-4 mr-2" />
                Assistente
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card border-b border-border"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start text-muted-foreground"
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-muted-foreground"
                onClick={() => {
                  setActiveTab('chat');
                  setMobileMenuOpen(false);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Assistente
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Form & Results */}
          <div className="lg:col-span-5 space-y-4">
            {/* Collapsible Form on Mobile */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                className="w-full justify-between text-foreground mb-2"
                onClick={() => setFormCollapsed(!formCollapsed)}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Planejamento de Viagem
                </span>
                {formCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Form */}
            <AnimatePresence>
              {(!formCollapsed || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <EVForm onSubmit={handleCalculateRoute} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Route Results */}
            <AnimatePresence>
              {routeResult && tripData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <RouteCard
                    result={routeResult}
                    origin={tripData.origin}
                    destination={tripData.destination}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Show RouteMap after successful route calculation */}
            {routeMapData && (
              <div className="mt-6">
                <RouteMap 
                  routeData={routeMapData} 
                  origin={routeMapData.origin}
                  destination={routeMapData.destination}
                  waypoints={routeMapData.chargingStops}
                />
              </div>
            )}
          </div>

          {/* Right Column - Dashboard & Chat */}
          <div className="lg:col-span-7">
            {/* Desktop: Side by side */}
            <div className="hidden lg:block space-y-6">
              <Dashboard
                tripData={tripData}
                routeResult={routeResult}
                onRefresh={handleRefreshDashboard}
              />
              <ChatBot />
            </div>

            {/* Mobile: Tabs */}
            <div className="lg:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Assistente
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard">
                  <Dashboard
                    tripData={tripData}
                    routeResult={routeResult}
                    onRefresh={handleRefreshDashboard}
                  />
                </TabsContent>
                <TabsContent value="chat">
                  <ChatBot />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              ⚡ <span className="gradient-text font-semibold">EV Trip Assistant</span> - Projeto Final
            </p>
            <p className="text-xs">
              Desenvolvimento de Software Embarcado Automotivo © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
