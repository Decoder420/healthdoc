import { QueueItem } from "@/features/pharmacy/types/index";

export interface DashboardStats {
  todayPrescriptions: number;
  waitingQueue: number;
  dispensedToday: number;
  onHold: number;
  clarificationPending: number;
}

export type InventoryNotificationType =
  | "low Stock"
  | "expiry"
  | "stock Update";

export interface InventoryNotification {
  id: string;
  
  message: string;
    medicineName: string;

  type: InventoryNotificationType;
  createdAt: string;
}

export interface RecentDispense {
  id: string;
  receiptNumber: string;
  patientName: string;
  medicines: number;
  dispensedBy: string;
  dispensedAt: string;
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  route: string;
}

export interface PharmacyDashboardData {
  stats: DashboardStats;
  todayQueue: QueueItem[];
  inventoryNotifications: InventoryNotification[];
  recentDispenses: RecentDispense[];
  quickActions: QuickAction[];
  activityTimeline: ActivityTimelineItem[];
}