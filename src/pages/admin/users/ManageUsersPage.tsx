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
  TableSortLabel,
  Stack,
  Collapse,
  TextField,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { employeeApi } from "../../../api/employeeApi.ts";
import { dictionaryApi, DictionaryType } from "../../../api/dictionaryApi.ts";
import EmployeeFormModal from "../../../components/EmployeeFormModal.tsx";
import type {
  EmployeeListItem,
  EmployeesFilterParams,
} from "../../../types/Employee.ts";
import type { DictionaryValue } from "../../../types/DictionaryValue.ts";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import type { PageableParam } from "../../../types/Pageable.ts";
import FilterListIcon from "@mui/icons-material/FilterList";

const DEFAULT_PAGE_SIZE = 10;

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState<DictionaryValue[]>([]);
  const [positions, setPositions] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeListItem | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<string>("last_name");
  const [descending, setDescending] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<DictionaryValue | null>(
    null,
  );
  const [selectedPositions, setSelectedPositions] = useState<DictionaryValue[]>(
    [],
  );
  const [appliedFilters, setAppliedFilters] = useState<EmployeesFilterParams>(
    {},
  );

  const roleLabel = (code: string) =>
    roles.find((r) => r.code === code)?.name ?? code;

  const positionLabel = (code: string) =>
    positions.find((p) => p.code === code)?.name ?? code;

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageable: PageableParam = {
        page: page + 1,
        pageSize,
        sortBy,
        descending,
      };
      const data = await employeeApi.getEmployees(appliedFilters, pageable);
      setEmployees(data.results);
      setTotal(data.total);
    } catch {
      setError("Nie udało się pobrać listy pracowników");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      dictionaryApi.getDictionary(DictionaryType.APP_USER_ROLE),
      dictionaryApi.getDictionary(DictionaryType.EMPLOYEE_POSITION),
    ]).then(([roleDict, positionDict]) => {
      setRoles(roleDict);
      setPositions(positionDict);
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortBy, descending, appliedFilters]);

  const handleSortChange = (key: string) => {
    if (sortBy === key) {
      setDescending((prev) => !prev);
    } else {
      setSortBy(key);
      setDescending(false);
    }
    setPage(0);
  };

  const applyFilters = () => {
    setPage(0);
    setAppliedFilters({
      query: query || undefined,
      roleCode: selectedRole?.code,
      positionCodes: selectedPositions.length
        ? selectedPositions.map((p) => p.code)
        : undefined,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedRole(null);
    setSelectedPositions([]);
    setPage(0);
    setAppliedFilters({});
  };

  const activeFilterCount =
    (appliedFilters.query ? 1 : 0) +
    (appliedFilters.roleCode ? 1 : 0) +
    (appliedFilters.positionCodes?.length ? 1 : 0);

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
      void loadEmployees();
    } catch {
      alert("Nie udało się usunąć pracownika");
    }
  };

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
        <Typography variant="h4">Użytkownicy HMS</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={handleAddClick}
        >
          Dodaj użytkownika
        </Button>
      </Box>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", mb: 2 }}
          >
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersOpen((prev) => !prev)}
              sx={{ color: "#6b1020" }}
            >
              Filtry {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Stack>

          <Collapse in={filtersOpen}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 1,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <TextField
                  size="small"
                  label="Szukaj"
                  placeholder="Imię, nazwisko, email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  sx={{ minWidth: 220 }}
                />
                <Autocomplete
                  size="small"
                  sx={{ minWidth: 200 }}
                  options={roles}
                  getOptionLabel={(o) => o.name}
                  isOptionEqualToValue={(a, b) => a.code === b.code}
                  value={selectedRole}
                  onChange={(_, value) => setSelectedRole(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Rola" />
                  )}
                />
                <Autocomplete
                  multiple
                  size="small"
                  sx={{ minWidth: 260 }}
                  options={positions}
                  getOptionLabel={(o) => o.name}
                  isOptionEqualToValue={(a, b) => a.code === b.code}
                  value={selectedPositions}
                  onChange={(_, value) => setSelectedPositions(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Stanowiska" />
                  )}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={applyFilters}
                    sx={{
                      bgcolor: "#6b1020",
                      "&:hover": { bgcolor: "#55081a" },
                    }}
                  >
                    Zastosuj
                  </Button>
                  <Button
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={clearFilters}
                  >
                    Wyczyść
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#6b1020" }} />
            </Box>
          ) : (
            <>
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
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "email"}
                          direction={
                            sortBy === "email" && descending ? "desc" : "asc"
                          }
                          onClick={() => handleSortChange("email")}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "first_name"}
                          direction={
                            sortBy === "first_name" && descending
                              ? "desc"
                              : "asc"
                          }
                          onClick={() => handleSortChange("first_name")}
                        >
                          Imię
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "last_name"}
                          direction={
                            sortBy === "last_name" && descending
                              ? "desc"
                              : "asc"
                          }
                          onClick={() => handleSortChange("last_name")}
                        >
                          Nazwisko
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "role_code"}
                          direction={
                            sortBy === "role_code" && descending
                              ? "desc"
                              : "asc"
                          }
                          onClick={() => handleSortChange("role_code")}
                        >
                          Rola
                        </TableSortLabel>
                      </TableCell>
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
                        <TableCell sx={{ fontWeight: 700, color: "#6b1020" }}>
                          {roleLabel(employee.roleCode)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
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
                          {employee.roleCode === "EMPLOYEE" && (
                            <Tooltip title="Zobacz przydzielone zadania">
                              <IconButton
                                size="medium"
                                onClick={() =>
                                  navigate(
                                    `/admin/users/${employee.userId}/tasks`,
                                    {
                                      state: {
                                        assigneeName: `${employee.firstName} ${employee.lastName}`,
                                      },
                                    },
                                  )
                                }
                              >
                                <AssignmentIcon
                                  fontSize="medium"
                                  sx={{ color: "#6b1020" }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
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

              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) => {
                  setPageSize(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 20, 50]}
                labelRowsPerPage="Wierszy"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} z ${count}`
                }
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    minHeight: 48,
                    paddingRight: 0,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    { fontWeight: 500 },
                  "& .MuiIconButton-root": { color: "#6b1020" },
                  "& .MuiTablePagination-actions": { marginLeft: 1 },
                }}
              />
            </>
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
