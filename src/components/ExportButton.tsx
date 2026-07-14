import { useState } from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TableChartIcon from "@mui/icons-material/TableChart";
import type { ExportType } from "../types/ExportType.ts";

type ExportButtonProps = {
  onExportPdf: () => void;
  onExportXlsx: () => void;
  disabled?: boolean;
};

export default function ExportButton({
  onExportPdf,
  onExportXlsx,
  disabled,
}: ExportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportType, setExportType] = useState<ExportType>("pdf");

  return (
    <>
      <ButtonGroup
        variant="outlined"
        disabled={disabled}
        sx={{
          "& .MuiButton-root": {
            color: "#6b1020",
            borderColor: "#6b1020",
          },
          "& .MuiButton-root:hover": {
            borderColor: "#6b1020",
            backgroundColor: "rgba(107,16,32,0.04)",
          },
        }}
      >
        <Button
          startIcon={
            exportType === "pdf" ? <PictureAsPdfIcon /> : <TableChartIcon />
          }
          onClick={() =>
            exportType === "pdf" ? onExportPdf() : onExportXlsx()
          }
        >
          {exportType === "pdf" ? "Eksport PDF" : "Eksport XLSX"}
        </Button>
        <Button size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setExportType("pdf");
            setAnchorEl(null);
          }}
        >
          <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
          PDF
        </MenuItem>

        <MenuItem
          onClick={() => {
            setExportType("xlsx");
            setAnchorEl(null);
          }}
        >
          <TableChartIcon fontSize="small" sx={{ mr: 1 }} />
          XLSX
        </MenuItem>
      </Menu>
    </>
  );
}
