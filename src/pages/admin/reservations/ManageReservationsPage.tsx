import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TableColumn } from "../../../types/TableColumn.ts";
import { commonReservationColumns } from "../../../config/CommonTableColumns.tsx";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { reservationApi } from "../../../api/reservationApi.ts";
import ReservationsTable from "../../../components/ReservationsTable.tsx";
import ManageReservationActions from "../../../components/ManageReservationActions.tsx";
import {
  getStatusLabel,
  type ReservationStatusCode,
} from "../../../constants/reservationStatus.ts";
import { useAuth } from "../../../auth/AuthContext.ts";
import type {
  ReservationDto,
  ReservationsFilterParams,
} from "../../../types/Reservation.ts";
import type { DictionaryValue } from "../../../types/DictionaryValue.ts";
import type { PageableParam, PageableResult } from "../../../types/Pageable.ts";
import { dictionaryApi, DictionaryType } from "../../../api/dictionaryApi.ts";
import FilterListIcon from "@mui/icons-material/FilterList";
import { exportToPdf, exportToXlsx } from "../../../api/utils/exportUtils.ts";
import ExportButton from "../../../components/ExportButton.tsx";

export default function ManageReservationsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [total, setTotal] = useState(0);

  const [reservationStatuses, setReservationStatuses] = useState<
    DictionaryValue[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_PAGE_SIZE = 10;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [descending, setDescending] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DictionaryValue | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");
  const [appliedFilters, setAppliedFilters] =
    useState<ReservationsFilterParams>({});

  const [exporting, setExporting] = useState(false);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageable: PageableParam = {
        page: page + 1,
        pageSize,
        sortBy,
        descending,
      };
      const data: PageableResult<ReservationDto[]> =
        await reservationApi.getReservations(appliedFilters, pageable);
      setReservations(data.results);
      setTotal(data.total);
    } catch {
      setError("Nie udało się pobrać listy rezerwacji");
    } finally {
      setLoading(false);
    }
  };

  async function fetchAllForExport(
    filters: ReservationsFilterParams,
    sortBy: string,
    descending: boolean,
  ): Promise<ReservationDto[]> {
    const data = await reservationApi.getReservations(filters, {
      page: 1,
      pageSize: 999,
      sortBy,
      descending,
    });
    return data.results;
  }

  useEffect(() => {
    dictionaryApi
      .getDictionary(DictionaryType.RESERVATION_STATUS)
      .then(setReservationStatuses);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReservations();
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

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const all = await fetchAllForExport(appliedFilters, sortBy, descending);
      exportToPdf("Moje rezerwacje", columns, all, "rezerwacje");
    } catch {
      alert("Nie udało się wygenerować pliku PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleExportXlsx = async () => {
    setExporting(true);
    try {
      const all = await fetchAllForExport(appliedFilters, sortBy, descending);
      exportToXlsx(columns, all, "rezerwacje");
    } catch {
      alert("Nie udało się wygenerować pliku XLSX");
    } finally {
      setExporting(false);
    }
  };

  const handleStatusChange = async (
    reservationId: number,
    statusCode: ReservationStatusCode,
  ): Promise<void> => {
    try {
      await reservationApi.changeReservationStatus(reservationId, statusCode);
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === reservationId
            ? {
                ...r,
                reservationStatus: {
                  code: statusCode,
                  name: getStatusLabel(statusCode),
                },
              }
            : r,
        ),
      );
    } catch {
      alert("Nie udało się zmienić statusu rezerwacji");
    }
  };

  const applyFilters = () => {
    setPage(0);
    setAppliedFilters({
      query: query.trim() || undefined,
      reservationStatusCode: selectedStatus?.code,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedStatus(null);
    setCreatedFrom("");
    setCreatedTo("");
    setPage(0);
    setAppliedFilters({});
  };

  const activeFilterCount =
    (appliedFilters.query ? 1 : 0) +
    (appliedFilters.reservationStatusCode ? 1 : 0) +
    (appliedFilters.createdFrom ? 1 : 0) +
    (appliedFilters.createdTo ? 1 : 0);

  const guestColumn: TableColumn<ReservationDto> = {
    header: "Gość",
    render: (dto) => `${dto.guestFirstName} ${dto.guestLastName}`,
    exportValue: (dto) => `${dto.guestFirstName} ${dto.guestLastName}`,
  };

  const adminActionsColumn: TableColumn<ReservationDto> = {
    header: "Akcje",
    align: "center",
    render: (dto) => (
      <ManageReservationActions dto={dto} onStatusChange={handleStatusChange} />
    ),
  };

  const columns: TableColumn<ReservationDto>[] = [
    ...(isAdmin ? [guestColumn] : []),
    ...commonReservationColumns,
    ...(isAdmin ? [adminActionsColumn] : []),
  ];

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isAdmin ? "Lista rezerwacji" : "Moje rezerwacje"}
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
                    label="Gość"
                    placeholder="Imię lub nazwisko"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ minWidth: 260 }}
                  />
                )}
                <Autocomplete
                  size="small"
                  sx={{ minWidth: 220 }}
                  options={reservationStatuses}
                  getOptionLabel={(o) => o.name}
                  isOptionEqualToValue={(a, b) => a.code === b.code}
                  value={selectedStatus}
                  onChange={(_, value) => setSelectedStatus(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" />
                  )}
                />
                <TextField
                  size="small"
                  type="date"
                  label="Utworzono od"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={createdFrom}
                  onChange={(e) => setCreatedFrom(e.target.value)}
                />
                <TextField
                  size="small"
                  type="date"
                  label="Utworzono do"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={createdTo}
                  onChange={(e) => setCreatedTo(e.target.value)}
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
              <ReservationsTable
                reservations={reservations}
                columns={columns}
                sortBy={sortBy}
                sortDescending={descending}
                onSortChange={handleSortChange}
                onRowClick={(dto) =>
                  navigate(`/reservation/${dto.reservationId}`)
                }
              />

              {reservations.length === 0 && (
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                  Brak rezerwacji
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
                  disabled={exporting || reservations.length === 0}
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
