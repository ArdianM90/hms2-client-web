import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import SidebarLayout from "./SidebarLayout.tsx";

const items = [
  { label: "Moje rezerwacje", path: "/reservation/my", icon: BookOutlinedIcon },
  {
    label: "Zarezerwuj pobyt",
    path: "/reservation/book",
    icon: AddBusinessOutlinedIcon,
  },
];

export default function ReservationLayout() {
  return <SidebarLayout title="Rezerwacje" items={items} />;
}
