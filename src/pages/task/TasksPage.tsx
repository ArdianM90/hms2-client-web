import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Collapse,
  Autocomplete,
  TextField,
  TablePagination,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { DictionaryValue } from "../../types/DictionaryValue";
import type { TaskListItem, TasksFilterParams } from "../../types/Task";
import { TaskStatus } from "../../types/Task";
import { taskApi } from "../../api/taskApi";
import { dictionaryApi, DictionaryType } from "../../api/dictionaryApi.ts";
import type { TableColumn } from "../../types/TableColumn.ts";
import { commonTaskColumns } from "../../config/CommonTableColumns.tsx";
import TasksTable from "../../components/TasksTable.tsx";
import type { PageableParam, PageableResult } from "../../types/Pageable.ts";
import { useAuth } from "../../auth/AuthContext.ts";
import {
  createExportPageable,
  exportToPdf,
  exportToXlsx,
} from "../../api/utils/exportUtils.ts";
import ExportButton from "../../components/ExportButton.tsx";

export default function TasksPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [total, setTotal] = useState(0);

  const [taskTypes, setTaskTypes] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_PAGE_SIZE = 10;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<string>("dueAt");
  const [descending, setDescending] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<DictionaryValue[]>(
    [],
  );
  const [query, setQuery] = useState("");
  const [dueFrom, setDueFrom] = useState<string>("");
  const [dueTo, setDueTo] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<TasksFilterParams>({});

  const [exporting, setExporting] = useState(false);

  async function fetchTasks(
    pageable: PageableParam,
  ): Promise<PageableResult<TaskListItem[]>> {
    return taskApi.getTasks(appliedFilters, pageable);
  }

  const loadTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTasks({
        page: page + 1,
        pageSize,
        sortBy,
        descending,
      });
      setTasks(data.results);
      setTotal(data.total);
    } catch {
      setError("Nie udało się pobrać listy zadań");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dictionaryApi
      .getDictionary(DictionaryType.EMPLOYEE_TASK)
      .then(setTaskTypes);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks();
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

  const updateLocalStatus = (
    employeeTaskId: number,
    status: DictionaryValue,
    extra?: Partial<TaskListItem>,
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.employeeTaskId === employeeTaskId ? { ...t, status, ...extra } : t,
      ),
    );
  };

  const handleExportPdf = async () => {
    setExporting(true);

    try {
      const pageable: PageableParam = createExportPageable(sortBy, descending);
      const { results } = await fetchTasks(pageable);
      exportToPdf("Lista zadań", columns, results, "zadania");
    } finally {
      setExporting(false);
    }
  };

  const handleExportXlsx = async () => {
    setExporting(true);

    try {
      const pageable: PageableParam = createExportPageable(sortBy, descending);
      const { results } = await fetchTasks(pageable);
      exportToXlsx(columns, results, "zadania");
    } finally {
      setExporting(false);
    }
  };

  const handleStart = async (employeeTaskId: number) => {
    try {
      await taskApi.updateStatus(employeeTaskId, {
        statusCode: TaskStatus.IN_PROGRESS,
      });
      updateLocalStatus(employeeTaskId, {
        code: TaskStatus.IN_PROGRESS,
        name: "W trakcie",
      });
    } catch {
      alert("Nie udało się rozpocząć zadania");
    }
  };

  const handleComplete = async (employeeTaskId: number) => {
    const completedAt = new Date().toISOString();
    try {
      await taskApi.updateStatus(employeeTaskId, {
        statusCode: TaskStatus.COMPLETED,
        completedAt,
      });
      updateLocalStatus(
        employeeTaskId,
        { code: TaskStatus.COMPLETED, name: "Wykonane" },
        { completedAt },
      );
    } catch {
      alert("Nie udało się zakończyć zadania");
    }
  };

  const applyFilters = () => {
    setPage(0);
    setAppliedFilters({
      query: query.trim() || undefined,
      taskTypeCodes: selectedTaskTypes.length
        ? selectedTaskTypes.map((t) => t.code)
        : undefined,
      dueFrom: dueFrom || undefined,
      dueTo: dueTo || undefined,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTaskTypes([]);
    setDueFrom("");
    setDueTo("");
    setPage(0);
    setAppliedFilters({});
  };

  const activeFilterCount =
    (appliedFilters.query ? 1 : 0) +
    (appliedFilters.taskTypeCodes?.length ?? 0) +
    (appliedFilters.dueFrom ? 1 : 0) +
    (appliedFilters.dueTo ? 1 : 0);

  const assigneeColumn: TableColumn<TaskListItem> = {
    header: "Pracownik",
    render: (dto) => `${dto.assigneeFirstName} ${dto.assigneeLastName}`,
    exportValue: (dto) => `${dto.assigneeFirstName} ${dto.assigneeLastName}`,
  };

  const actionsColumn: TableColumn<TaskListItem> = {
    header: "Akcje",
    align: "center",
    render: (dto) => (
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        {dto.status.code === TaskStatus.ASSIGNED && (
          <Button
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={() => void handleStart(dto.employeeTaskId)}
            sx={{ color: "#6b1020" }}
          >
            Rozpocznij
          </Button>
        )}
        {dto.status.code === TaskStatus.IN_PROGRESS && (
          <Button
            size="small"
            startIcon={<TaskAltIcon />}
            onClick={() => void handleComplete(dto.employeeTaskId)}
            sx={{ color: "#6b1020" }}
          >
            Zakończ
          </Button>
        )}
        {dto.reservationId !== null && (
          <Button
            size="small"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => navigate(`/reservation/${dto.reservationId}`)}
          >
            Szczegóły rezerwacji
          </Button>
        )}
      </Box>
    ),
  };

  const columns: TableColumn<TaskListItem>[] = [
    ...(isAdmin ? [assigneeColumn] : []),
    ...commonTaskColumns,
    actionsColumn,
  ];

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isAdmin ? "Lista zadań" : "Moje zadania"}
      </Typography>

      <Card sx={{ borderLeft: "5px solid #6b1020" }}>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              flexWrap: "wrap",
              rowGap: 1,
            }}
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
                {isAdmin && (
                  <TextField
                    size="small"
                    label="Pracownik"
                    placeholder="Imię lub nazwisko"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ minWidth: 260 }}
                  />
                )}
                <Autocomplete
                  multiple
                  size="small"
                  sx={{ minWidth: 260 }}
                  options={taskTypes}
                  getOptionLabel={(o) => o.name}
                  isOptionEqualToValue={(a, b) => a.code === b.code}
                  value={selectedTaskTypes}
                  onChange={(_, value) => setSelectedTaskTypes(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Rodzaj zadania" />
                  )}
                />
                <TextField
                  size="small"
                  type="date"
                  label="Termin od"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={dueFrom}
                  onChange={(e) => setDueFrom(e.target.value)}
                />
                <TextField
                  size="small"
                  type="date"
                  label="Termin do"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={dueTo}
                  onChange={(e) => setDueTo(e.target.value)}
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
              <TasksTable
                tasks={tasks}
                columns={columns}
                sortBy={sortBy}
                sortDescending={descending}
                onSortChange={handleSortChange}
              />

              {tasks.length === 0 && (
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                  Brak przydzielonych zadań
                </Typography>
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <ExportButton
                  onExportPdf={() => void handleExportPdf()}
                  onExportXlsx={() => void handleExportXlsx()}
                  disabled={exporting || tasks.length === 0}
                />

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
                      {
                        fontWeight: 500,
                      },
                    "& .MuiIconButton-root": {
                      color: "#6b1020",
                    },
                    "& .MuiTablePagination-actions": {
                      marginLeft: 1,
                    },
                  }}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
