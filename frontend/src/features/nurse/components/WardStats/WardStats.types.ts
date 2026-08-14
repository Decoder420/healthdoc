export interface WardStat {
  id: string;
  title: string;
  value: number;
  description: string;
}

export interface WardStatsProps {
  stats: WardStat[];
}