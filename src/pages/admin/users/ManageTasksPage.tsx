import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TableContainer,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Collapse,
  TextField,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import { taskApi } from "../../../api/taskApi.ts";
import { type TaskListItem } from "../../../types/Task.ts";
import TaskFormModal from "../../../components/TaskFormModal.tsx";
import type { DictionaryValue } from "../../../types/DictionaryValue.ts";
import { dictionaryApi, DictionaryType } from "../../../api/dictionaryApi.ts";
import type { PageableParam, PageableResult } from "../../../types/Pageable.ts";
import type { TasksFilterParams } from "../../../types/Task.ts";
import TasksTable from "../../../components/TasksTable.tsx";
import type {TableColumn} from "../../../types/TableColumn.ts";
import {commonTaskColumns} from "../../../config/CommonTableColumns.tsx";

type LocationState = { assigneeName?: string } | null;

const DEFAULT_PAGE_SIZE = 10;

export default function ManageTasksPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const assigneeName =
    (location.state as LocationState)?.assigneeName ?? "Pracownik";

  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [taskTypes, setTaskTypes] = useState<DictionaryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<string>("dueAt");
  const [descending, setDescending] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<DictionaryValue[]>(
    [],
  );
  const [dueFrom, setDueFrom] = useState<string>("");
  const [dueTo, setDueTo] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<TasksFilterParams>({});

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageable: PageableParam = {
        page: page + 1,
        pageSize,
        sortBy,
        descending,
      };
      const data: PageableResult<TaskListItem[]> = await taskApi.getTasks(
        { ...appliedFilters },
        pageable,
      );

      console.log(data.results);
      console.log(data.results[0]);
      console.log(data.results[0].status);

      setTasks(data.results);
      setTotal(data.total);
    } catch {
      setError("Nie udało się pobrać listy zadań");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // dictionaryApi.getDictionary(DictionaryType.TASK_STATUS).then(setStatuses);
    dictionaryApi
      .getDictionary(DictionaryType.EMPLOYEE_TASK)
      .then(setTaskTypes);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, page, pageSize, sortBy, descending, appliedFilters]);

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
      taskTypeCodes: selectedTaskTypes.length
        ? selectedTaskTypes.map((t) => t.code)
        : undefined,
      dueFrom: dueFrom || undefined,
      dueTo: dueTo || undefined,
    });
  };

  const clearFilters = () => {
    setSelectedTaskTypes([]);
    setDueFrom("");
    setDueTo("");
    setPage(0);
    setAppliedFilters({});
  };

  const activeFilterCount =
    (appliedFilters.taskTypeCodes?.length ?? 0) +
    (appliedFilters.dueFrom ? 1 : 0) +
    (appliedFilters.dueTo ? 1 : 0);

  const columns: TableColumn<TaskListItem>[] = [...commonTaskColumns];

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Zadania — {assigneeName}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#6b1020", "&:hover": { bgcolor: "#87182b" } }}
          onClick={() => setModalOpen(true)}
        >
          Dodaj zadanie
        </Button>
      </Box>

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
                    <TextField {...params} label="Typ zadania" />
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
              <TableContainer>
                <TasksTable
                    tasks={tasks}
                    columns={columns}
                    sortBy={sortBy}
                    sortDescending={descending}
                    onSortChange={handleSortChange}
                />
              </TableContainer>

              {tasks.length === 0 && (
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                  Brak przydzielonych zadań
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
                labelRowsPerPage="Wierszy na stronę"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} z ${count}`
                }
              />
            </>
          )}
        </CardContent>
      </Card>

      <TaskFormModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        assigneeUserId={userId}
        assigneeName={assigneeName}
        onClose={() => setModalOpen(false)}
        onSuccess={loadTasks}
      />
    </Box>
  );
}
