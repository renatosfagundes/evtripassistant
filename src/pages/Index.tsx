import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, BarChart3, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EVForm from '@/components/EVForm';
import RouteCard from '@/components/RouteCard';
import ChatBot from '@/components/ChatBot';
import Dashboard from '@/components/Dashboard';
import { TripData, RouteResult, calculateRoute } from '@/lib/evCalculations';

const Index = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleCalculateRoute = async (data: TripData) => {
    setIsLoading(true);
    try {
      const result = await calculateRoute(data);
      setTripData(data);
      setRouteResult(result);
      // On mobile, collapse form after calculation
      if (window.innerWidth < 1024) {
        setFormCollapsed(true);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshDashboard = async () => {
    if (tripData) {
      setIsLoading(true);
      const result = await calculateRoute(tripData);
      setRouteResult(result);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
