export type DoctorGender = "male" | "female" | "other";

export type DoctorStatus = "active" | "on_leave" | "inactive";

export type DoctorAvailability = {
  days: string[];
  startTime: string;
  endTime: string;
};

export type DoctorProfile = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  gender: DoctorGender;
  departmentId: string;
  department: string;
  departmentCode: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  licenseNumber: string;
  status: DoctorStatus;
  joiningDate: string;
  address: string;
  photo: string;
  availability: DoctorAvailability;
};

export type DoctorFormInput = Omit<DoctorProfile, "id" | "employeeId" | "department" | "departmentCode"> & {
  departmentId: string;
};

export type DoctorFieldErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "gender"
    | "departmentId"
    | "specialization"
    | "qualification"
    | "experienceYears"
    | "consultationFee"
    | "licenseNumber"
    | "joiningDate"
    | "address"
    | "status"
    | "startTime"
    | "endTime"
    | "days",
    string
  >
>;

export const emptyDoctorForm: DoctorFormInput = {
  name: "",
  email: "",
  phone: "",
  gender: "male",
  departmentId: "",
  specialization: "",
  qualification: "",
  experienceYears: 0,
  consultationFee: 0,
  licenseNumber: "",
  status: "active",
  joiningDate: new Date().toISOString().slice(0, 10),
  address: "",
  photo: "",
  availability: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00",
    endTime: "17:00",
  },
};

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
