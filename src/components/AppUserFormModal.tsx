import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { dictionaryApi, DictionaryType } from "../api/dictionaryApi";
import { appUsersApi } from "../api/appUsersApi.ts";
import type { AppUserListItem, EmployeeRequest } from "../types/AppUser.ts";
import type { DictionaryValue } from "../types/DictionaryValue.ts";

type AxiosErrorResponse = {
  response?: { data?: { message?: string } };
};

const emptyForm: EmployeeRequest = {
  email: "",
  firstName: "",
  lastName: "",
  roleCode: "",
  positionCodes: [],
};

type Props = {
  open: boolean;
  employee: AppUserListItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AppUserFormModal({
  open,
  employee,
  onClose,
  onSuccess,
}: Props) {
  const isEditMode = employee !== null;

  const [form, setForm] = useState<EmployeeRequest>(emptyForm);
  const [roles, setRoles] = useState<DictionaryValue[]>([]);
  const [positions, setPositions] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [roleDict, positionDict] = await Promise.all([
          dictionaryApi.getDictionary(DictionaryType.APP_USER_ROLE),
          dictionaryApi.getDictionary(DictionaryType.EMPLOYEE_POSITION),
        ]);

        if (!active) return;

        setRoles(roleDict);
        setPositions(positionDict);
        setForm(
          employee
            ? {
                email: employee.email,
                firstName: employee.firstName,
                lastName: employee.lastName,
                roleCode: employee.roleCode,
                positionCodes: employee.positionCodes,
              }
            : { ...emptyForm },
        );
      } catch {
        if (active) setError("Nie udało się pobrać danych słownikowych.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employee]);

  const isValid =
    form.email.trim() !== "" &&
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.roleCode !== "";

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Uzupełnij wymagane pola.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      if (isEditMode) {
        await appUsersApi.updateAppUser(employee.userId, form);
      } else {
        await appUsersApi.addAppUser(form);
      }
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const axiosError = e as AxiosErrorResponse;
      setError(
        axiosError?.response?.data?.message ??
          "Nie udało się zapisać pracownika.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditMode ? "Edytuj pracownika" : "Dodaj pracownika"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#6b1020" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Imię"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Nazwisko"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Rola</InputLabel>
              <Select
                label="Rola"
                value={form.roleCode}
                onChange={(e) => setForm({ ...form, roleCode: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role.code} value={role.code}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Stanowiska</InputLabel>
              <Select
                label="Stanowiska"
                multiple
                value={form.positionCodes}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({
                    ...form,
                    positionCodes:
                      typeof value === "string" ? value.split(",") : value,
                  });
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((code) => (
                      <Chip
                        key={code}
                        label={
                          positions.find((p) => p.code === code)?.name ?? code
                        }
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {positions.map((position) => (
                  <MenuItem key={position.code} value={position.code}>
                    <Checkbox
                      checked={form.positionCodes.includes(position.code)}
                    />
                    <ListItemText primary={position.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {roles.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                Brak zdefiniowanych ról w słowniku.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#6b1020" }}>
          Anuluj
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={handleSubmit}
          disabled={submitting || loading || !isValid}
        >
          {submitting ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
