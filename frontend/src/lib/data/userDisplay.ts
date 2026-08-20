import {
  NURSE_ANITA_ID,
  NURSE_KIRAN_ID,
  NURSE_MEERA_ID,
  NURSE_PRIYA_ID,
  NURSE_RAHUL_ID,
} from "./mockIds";

/** UI-only display names for mock users.id values. Not a database column. */
export const USER_DISPLAY_NAMES: Record<string, string> = {
  [NURSE_ANITA_ID]: "Nurse Anita",
  [NURSE_PRIYA_ID]: "Nurse Priya",
  [NURSE_KIRAN_ID]: "Nurse Kiran",
  [NURSE_MEERA_ID]: "Nurse Meera",
  [NURSE_RAHUL_ID]: "Nurse Rahul",
};

export function displayUserName(userId: string | null | undefined): string {
  if (!userId) return "-";
  return USER_DISPLAY_NAMES[userId] ?? userId;
}
