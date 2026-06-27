import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { DictionaryValue } from "../types/DictionaryValue.ts";

type RoomRequirement = {
  id: number;
  capacity: number;
};

export type ReservationFilter = {
  startDate: string;
  endDate: string;
  rooms: RoomRequirement[];
  standardCode: string;
  priceFrom: string;
  priceTo: string;
};

type Props = {
  filter: ReservationFilter;
  standards: DictionaryValue[];
  onFilterChange: (filter: ReservationFilter) => void;
  onAddRoom: () => void;
  onRemoveRoom: (roomId: number) => void;
  onUpdateRoomCapacity: (roomId: number, capacity: number) => void;
};

export default function ReservationSearchForm({
  filter,
  standards,
  onFilterChange,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoomCapacity,
}: Props) {
  const updateField = <K extends keyof ReservationFilter>(
    field: K,
    value: ReservationFilter[K],
  ) => {
    onFilterChange({
      ...filter,
      [field]: value,
    });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Kryteria wyszukiwania
        </Typography>

        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Data od"
              type="date"
              value={filter.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Data do"
              type="date"
              value={filter.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>

          <Divider />

          <Box>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Potrzebne pokoje</Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: "#6b1020" }}
                onClick={onAddRoom}
                startIcon={
                  <AddCircleOutlineOutlinedIcon sx={{ color: "white" }} />
                }
              >
                Dodaj pokój
              </Button>
            </Stack>

            <Stack spacing={2}>
              {filter.rooms.map((room, index) => (
                <Stack
                  key={room.id}
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center" }}
                >
                  <TextField
                    label={`Pokój ${index + 1} - liczba osób`}
                    type="number"
                    value={room.capacity}
                    onChange={(e) =>
                      onUpdateRoomCapacity(room.id, Number(e.target.value))
                    }
                    sx={{ width: 250 }}
                  />
                  {filter.rooms.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => onRemoveRoom(room.id)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </Stack>
          </Box>
          <Divider />

          <Typography variant="h6">Dodatkowe wymagania</Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Standard"
              value={filter.standardCode}
              onChange={(e) => updateField("standardCode", e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                select: {
                  displayEmpty: true,
                  renderValue: (value): React.ReactNode => {
                    if (!value) {
                      return "Dowolny";
                    }
                    const standard = standards.find((s) => s.code === value);
                    return standard?.name ?? String(value);
                  },
                },
              }}
            >
              <MenuItem value="">Dowolny</MenuItem>
              {standards.map((s) => (
                <MenuItem key={s.code} value={s.code}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cena od"
              type="number"
              value={filter.priceFrom}
              onChange={(e) => updateField("priceFrom", e.target.value)}
              fullWidth
            />
            <TextField
              label="Cena do"
              type="number"
              value={filter.priceTo}
              onChange={(e) => updateField("priceTo", e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
