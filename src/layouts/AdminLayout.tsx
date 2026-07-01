import GroupsIcon from "@mui/icons-material/Groups";
import RoomServiceOutlinedIcon from "@mui/icons-material/RoomServiceOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SidebarLayout from "./SidebarLayout.tsx";

const items = [
  {
    label: "Użytkownicy HMS",
    path: "/admin/users",
    icon: GroupsIcon,
  },
  {
    label: "Hotel",
    path: "/admin/hotel",
    icon: RoomServiceOutlinedIcon,
  },
  {
    label: "Pokoje",
    path: "/admin/rooms",
    icon: MeetingRoomIcon,
  },
  {
    label: "Rezerwacje",
    path: "/admin/reservations",
    icon: EventNoteOutlinedIcon,
  },
];

export default function AdminLayout() {
  return <SidebarLayout title="Administracja" items={items} />;
}
