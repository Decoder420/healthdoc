export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface QuickActionsProps {
  onAction?: (actionId: string) => void;
}