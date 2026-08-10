import {
  createSeedIpdRequests,
  mockIpdBeds,
  mockIpdNurses,
} from "@/features/ipd/data/mock-ipd-resources";
import type {
  AssignIpdResourcesInput,
  IpdAdmissionRequest,
  IpdBed,
  IpdNurse,
  IpdRequestStatus,
  RaiseIpdRequestInput,
} from "@/features/ipd/types";

const REQUESTS_KEY = "hms-ipd-requests";
const BEDS_KEY = "hms-ipd-beds";
const NURSES_KEY = "hms-ipd-nurses";

let requests: IpdAdmissionRequest[] = [];
let beds: IpdBed[] = [];
let nurses: IpdNurse[] = [];
let loaded = false;
let requestCounter = 100;

function ensureLoaded() {
  if (loaded) return;

  if (typeof window !== "undefined") {
    try {
      const storedRequests = sessionStorage.getItem(REQUESTS_KEY);
      const storedBeds = sessionStorage.getItem(BEDS_KEY);
      const storedNurses = sessionStorage.getItem(NURSES_KEY);

      if (storedRequests && storedBeds && storedNurses) {
        requests = JSON.parse(storedRequests) as IpdAdmissionRequest[];
        beds = JSON.parse(storedBeds) as IpdBed[];
        nurses = JSON.parse(storedNurses) as IpdNurse[];
        if (requests.length && beds.length && nurses.length) {
          loaded = true;
          return;
        }
      }
    } catch {
      // fall through
    }
  }

  requests = createSeedIpdRequests();
  beds = mockIpdBeds.map((bed) => ({ ...bed }));
  nurses = mockIpdNurses.map((nurse) => ({ ...nurse }));
  loaded = true;
  persist();
}

function persist() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  sessionStorage.setItem(BEDS_KEY, JSON.stringify(beds));
  sessionStorage.setItem(NURSES_KEY, JSON.stringify(nurses));
}

export type IpdOpsResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function getAllIpdRequests() {
  ensureLoaded();
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPendingIpdRequests() {
  return getAllIpdRequests().filter((item) => item.status === "pending");
}

export function getIpdRequestById(id: string) {
  ensureLoaded();
  return requests.find((item) => item.id === id) ?? null;
}

export function filterIpdRequests(params: {
  query?: string;
  status?: IpdRequestStatus | "all";
  doctorId?: string | "all";
}) {
  const query = params.query?.trim().toLowerCase() ?? "";
  const status = params.status ?? "all";
  const doctorId = params.doctorId ?? "all";

  return getAllIpdRequests().filter((item) => {
    if (status !== "all" && item.status !== status) return false;
    if (doctorId !== "all" && item.doctorId !== doctorId) return false;
    if (!query) return true;
    const haystack = [
      item.id,
      item.patientName,
      item.uhid,
      item.tokenNumber,
      item.doctorName,
      item.clinicalNotes,
      item.nurseName,
      item.bedLabel,
      item.ward,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function getAllIpdBeds() {
  ensureLoaded();
  return [...beds];
}

export function getAvailableIpdBeds(careType?: IpdBed["careType"]) {
  return getAllIpdBeds().filter((bed) => {
    if (bed.status !== "available") return false;
    if (!careType) return true;
    return bed.careType === careType;
  });
}

export function getAllIpdNurses() {
  ensureLoaded();
  return [...nurses];
}

function preferredBedCareType(
  type: IpdAdmissionRequest["type"],
): IpdBed["careType"] | undefined {
  if (type === "observation") return "observation";
  if (type === "admission") return "general";
  if (type === "procedure") return "semi_private";
  if (type === "transfer") return "icu";
  return undefined;
}

export function raiseIpdRequest(
  input: RaiseIpdRequestInput,
): IpdOpsResult<IpdAdmissionRequest> {
  ensureLoaded();

  if (!input.uhid) {
    return { success: false, error: "Select a patient." };
  }
  if (!input.doctorId) {
    return { success: false, error: "Select a doctor." };
  }
  if (!input.clinicalNotes.trim() || input.clinicalNotes.trim().length < 5) {
    return {
      success: false,
      error: "Add clinical notes (at least 5 characters).",
    };
  }

  const now = new Date().toISOString();
  requestCounter += 1;
  const request: IpdAdmissionRequest = {
    id: `ireq-${String(requestCounter).padStart(3, "0")}`,
    opdId: input.opdId?.trim() || `IPD-REF-${requestCounter}`,
    tokenNumber: input.tokenNumber?.trim() || "—",
    uhid: input.uhid,
    patientName: input.patientName,
    patientPhone: input.patientPhone ?? "",
    doctorId: input.doctorId,
    doctorName: input.doctorName,
    department: input.department,
    type: input.type,
    priority: input.priority,
    status: "pending",
    clinicalNotes: input.clinicalNotes.trim(),
    instructions: "",
    bedId: "",
    bedLabel: "",
    ward: "",
    nurseId: "",
    nurseName: "",
    assignedAt: "",
    completedAt: "",
    createdAt: now,
    updatedAt: now,
  };

  requests = [request, ...requests];
  persist();
  return { success: true, data: request };
}

export function assignResourcesToIpdRequest(
  requestId: string,
  input: AssignIpdResourcesInput,
): IpdOpsResult<IpdAdmissionRequest> {
  ensureLoaded();

  const requestIndex = requests.findIndex((item) => item.id === requestId);
  if (requestIndex === -1) {
    return { success: false, error: "IPD request not found." };
  }

  const request = requests[requestIndex];
  if (request.status !== "pending" && request.status !== "assigned") {
    return {
      success: false,
      error: `Cannot assign resources when request is ${request.status}.`,
    };
  }

  if (!input.nurseId) {
    return { success: false, error: "Select a nurse to assign." };
  }
  if (!input.bedId) {
    return { success: false, error: "Select a ward bed to assign." };
  }

  const nurseIndex = nurses.findIndex((item) => item.id === input.nurseId);
  if (nurseIndex === -1) {
    return { success: false, error: "Selected nurse not found." };
  }
  const nurse = nurses[nurseIndex];
  if (nurse.status === "off_duty") {
    return { success: false, error: "Selected nurse is off duty." };
  }

  const bedIndex = beds.findIndex((item) => item.id === input.bedId);
  if (bedIndex === -1) {
    return { success: false, error: "Selected bed not found." };
  }
  const bed = beds[bedIndex];
  if (bed.status !== "available" && bed.id !== request.bedId) {
    return { success: false, error: "Selected bed is not available." };
  }

  if (request.bedId && request.bedId !== input.bedId) {
    const prevBedIndex = beds.findIndex((item) => item.id === request.bedId);
    if (prevBedIndex !== -1) {
      beds[prevBedIndex] = {
        ...beds[prevBedIndex],
        status: "available",
        currentRequestId: "",
        currentPatientName: "",
      };
    }
  }

  if (request.nurseId && request.nurseId !== input.nurseId) {
    const prevNurseIndex = nurses.findIndex((item) => item.id === request.nurseId);
    if (prevNurseIndex !== -1) {
      const prev = nurses[prevNurseIndex];
      const activeAssignments = Math.max(0, prev.activeAssignments - 1);
      nurses[prevNurseIndex] = {
        ...prev,
        activeAssignments,
        status: activeAssignments === 0 ? "available" : "busy",
      };
    }
  }

  const now = new Date().toISOString();
  const updated: IpdAdmissionRequest = {
    ...request,
    status: "assigned",
    bedId: bed.id,
    bedLabel: bed.label,
    ward: bed.ward,
    nurseId: nurse.id,
    nurseName: nurse.name,
    instructions: input.instructions?.trim() ?? request.instructions,
    assignedAt: now,
    updatedAt: now,
  };

  requests = [updated, ...requests.filter((_, i) => i !== requestIndex)];

  beds[bedIndex] = {
    ...bed,
    status: "occupied",
    currentRequestId: updated.id,
    currentPatientName: updated.patientName,
  };

  const isSameNurse = request.nurseId === nurse.id && request.status !== "pending";
  nurses[nurseIndex] = {
    ...nurse,
    activeAssignments: isSameNurse
      ? nurse.activeAssignments
      : nurse.activeAssignments + 1,
    status: "busy",
  };

  persist();
  return { success: true, data: updated };
}

export function startIpdCare(requestId: string): IpdOpsResult<IpdAdmissionRequest> {
  ensureLoaded();
  const index = requests.findIndex((item) => item.id === requestId);
  if (index === -1) return { success: false, error: "Request not found." };
  const current = requests[index];
  if (current.status !== "assigned") {
    return { success: false, error: "Only assigned requests can be started." };
  }
  const updated: IpdAdmissionRequest = {
    ...current,
    status: "in_progress",
    updatedAt: new Date().toISOString(),
  };
  requests = [updated, ...requests.filter((_, i) => i !== index)];
  persist();
  return { success: true, data: updated };
}

export function completeIpdRequest(
  requestId: string,
): IpdOpsResult<IpdAdmissionRequest> {
  ensureLoaded();
  const index = requests.findIndex((item) => item.id === requestId);
  if (index === -1) return { success: false, error: "Request not found." };

  const current = requests[index];
  if (current.status !== "assigned" && current.status !== "in_progress") {
    return {
      success: false,
      error: "Only assigned or in-progress requests can be completed.",
    };
  }

  const now = new Date().toISOString();
  const updated: IpdAdmissionRequest = {
    ...current,
    status: "completed",
    completedAt: now,
    updatedAt: now,
  };
  requests = [updated, ...requests.filter((_, i) => i !== index)];

  if (current.bedId) {
    const bedIndex = beds.findIndex((item) => item.id === current.bedId);
    if (bedIndex !== -1) {
      beds[bedIndex] = {
        ...beds[bedIndex],
        status: "cleaning",
        currentRequestId: "",
        currentPatientName: "",
      };
    }
  }

  if (current.nurseId) {
    const nurseIndex = nurses.findIndex((item) => item.id === current.nurseId);
    if (nurseIndex !== -1) {
      const nurse = nurses[nurseIndex];
      const activeAssignments = Math.max(0, nurse.activeAssignments - 1);
      nurses[nurseIndex] = {
        ...nurse,
        activeAssignments,
        status: activeAssignments === 0 ? "available" : "busy",
      };
    }
  }

  persist();
  return { success: true, data: updated };
}

export function cancelIpdRequest(
  requestId: string,
): IpdOpsResult<IpdAdmissionRequest> {
  ensureLoaded();
  const index = requests.findIndex((item) => item.id === requestId);
  if (index === -1) return { success: false, error: "Request not found." };

  const current = requests[index];
  if (current.status === "completed" || current.status === "cancelled") {
    return { success: false, error: "Request already closed." };
  }

  const now = new Date().toISOString();
  const updated: IpdAdmissionRequest = {
    ...current,
    status: "cancelled",
    updatedAt: now,
  };
  requests = [updated, ...requests.filter((_, i) => i !== index)];

  if (current.bedId) {
    const bedIndex = beds.findIndex((item) => item.id === current.bedId);
    if (bedIndex !== -1) {
      beds[bedIndex] = {
        ...beds[bedIndex],
        status: "available",
        currentRequestId: "",
        currentPatientName: "",
      };
    }
  }

  if (current.nurseId) {
    const nurseIndex = nurses.findIndex((item) => item.id === current.nurseId);
    if (nurseIndex !== -1) {
      const nurse = nurses[nurseIndex];
      const activeAssignments = Math.max(0, nurse.activeAssignments - 1);
      nurses[nurseIndex] = {
        ...nurse,
        activeAssignments,
        status: activeAssignments === 0 ? "available" : "busy",
      };
    }
  }

  persist();
  return { success: true, data: updated };
}

export function markIpdBedAvailable(bedId: string): IpdOpsResult<IpdBed> {
  ensureLoaded();
  const index = beds.findIndex((item) => item.id === bedId);
  if (index === -1) return { success: false, error: "Bed not found." };
  const bed = beds[index];
  if (bed.status === "occupied") {
    return {
      success: false,
      error: "Cannot free an occupied bed. Complete the request first.",
    };
  }
  const updated: IpdBed = {
    ...bed,
    status: "available",
    currentRequestId: "",
    currentPatientName: "",
  };
  beds = beds.map((item, i) => (i === index ? updated : item));
  persist();
  return { success: true, data: updated };
}

export function getPreferredBedsForIpdRequest(request: IpdAdmissionRequest) {
  const preferred = preferredBedCareType(request.type);
  const available = getAvailableIpdBeds();
  if (!preferred) return available;
  const matched = available.filter((bed) => bed.careType === preferred);
  return matched.length > 0 ? matched : available;
}

export function getIpdOpsStats() {
  ensureLoaded();
  return {
    pendingRequests: requests.filter((item) => item.status === "pending").length,
    activeCare: requests.filter(
      (item) => item.status === "assigned" || item.status === "in_progress",
    ).length,
    availableBeds: beds.filter((item) => item.status === "available").length,
    availableNurses: nurses.filter((item) => item.status === "available").length,
    occupiedBeds: beds.filter((item) => item.status === "occupied").length,
  };
}
