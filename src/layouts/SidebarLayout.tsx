import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";

type NavItem = {
  label: string;
  path: string;
  icon: SvgIconComponent;
};

type Props = {
  title: string;
  items: NavItem[];
};

export default function SidebarLayout({ title, items }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
      <Paper
        elevation={2}
        sx={{ width: 220, flexShrink: 0, borderRadius: 2, overflow: "hidden" }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            px: 2,
            pt: 2,
            pb: 1,
            color: "#6b1020",
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>
        <Tabs
          orientation="vertical"
          value={location.pathname}
          onChange={(_, value) => navigate(value)}
          textColor="inherit"
          sx={{
            "& .MuiTab-root": {
              width: "100%",
              alignItems: "flex-start",
              textAlign: "left",
              px: 2,
              py: 1.5,
              minHeight: 44,
              textTransform: "none",
              fontSize: "0.9rem",
              color: "text.secondary",
            },
            "& .Mui-selected": {
              color: "#6b1020",
              fontWeight: 500,
              bgcolor: "rgba(107,16,32,0.06)",
            },
            "& .MuiTabs-indicator": {
              left: 0,
              right: "auto",
              width: 3,
              bgcolor: "#6b1020",
              borderRadius: "0 2px 2px 0",
            },
          }}
        >
          {items.map(({ label, path, icon: Icon }) => (
            <Tab
              key={path}
              icon={<Icon fontSize="small" />}
              iconPosition="start"
              label={label}
              value={path}
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
