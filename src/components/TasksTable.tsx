import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import type { TableColumn } from "../types/TableColumn.ts";

type Props<T> = {
  tasks: T[];
  columns: TableColumn<T>[];
  onRowClick?: (dto: T) => void;
};

export default function TasksTable<T extends { employeeTaskId: number }>({
  tasks,
  columns,
  onRowClick,
}: Props<T>) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": { fontWeight: 700, color: "#6b1020" },
            }}
          >
            {columns.map((col, i) => (
              <TableCell key={i} align={col.align}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((dto, index) => (
            <TableRow
              key={dto.employeeTaskId}
              hover={!!onRowClick}
              onClick={() => onRowClick?.(dto)}
              sx={
                onRowClick
                  ? {
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(107,16,32,0.03)" },
                    }
                  : {}
              }
            >
              {columns.map((col, i) => (
                <TableCell key={i} align={col.align}>
                  {col.render(dto, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
