import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SidebarLayout from "./SidebarLayout.tsx";

const items = [
    { label: "Zarządzanie hotelem", path: "/admin/hotel", icon: RoomServiceOutlinedIcon },
    { label: "Zarządzanie pokojami", path: "/admin/rooms", icon: MeetingRoomIcon },
];

export default function AdminLayout() {
    return <SidebarLayout title="Administracja" items={items} />;
}