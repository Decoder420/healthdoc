export interface Ward {
  id: string;
  name: string;
}

export interface WardSelectorProps {
  wards: Ward[];
  selectedWard: string;
  onChange: (wardId: string) => void;
}