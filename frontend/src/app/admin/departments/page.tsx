"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createDepartment,
  createRoom,
  listDepartments,
  listRooms,
  updateDepartment,
  updateRoom,
  type Department,
  type Room,
} from "@/features/admin/api/departments";
import { ApiError } from "@/lib/api";

export default function Page() {
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [roomDepartment, setRoomDepartment] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [departmentResponse, roomResponse] = await Promise.all([
        listDepartments(),
        listRooms(),
      ]);
      setDepartments(departmentResponse.items);
      setRooms(roomResponse.items);
      setRoomDepartment((current) => current || departmentResponse.items[0]?.id || "");
      setError(null);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Could not load departments");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addDepartment(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await createDepartment(name.trim(), code.trim().toUpperCase());
      setDepartments((current) => [...(current ?? []), created]);
      setName("");
      setCode("");
      setRoomDepartment((current) => current || created.id);
      setMessage("Department created in your facility.");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Department could not be created");
    } finally {
      setBusy(false);
    }
  }

  async function addRoom(event: React.FormEvent) {
    event.preventDefault();
    if (!roomDepartment || !roomNumber.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await createRoom(roomDepartment, roomNumber.trim());
      setRooms((current) => [...current, created]);
      setRoomNumber("");
      setMessage("Room created.");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Room could not be created");
    } finally {
      setBusy(false);
    }
  }

  async function toggleDepartment(department: Department) {
    try {
      const updated = await updateDepartment(department.id, { is_active: !department.is_active });
      setDepartments((current) =>
        current?.map((item) => (item.id === updated.id ? updated : item)) ?? [],
      );
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Department update failed");
    }
  }

  async function toggleRoom(room: Room) {
    try {
      const updated = await updateRoom(room.id, { is_active: !room.is_active });
      setRooms((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Room update failed");
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Departments and rooms</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All records and mutations are restricted to the signed-in administrator’s facility.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-danger-muted p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-md bg-success-muted p-3 text-sm text-success">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addDepartment} className="surface-card space-y-4 p-5">
          <h2 className="text-lg font-medium">Create department</h2>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Name</span>
            <input
              required
              className="w-full rounded-md border border-border px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Code</span>
            <input
              required
              className="w-full rounded-md border border-border px-3 py-2 uppercase"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Create department
          </button>
        </form>

        <form onSubmit={addRoom} className="surface-card space-y-4 p-5">
          <h2 className="text-lg font-medium">Create room</h2>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Department</span>
            <select
              required
              className="w-full rounded-md border border-border px-3 py-2"
              value={roomDepartment}
              onChange={(event) => setRoomDepartment(event.target.value)}
            >
              <option value="">Select</option>
              {departments?.filter((department) => department.is_active).map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Room number/name</span>
            <input
              required
              className="w-full rounded-md border border-border px-3 py-2"
              value={roomNumber}
              onChange={(event) => setRoomNumber(event.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={busy || !roomDepartment}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Create room
          </button>
        </form>
      </div>

      {departments === null ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
      <div className="space-y-4">
        {departments?.map((department) => {
          const departmentRooms = rooms.filter((room) => room.department_id === department.id);
          return (
            <section key={department.id} className="surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-medium">{department.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {department.code} · {departmentRooms.length} room
                    {departmentRooms.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void toggleDepartment(department)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    department.is_active
                      ? "bg-success-muted text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {department.is_active ? "Active" : "Inactive"}
                </button>
              </div>
              {departmentRooms.length > 0 ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {departmentRooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <span>{room.room_number}</span>
                      <button
                        type="button"
                        className="text-xs underline"
                        onClick={() => void toggleRoom(room)}
                      >
                        {room.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No rooms configured.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
