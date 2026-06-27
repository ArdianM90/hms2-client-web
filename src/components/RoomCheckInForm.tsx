import { Box, Button, Typography } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import GuestForm from "./GuestForm";
import type {
  RoomCheckInRequest,
  GuestCheckInRequest,
} from "../types/CheckInRequest";
import type { DictionaryValue } from "../types/DictionaryValue";

const emptyGuest: GuestCheckInRequest = {
  firstName: "",
  lastName: "",
  pesel: "",
  dateOfBirth: "",
  documentTypeCode: "",
  documentNumber: "",
  citizenshipCode: "",
  phone: "",
};

type Props = {
  room: RoomCheckInRequest;
  capacity: number;
  roomNumber: number;
  documentTypes: DictionaryValue[];
  citizenshipTypes: DictionaryValue[];
  onChange: (room: RoomCheckInRequest) => void;
};

export default function RoomCheckInForm({
  room,
  capacity,
  roomNumber,
  documentTypes,
  citizenshipTypes,
  onChange,
}: Props) {
  const updateGuest = <K extends keyof GuestCheckInRequest>(
    index: number,
    field: K,
    value: GuestCheckInRequest[K],
  ) => {
    const guests = room.guests.map((g, i) =>
      i === index ? { ...g, [field]: value } : g,
    );
    onChange({ ...room, guests });
  };

  const addGuest = () => {
    onChange({ ...room, guests: [...room.guests, { ...emptyGuest }] });
  };

  const removeGuest = (index: number) => {
    onChange({ ...room, guests: room.guests.filter((_, i) => i !== index) });
  };

  const isFull = room.guests.length >= capacity;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HotelOutlinedIcon sx={{ color: "#6b1020" }} />
          <Typography variant="h6">
            Pokój {roomNumber} ({room.guests.length}/{capacity} osób)
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<AddCircleOutlineOutlinedIcon sx={{ color: "white" }} />}
          variant="contained"
          sx={{ bgcolor: "#6b1020" }}
          onClick={addGuest}
          disabled={isFull}
        >
          Dodaj osobę
        </Button>
      </Box>

      {room.guests.map((guest, index) => (
        <GuestForm
          key={index}
          guest={guest}
          documentTypes={documentTypes}
          citizenshipTypes={citizenshipTypes}
          onChange={(field, value) => updateGuest(index, field, value)}
          onRemove={index > 0 ? () => removeGuest(index) : undefined}
        />
      ))}
    </Box>
  );
}
