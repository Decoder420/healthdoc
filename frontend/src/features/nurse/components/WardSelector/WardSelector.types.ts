export interface Ward {
  id: string;
  name: string;
  department_id: string | null;
  facility_id: string;
  is_active: boolean;
}

export interface WardSelectorProps {
  wards: Ward[];
  selectedWard: string;
  onChange: (wardId: string) => void;
}