export interface Category {
  id: string;

  code: string;
  name: string;

  description?: string;

  itemCount: number;

  isActive: boolean;

  createdAt: string;
}