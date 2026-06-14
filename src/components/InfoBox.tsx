import { Box, Typography } from "@mui/material";

export default function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 0.5,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>

      <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  );
}
