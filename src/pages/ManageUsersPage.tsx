import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { employeeApi } from "../api/employeeApi";
import { dictionaryApi, DictionaryType } from "../api/dictionaryApi";
import EmployeeFormModal from "../components/EmployeeFormModal";
import type { EmployeeListItem } from "../types/Employee.ts";
import type { DictionaryValue } from "../types/DictionaryValue.ts";

export default function ManageUsersPage() {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [roles, setRoles] = useState<DictionaryValue[]>([]);
  const [positions, setPositions] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeListItem | null>(null);

  const roleLabel = (code: string) =>
    roles.find((r) => r.code === code)?.name ?? code;

  const positionLabel = (code: string) =>
    positions.find((p) => p.code === code)?.name ?? code;

  const loadEmployees = () => {
    setLoading(true);
    setError(null);
    return employeeApi
      .getEmployees()
      .then(setEmployees)
      .catch(() => setError("Nie udało się pobrać listy pracowników"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      dictionaryApi.getDictionary(DictionaryType.APP_USER_ROLE),
      dictionaryApi.getDictionary(DictionaryType.EMPLOYEE_POSITION),
    ]).then(([roleDict, positionDict]) => {
      setRoles(roleDict);
      setPositions(positionDict);
    });
    void loadEmployees();
  }, []);

  const handleAddClick = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEditClick = (employee: EmployeeListItem) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleDeleteClick = async (employee: EmployeeListItem) => {
    const confirmed = window.confirm(
      `Czy na pewno usunąć pracownika ${employee.firstName} ${employee.lastName}?`,
    );
    if (!confirmed) return;

    try {
      await employeeApi.deleteEmployee(employee.userId);
      setEmployees((prev) => prev.filter((e) => e.userId !== employee.userId));
    } catch {
      alert("Nie udało się usunąć pracownika");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: "#6b1020" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Pracownicy</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={handleAddClick}
        >
          Dodaj pracownika
        </Button>
      </Box>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      fontWeight: 700,
                      color: "#6b1020",
                    },
                  }}
                >
                  <TableCell>Email</TableCell>
                  <TableCell>Imię</TableCell>
                  <TableCell>Nazwisko</TableCell>
                  <TableCell>Rola</TableCell>
                  <TableCell>Stanowiska</TableCell>
                  <TableCell align="center">Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.userId} hover>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
                    <TableCell>{roleLabel(employee.roleCode)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {employee.positionCodes.map((code) => (
                          <Chip
                            key={code}
                            label={positionLabel(code)}
                            size="small"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(employee)}
                        title="Edytuj"
                      >
                        <EditIcon fontSize="small" sx={{ color: "#6b1020" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(employee)}
                        title="Usuń"
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#6b1020" }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {employees.length === 0 && (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Brak pracowników
            </Typography>
          )}
        </CardContent>
      </Card>

      <EmployeeFormModal
        open={modalOpen}
        employee={editingEmployee}
        onClose={() => setModalOpen(false)}
        onSuccess={loadEmployees}
      />
    </Box>
  );
}
