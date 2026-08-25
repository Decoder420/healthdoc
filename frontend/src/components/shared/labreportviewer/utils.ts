// reportviewer/utils.ts

import { format } from "date-fns";
import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  EMPTY_VALUE,
  RESULT_FLAG_COLORS,
} from "./constants";

export function formatDate(date?: string | Date | null) {
  if (!date) return EMPTY_VALUE;

  return format(new Date(date), DATE_FORMAT);
}

export function formatDateTime(date?: string | Date | null) {
  if (!date) return EMPTY_VALUE;

  return format(new Date(date), DATETIME_FORMAT);
}

export function formatAge(age?: number) {
  if (age == null) return EMPTY_VALUE;

  return `${age} Years`;
}

export function formatGender(gender?: string) {
  return gender || EMPTY_VALUE;
}

export function formatPhone(phone?: string) {
  return phone || EMPTY_VALUE;
}

export function formatResult(value: unknown) {
  if (value === null || value === undefined || value === "")
    return EMPTY_VALUE;

  return value;
}

export function getFlagColor(flag?: string) {
  return (
    RESULT_FLAG_COLORS[
      flag as keyof typeof RESULT_FLAG_COLORS
    ] || "text-gray-700"
  );
}

export function getReferenceRange(range: {
  male?: string;
  female?: string;
  common?: string;
}) {
  return range.common || range.male || range.female || EMPTY_VALUE;
}