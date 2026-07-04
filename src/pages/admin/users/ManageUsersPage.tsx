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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { employeeApi } from "../../../api/employeeApi.ts";
import { dictionaryApi, DictionaryType } from "../../../api/dictionaryApi.ts";
import EmployeeFormModal from "../../../components/EmployeeFormModal.tsx";
import type { EmployeeListItem } from "../../../types/Employee.ts";
import type { DictionaryValue } from "../../../types/DictionaryValue.ts";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function ManageUsersPage() {
  const navigate = useNavigate();
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
                            sx={{
                              bgcolor: "rgba(107,16,32,0.08)",
                              color: "#6b1020",
                              fontWeight: 500,
                              height: 20,
                              fontSize: "0.7rem",
                              mt: 0.5,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edytuj pracownika">
                        <IconButton
                          size="medium"
                          onClick={() => handleEditClick(employee)}
                        >
                          <EditIcon
                            fontSize="medium"
                            sx={{ color: "#6b1020" }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zobacz przydzielone zadania">
                        <IconButton
                          size="medium"
                          onClick={() =>
                            navigate(`/admin/users/${employee.userId}/tasks`, {
                              state: {
                                assigneeName: `${employee.firstName} ${employee.lastName}`,
                              },
                            })
                          }
                        >
                          <AssignmentIcon
                            fontSize="medium"
                            sx={{ color: "#6b1020" }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Usuń pracownika">
                        <IconButton
                          size="medium"
                          onClick={() => handleDeleteClick(employee)}
                        >
                          <DeleteIcon
                            fontSize="medium"
                            sx={{ color: "#6b1020" }}
                          />
                        </IconButton>
                      </Tooltip>
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
