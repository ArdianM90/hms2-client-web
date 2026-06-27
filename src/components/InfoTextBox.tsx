import { Box, Typography } from "@mui/material";

export function InfoTextBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      <Box
        sx={{
          p: 1.5,
          borderRadius: 1,
          bgcolor: "rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.08)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
}
