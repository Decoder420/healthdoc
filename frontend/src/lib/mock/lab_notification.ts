// src/lib/notifications.ts

export const notifications = [
  {
    id: 1,
    title: "CBC Report Ready",
    message: "Patient Anjali Mehra report is ready.",
    type: "success",
    read: false,
    time: "5 min ago",
  },
  {
    id: 2,
    title: "Sample Pending",
    message: "Rohit Jain sample collection pending.",
    type: "warning",
    read: false,
    time: "15 min ago",
  },
  {
    id: 3,
    title: "Critical Result",
    message: "Troponin I is critically high.",
    type: "error",
    read: true,
    time: "1 hour ago",
  },
];