import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BedroomParentOutlinedIcon from "@mui/icons-material/BedroomParentOutlined";
import type { Room } from "../types/Room.ts";
import { useNavigate } from "react-router-dom";

type Props = {
  room: Room;
  onDelete: (id: number) => void;
};

c;
