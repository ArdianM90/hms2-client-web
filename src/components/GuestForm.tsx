import { Box, Grid, IconButton, MenuItem, TextField } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type { GuestCheckInRequest } from "../types/CheckInRequest";
import type { DictionaryValue } from "../types/DictionaryValue";
import PersonIcon from "@mui/icons-material/Person";

type Props = {
  guest: GuestCheckInRequest;
  documentTypes: DictionaryValue[];
  citizenshipTypes: DictionaryValue[];
  onChange: <K extends keyof GuestCheckInRequest>(
    field: K,
    value: GuestCheckInRequest[K],
  ) => void;
  onRemove?: () => void;
};

export default function GuestForm({
  guest,
  documentTypes,
  citizenshipTypes,
  onChange,
  onRemove,
}: Props) {
  const compactFieldProps = {
    size: "small" as const,
    slotProps: {
      input: {
        sx: { fontSize: "0.9rem" },
      },
    },
  };

  return (
    <Box
      sx={{
        border: "0.5px solid rgba(0,0,0,0.12)",
        borderRadius: 2,
        p: 2,
        mb: 2,
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 48,
          display: "flex",
          justifyContent: "center",
          pt: 1,
          flexShrink: 0,
        }}
      >
        <PersonIcon
          sx={{
            color: "#6b1020",
            fontSize: 32,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          flex: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Imię"
              value={guest.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Nazwisko"
              value={guest.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              label="Data urodzenia"
              type="date"
              value={guest.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              fullWidth
              required
              {...compactFieldProps}
              slotProps={{
                ...compactFieldProps.slotProps,
                inputLabel: {
                  shrink: true,
                  sx: { fontSize: "0.85rem" },
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="PESEL"
              value={guest.pesel ?? ""}
              onChange={(e) => onChange("pesel", e.target.value)}
              fullWidth
              {...compactFieldProps}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              select
              label="Typ dokumentu"
              value={guest.documentTypeCode}
              onChange={(e) => onChange("documentTypeCode", e.target.value)}
              fullWidth
              required
              {...compactFieldProps}
            >
              {documentTypes.map((d) => (
                <MenuItem key={d.code} value={d.code}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Numer dokumentu"
              value={guest.documentNumber ?? ""}
              onChange={(e) => onChange("documentNumber", e.target.value)}
              fullWidth
              required={guest.documentTypeCode !== "other"}
              {...compactFieldProps}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              select
              label="Obywatelstwo"
              value={guest.citizenshipCode ?? ""}
              onChange={(e) => onChange("citizenshipCode", e.target.value)}
              fullWidth
              {...compactFieldProps}
            >
              <MenuItem value="">Nie podano</MenuItem>
              {citizenshipTypes.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Telefon"
              value={guest.phone ?? ""}
              onChange={(e) => onChange("phone", e.target.value)}
              fullWidth
              {...compactFieldProps}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: 48,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: 1,
          flexShrink: 0,
        }}
      >
        {onRemove && (
          <IconButton onClick={onRemove} sx={{ color: "#6b1020" }}>
            <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
