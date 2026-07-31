export type EmarStatus = "due" | "given" | "held" | "missed" | "refused";

export type EmarRow = {
  id: string;
  medication: string;
  dose: string;
  route: string;
  scheduledAt: string;
  status: EmarStatus;
  nurse?: string;
};
