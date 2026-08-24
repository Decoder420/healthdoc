"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { toast } from "@/components/ui/toast";
import { meridian } from "@/styles/theme";
import { createAccountRequest } from "../api";
import { REALM_ROLES, REALM_ROLE_LABELS } from "../constants";
import type { RealmRole, UserAccountRequest } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (row: UserAccountRequest) => void;
};

export function CreateAccountRequestModal({ open, onClose, onCreated }: Props) {
  const [busy, setBusy] = useState(false);
  const [requested_for_full_name, setName] = useState("");
  const [requested_username, setUsername] = useState("");
  const [justification, setJustification] = useState("");
  const [designation, setDesignation] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [registration_number, setReg] = useState("");
  const [qualification, setQual] = useState("");
  const [roles, setRoles] = useState<RealmRole[]>([]);

  const toggleRole = (role: RealmRole) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const submit = async () => {
    if (!requested_for_full_name.trim() || !requested_username.trim() || !justification.trim()) {
      toast.error("requested_for_full_name, requested_username, justification required");
      return;
    }
    if (roles.length === 0) {
      toast.error("requested_roles must include at least one Keycloak role");
      return;
    }
    setBusy(true);
    try {
      const row = await createAccountRequest({
        // No facility_id: the request is raised at the authenticated user's own
        // facility, derived server-side. This used to send a mock constant.
        requested_for_full_name: requested_for_full_name.trim(),
        requested_username: requested_username.trim(),
        requested_roles: roles,
        designation: designation.trim() || null,
        employee_id: employee_id.trim() || null,
        registration_number: registration_number.trim() || null,
        qualification: qualification.trim() || null,
        email: email.trim() || null,
        mobile: mobile.trim() || null,
        justification: justification.trim(),
      });
      toast.success("Account request filed");
      onCreated(row);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, color: meridian.textPrimary }}>
        New account request (0028)
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, fontSize: "0.8125rem", color: meridian.textSecondary }}>
          Maker-checker: a different user must approve. Nobody approves their own request.
        </Typography>
        <Stack spacing={1.5}>
          <TextField
            label="requested_for_full_name"
            size="small"
            required
            value={requested_for_full_name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="requested_username"
            size="small"
            required
            value={requested_username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="justification"
            size="small"
            required
            multiline
            minRows={2}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          />
          <TextField
            label="designation"
            size="small"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <TextField
            label="employee_id"
            size="small"
            value={employee_id}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <TextField label="email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="mobile" size="small" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          <TextField
            label="registration_number"
            size="small"
            value={registration_number}
            onChange={(e) => setReg(e.target.value)}
          />
          <TextField
            label="qualification"
            size="small"
            value={qualification}
            onChange={(e) => setQual(e.target.value)}
          />
          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>requested_roles</Typography>
          <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.5 }}>
            {REALM_ROLES.filter((r) => r !== "patient").map((role) => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    size="small"
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                }
                label={REALM_ROLE_LABELS[role]}
              />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={busy}
          onClick={() => void submit()}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            bgcolor: meridian.brandPrimary,
          }}
        >
          Submit request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
