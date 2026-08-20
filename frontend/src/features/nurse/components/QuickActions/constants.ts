import { QuickAction } from "./QuickActions.types";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "vitals",
    label: "Add Vitals",
    icon: "🩺",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "note",
    label: "Nursing Note",
    icon: "📝",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "incident",
    label: "Incident Report",
    icon: "⚠️",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "medication",
    label: "Medication",
    icon: "💊",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "transfer",
    label: "Ward transfer",
    icon: "🚑",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "doctor",
    label: "Call Doctor",
    icon: "👨‍⚕️",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "history",
    label: "View History",
    icon: "📋",
    color: "bg-slate-100 text-slate-700",
  },
];