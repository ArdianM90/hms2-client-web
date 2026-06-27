import { Box, Grid, IconButton, MenuItem, TextField } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type { GuestCheckInRequest } from "../types/CheckInRequest";
import type { DictionaryValue } from "../types/DictionaryValue";

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
  return (
    <Box
      sx={{
        border: "0.5px solid rgba(0,0,0,0.12)",
        borderRadius: 2,
        p: 2,
        mb: 2,
        position: "relative",
      }}
    >
      {onRemove && (
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{ position: "absolute", top: 8, right: 8, color: "#a32d2d" }}
        >
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Imię *"
            value={guest.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Nazwisko *"
            value={guest.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            label="PESEL"
            value={guest.pesel ?? ""}
            onChange={(e) => onChange("pesel", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Data urodzenia *"
            type="date"
            value={guest.dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            select
            label="Typ dokumentu *"
            value={guest.documentTypeCode}
            onChange={(e) => onChange("documentTypeCode", e.target.value)}
            fullWidth
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
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            select
            label="Obywatelstwo"
            value={guest.citizenshipCode ?? ""}
            onChange={(e) => onChange("citizenshipCode", e.target.value)}
            fullWidth
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
          />
        </Grid>
      </Grid>
    </Box>
  );
}
