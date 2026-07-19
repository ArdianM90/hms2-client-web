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
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { appUsersApi } from "../../../api/appUsersApi.ts";
import { dictionaryApi, DictionaryType } from "../../../api/dictionaryApi.ts";
import AppUserFormModal from "../../../components/AppUserFormModal.tsx";
import type {
  AppUserListItem,
  UsersFilterParams,
} from "../../../types/AppUser.ts";
import type { DictionaryValue } from "../../../types/DictionaryValue.ts";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FilterListIcon from "@mui/icons-material/FilterList";
import WarningIcon from "@mui/icons-material/Warning";
import type { PageableParam } from "../../../types/Pageable.ts";

const DEFAULT_PAGE_SIZE = 10;

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const [appUsers, setAppUsers] = useState<AppUserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState<DictionaryValue[]>([]);
  const [positions, setPositions] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appUserToDelete, setAppUserToDelete] =
    useState<AppUserListItem | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppUser, setEditingAppUser] = useState<AppUserListItem | null>(
    null,
  );

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
  const [appliedFilters, setAppliedFilters] = useState<UsersFilterParams>({});

  const roleLabel = (code: string) =>
    roles.find((r) => r.code === code)?.name ?? code;

  const positionLabel = (code: string) =>
    positions.find((p) => p.code === code)?.name ?? code;

  const loadAppUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageable: PageableParam = {
        page: page + 1,
        pageSize,
        sortBy,
        descending,
      };
      const data = await appUsersApi.getAppUsers(appliedFilters, pageable);
      setAppUsers(data.results);
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
    void loadAppUsers();
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
    setEditingAppUser(null);
    setModalOpen(true);
  };

  const handleEditClick = (appUser: AppUserListItem) => {
    setEditingAppUser(appUser);
    setModalOpen(true);
  };

  const handleDeleteClick = (appUser: AppUserListItem) => {
    setAppUserToDelete(appUser);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!appUserToDelete) return;

    try {
      await appUsersApi.deleteAppUser(appUserToDelete.userId);
      setDeleteDialogOpen(false);
      setAppUserToDelete(null);
      void loadAppUsers();
    } catch {
      alert("Nie udało się usunąć pracownika");
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAppUserToDelete(null);
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
                    {appUsers.map((appUser) => (
                      <TableRow key={appUser.userId} hover>
                        <TableCell>{appUser.email}</TableCell>
                        <TableCell>{appUser.firstName}</TableCell>
                        <TableCell>{appUser.lastName}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#6b1020" }}>
                          {roleLabel(appUser.roleCode)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {appUser.positionCodes.map((code) => (
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
                              onClick={() => handleEditClick(appUser)}
                            >
                              <EditIcon
                                fontSize="medium"
                                sx={{ color: "#6b1020" }}
                              />
                            </IconButton>
                          </Tooltip>
                          {["admin", "employee"].includes(appUser.roleCode) && (
                            <Tooltip title="Zobacz przydzielone zadania">
                              <IconButton
                                size="medium"
                                onClick={() =>
                                  navigate(
                                    `/admin/users/${appUser.userId}/tasks`,
                                    {
                                      state: {
                                        assigneeName: `${appUser.firstName} ${appUser.lastName}`,
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
                              onClick={() => handleDeleteClick(appUser)}
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

              {appUsers.length === 0 && (
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

      <AppUserFormModal
        open={modalOpen}
        employee={editingAppUser}
        onClose={() => setModalOpen(false)}
        onSuccess={loadAppUsers}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "#6b1020",
            color: "white",
            fontWeight: 700,
          }}
        >
          Usuń pracownika
        </DialogTitle>

        <DialogContent sx={{ pt: "20px !important" }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
            <WarningIcon
              sx={{
                color: "#f9a825",
                fontSize: 36,
              }}
            />
            <Typography>
              Czy na pewno chcesz usunąć pracownika{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: "#6b1020",
                }}
              >
                {appUserToDelete?.firstName} {appUserToDelete?.lastName}
              </Box>
              ?
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog}>Anuluj</Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              bgcolor: "#6b1020",
              "&:hover": {
                bgcolor: "#87182b",
              },
            }}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
