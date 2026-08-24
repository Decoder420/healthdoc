export const demoRoles = [
  {
    name: "receptionist",
    username: "dev.receptionist",
    landingPath: "/receptionist/registration",
    api: { method: "POST", path: "/api/v1/patients/search" },
  },
  {
    name: "doctor",
    username: "dev.doctor",
    landingPath: "/doctor/dashboard",
    api: { method: "GET", path: "/api/v1/queue/worklist" },
  },
  {
    name: "nurse",
    username: "dev.nurse",
    landingPath: "/nurse/ward-dashboard",
    api: { method: "GET", path: "/api/v1/nursing/tasks" },
  },
];
