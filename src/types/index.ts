
// Forklift Types
export enum ForkliftType {
  GAS = "Gas",
  ELECTRIC = "Electrical",
  RETRACTABLE = "Retractable"
}

export enum ForkliftStatus {
  OPERATIONAL = "In Operation",
  STOPPED = "Stop",
  MAINTENANCE = "Waiting for Maintenance"
}

export interface Forklift {
  id: string;
  model: string;
  type: ForkliftType;
  capacity: string;
  acquisitionDate: string;
  lastMaintenance: string;
  status: ForkliftStatus;
  hourMeter: number;
}

// User/Operator Types
export enum UserRole {
  OPERATOR = "Operator",
  SUPERVISOR = "Supervisor",
  ADMIN = "Administrador"
}

export enum CertificateStatus {
  REGULAR = "Regular",
  WARNING = "Near Expiration",
  EXPIRED = "Expired"
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  cpf: string;
  contact: string;
  shift: string;
  registrationDate: string;
  asoExpirationDate: string;
  nrExpirationDate: string;
  asoStatus: CertificateStatus;
  nrStatus: CertificateStatus;
}

// Operation Types
export interface Operation {
  id: string;
  operatorId: string;
  operatorName: string;
  forkliftId: string;
  forkliftModel: string;
  sector: string;
  initialHourMeter: number;
  currentHourMeter?: number;
  gasConsumption?: number;
  startTime: string;
  endTime?: string;
  status: "active" | "completed";
}

// Maintenance Types
export enum MaintenanceStatus {
  WAITING = "Waiting",
  IN_PROGRESS = "In progress",
  COMPLETED = "Completed"
}

export interface Maintenance {
  id: string;
  forkliftId: string;
  forkliftModel: string;
  issue: string;
  reportedBy: string;
  reportedDate: string;
  status: MaintenanceStatus;
  completedDate?: string;
}

// Gas Supply Types
export interface GasSupply {
  id: string;
  date: string;
  forkliftId: string;
  forkliftModel: string;
  quantity: number;
  hourMeterBefore: number;
  hourMeterAfter: number;
  operator: string;
}

// Dashboard Types
export interface DashboardStats {
  totalForklifts: number;
  operationalForklifts: number;
  stoppedForklifts: number;
  maintenanceForklifts: number;
  totalOperators: number;
  operatorsWithValidCertificates: number;
  operatorsWithWarningCertificates: number;
  operatorsWithExpiredCertificates: number;
  activeOperations: number;
  pendingMaintenances: number;
}

// Common Component Props
export interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
}
