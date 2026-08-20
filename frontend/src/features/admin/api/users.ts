import type {
  Paginated,
  User,
  UserCreateInput,
  UserListFilters,
  UserUpdateInput,
} from "../types";
import {
  getUsers,
  isoNow,
  newId,
  setUsers,
} from "@/lib/mock/admin_data";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export async function listUsers(
  filters: UserListFilters = {},
): Promise<Paginated<User>> {
  const page = filters.page ?? 1;
  const page_size = Math.min(filters.page_size ?? 20, 100);
  const q = filters.query?.trim().toLowerCase() ?? "";

  let rows = getUsers();
  if (filters.facility_id) {
    rows = rows.filter((u) => u.facility_id === filters.facility_id);
  }
  if (filters.is_active !== undefined && filters.is_active !== null) {
    rows = rows.filter((u) => u.is_active === filters.is_active);
  }
  if (q) {
    rows = rows.filter((u) => {
      const hay = [u.username, u.full_name, u.email, u.employee_id, u.designation]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  const total = rows.length;
  void total;
  const start = (page - 1) * page_size;
  const items = rows.slice(start, start + page_size);
  // Match live GET /users: { items, page, page_size } — no total
  return delay({ items, page, page_size });
}

export async function getUser(id: string): Promise<User | null> {
  const found = getUsers().find((u) => u.id === id) ?? null;
  return delay(found);
}

export async function createUser(payload: UserCreateInput): Promise<User> {
  const store = getUsers();
  if (store.some((u) => u.username === payload.username)) {
    throw new Error(`Username '${payload.username}' already exists`);
  }
  const t = isoNow();
  const user: User = {
    id: newId(),
    keycloak_sub: `kc-${payload.username}`,
    username: payload.username,
    full_name: payload.full_name,
    email: payload.email ?? null,
    mobile: payload.mobile ?? null,
    designation: payload.designation ?? null,
    employee_id: payload.employee_id ?? null,
    registration_number: payload.registration_number ?? null,
    qualification: payload.qualification ?? null,
    facility_id: payload.facility_id,
    department_id: payload.department_id ?? null,
    is_active: true,
    created_at: t,
    updated_at: t,
  };
  // roles + temporary_password go to Keycloak only — not persisted on users row
  void payload.roles;
  void payload.temporary_password;
  setUsers([user, ...store]);
  return delay(user);
}

export async function updateUser(id: string, patch: UserUpdateInput): Promise<User> {
  const store = getUsers();
  const idx = store.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error("User not found");
  const next: User = {
    ...store[idx],
    ...Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    ),
    updated_at: isoNow(),
  } as User;
  store[idx] = next;
  setUsers(store);
  return delay(next);
}

export async function deactivateUser(id: string): Promise<{ id: string; is_active: false }> {
  const store = getUsers();
  const idx = store.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error("User not found");
  store[idx] = { ...store[idx], is_active: false, updated_at: isoNow() };
  setUsers(store);
  return delay({ id, is_active: false as const });
}

export async function activateUser(id: string): Promise<{ id: string; is_active: true }> {
  const store = getUsers();
  const idx = store.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error("User not found");
  store[idx] = { ...store[idx], is_active: true, updated_at: isoNow() };
  setUsers(store);
  return delay({ id, is_active: true as const });
}
