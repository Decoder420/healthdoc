import { ReactNode } from "react";

export interface FormSectionProps {
  title: string;

  description?: string;

  children: ReactNode;
}