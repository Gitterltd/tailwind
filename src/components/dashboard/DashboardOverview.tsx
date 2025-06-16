
import React from 'react';
import StatusCard from './StatusCard';
import { 
  Truck, Users, AlertTriangle, CheckCircle, 
  Clock, Fuel, Settings, Calendar
} from 'lucide-react';
import { DashboardStats } from '@/types';

// Mock data for initial rendering
const initialStats: DashboardStats = {
  totalForklifts: 15,
  operationalForklifts: 9,
  stoppedForklifts: 3,
  maintenanceForklifts: 3,
  totalOperators: 20,
  operatorsWithValidCertificates: 16,       
  operatorsWithWarningCertificates: 3,
  operatorsWithExpiredCertificates: 1,
  activeOperations: 7,
  pendingMaintenances: 4
};

interface DashboardOverviewProps {
  stats?: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats = initialStats 
}) => {
  return (
    <section className="space-y-6">                   
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-semibold mb-4">  </h2>                                             
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total Forklifts" 
            value={stats.totalForklifts} 
            icon={Truck} 
            status="info" 
          />
          <StatusCard 
            title="In Operation" 
            value={stats.operationalForklifts} 
            icon={CheckCircle} 
            status="success"
            change={{ value: 12, trend: 'up' }}
          />
          <StatusCard 
            title="Under Maintenance" 
            value={stats.maintenanceForklifts} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Stops" 
            value={stats.stoppedForklifts} 
            icon={Clock} 
            status="neutral" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Operator Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total Operators" 
            value={stats.totalOperators} 
            icon={Users} 
            status="info" 
          />
          <StatusCard 
            title="Regular ASO and NR" 
            value={stats.operatorsWithValidCertificates} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Near Expiration" 
            value={stats.operatorsWithWarningCertificates} 
            icon={AlertTriangle} 
            status="warning" 
          />
          <StatusCard 
            title="ASO/NR Expired" 
            value={stats.operatorsWithExpiredCertificates} 
            icon={AlertTriangle} 
            status="danger" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-4">Current Operation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Active Operations" 
            value={stats.activeOperations} 
            icon={Truck} 
            status="success"
            change={{ value: 5, trend: 'up' }}
          />
          <StatusCard 
            title="Pending Maintenance" 
            value={stats.pendingMaintenances} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Supplies Today" 
            value={3} 
            icon={Fuel} 
            status="info" 
          />
          <StatusCard 
            title="ASOs due (30d)" 
            value={4} 
            icon={Calendar} 
            status="warning" 
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
