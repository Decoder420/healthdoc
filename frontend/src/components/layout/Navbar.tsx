"use client";

import Link from "next/link";
import React, {useState,useMemo, useRef,useEffect,} from "react";

import { useRouter } from "next/navigation";

import {patients} from "@/lib/mock/lab_data";

import { notifications } from "@/lib/mock/lab_notification"

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import QueueRoundedIcon from "@mui/icons-material/QueueRounded";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {

const router = useRouter();

const [search, setSearch] = useState("");

const [showResults, setShowResults] = useState(false);

const searchRef = useRef<HTMLDivElement>(null);

const filteredPatients = useMemo(() => {
  if (!search.trim()) return [];

  const query = search.toLowerCase();

  return patients.filter((item: any) => {
    return (
      item.patient.name.toLowerCase().includes(query) ||
      item.patient.patientId.toLowerCase().includes(query) ||
      item.patient.uhid.toLowerCase().includes(query)
    );
  });
}, [search]);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowResults(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

const closeSidebar = () => {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) return;

  const bootstrap = (window as Window & { bootstrap?: typeof import("bootstrap") }).bootstrap;
  bootstrap?.Offcanvas.getInstance(sidebar)?.hide();
};

const handlePatientClick = (patientId: string) => {
  setSearch("");
  setShowResults(false);

  router.push(`/lab/patient/${patientId}`);
};

const unreadCount = notifications.filter(
  (n) => !n.read
).length;



  return (
    <>
      {/* ================= NAVBAR ================= */}
     <nav
  className="navbar navbar-expand-lg app-navbar shadow-sm sticky-top px-3"
  style={{ height: "70px", zIndex: 1050}}
>
  <div className="container-fluid d-flex align-items-center">

    {/* ================= LEFT ================= */}
    <div className="d-flex align-items-center">
      <button
        className="btn btn-outline-primary app-btn-outline-primary me-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
        aria-controls="sidebar"
      >
        <MenuRoundedIcon />
      </button>

      <h4
        className="m-0 fw-bold hover:cursor-pointer"
        onClick = {()=> {router.push(`/lab/dashboard`);}}
      >
        HMIS
      </h4>
    </div>

    {/* ================= CENTER ================= */}
<div className="flex-grow-1 d-flex justify-content-center px-4">
  <div
    ref={searchRef}
    className="position-relative w-100"
    style={{ maxWidth: "550px" }}
  >
    <div className="input-group">

      <span className="input-group-text app-input-group-text">
        <SearchRoundedIcon fontSize="small" />
      </span>

      <input
        type="search"
        className="form-control app-form-control"
        placeholder="Search Patient / UHID / Patient ID..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
      />

    </div>

    {showResults && filteredPatients.length > 0 && (
      <div
        className="card shadow app-search-panel position-absolute w-100 mt-1"
        style={{
          zIndex: 2000,
          maxHeight: "320px",
          overflowY: "auto",
        }}
      >
        {filteredPatients.map((item: any) => (
          <button
            key={item.patient.patientId}
            className="btn app-btn-ghost text-start border-bottom rounded-0 p-3"
            onClick={() =>
              handlePatientClick(item.patient.patientId)
            }
          >
            <div className="fw-semibold">
              {item.patient.name}
            </div>

            <small className="text-muted">
              UHID : {item.patient.uhid}
            </small>

            <br />

            <small className="text-muted">
              Patient ID : {item.patient.patientId}
            </small>
          </button>
        ))}

        {filteredPatients.length === 0 && search && (
          <div className="p-3 text-center text-muted">
            No patient found
          </div>
        )}
      </div>
    )}
  </div>
</div>

    {/* ================= RIGHT ================= */}
    <div className="d-flex align-items-center gap-3">

      {/* Notification */}
      <ThemeToggle />

      <button
        className="btn app-btn-ghost position-relative border"
        type="button"
      >
        <NotificationsNoneRoundedIcon />

           {unreadCount > 0 && (
      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {unreadCount}
      </span>
      )}

      </button>

      <div>
        
      </div>

      {/* Profile */}
      <div className="dropdown">
        <button
          className="btn app-btn-ghost border rounded-pill dropdown-toggle d-flex align-items-center gap-2 px-3"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <AccountCircleRoundedIcon />
          <span>Dr. Sharma</span>
        </button>

        <ul className="dropdown-menu dropdown-menu-end shadow app-dropdown-menu">
          <li>
            <button className="dropdown-item" onClick = {()=> {router.push(`/lab/profile`);}}>
              <PersonRoundedIcon
                fontSize="small"
                className="me-2"
              />
              My Profile
            </button>
          </li>

          <li>
            <button className="dropdown-item"  onClick = {()=> {router.push(`/lab/settings`);}}>
              <SettingsRoundedIcon
                fontSize="small"
                className="me-2"
              />
              Settings
            </button>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <button className="dropdown-item text-danger">
              <LogoutRoundedIcon
                fontSize="small"
                className="me-2"
              />
              Logout
            </button>
          </li>
        </ul>
      </div>

    </div>
  </div>
</nav>

      {/* ================= SIDEBAR ================= */}

      <div
        className="offcanvas offcanvas-start app-offcanvas"
        tabIndex={-1}
        id="sidebar"
        aria-labelledby="sidebarLabel"
        style={{ width: "280px" }}
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title fw-bold"
            id="sidebarLabel"
          >
            HMIS Menu
          </h5>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
<div className="offcanvas-body">

  {/* Search Bar */}
  <div className=" mt-3 mb-3">
    <div className="input-group shadow-sm">
      <span
        className="input-group-text app-input-group-text border-end-0"
      >
        <SearchRoundedIcon fontSize="small" />
      </span>

      <input
        type="text"
          className="form-control app-form-control border-start-0"
        placeholder="Search menu..."
        aria-label="Search menu"
      />
    </div>
  </div>

  {/* Menu */}
  <div className="list-group list-group-flush">

    <Link
  href="/lab/dashboard"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <DashboardRoundedIcon fontSize="small" />
      Dashboard
    </Link>

   <Link
  href="/lab/test_queue"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <QueueRoundedIcon fontSize="small" />
      Test Queue
    </Link>

    <Link
  href="/lab/pathology/barcode"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <QrCodeRoundedIcon fontSize="small" />
      Barcode
    </Link>

   <Link
  href="/lab/pathology/sample"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <ScienceRoundedIcon fontSize="small" />
      Sample
    </Link>

   <Link
  href="/lab/pathology/lab_results"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <BiotechRoundedIcon fontSize="small" />
      Lab Results
    </Link>

   <Link
  href="/lab/pathology/verification"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <VerifiedRoundedIcon fontSize="small" />
      Verification
    </Link>

   <Link
  href="/lab/pathology/settings"
  onClick={closeSidebar}
  className="list-group-item list-group-item-action d-flex align-items-center gap-2"
>
      <SettingsRoundedIcon fontSize="small" />
      Settings
    </Link>

  </div>
</div>
      </div>
    </>
  );
}