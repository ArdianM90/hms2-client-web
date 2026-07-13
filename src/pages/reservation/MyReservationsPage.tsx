import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Stack,
  Collapse,
  TextField,
  TablePagination,
  Autocomplete,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useEffect, useState } from "react";
import { reservationApi } from "../../api/reservationApi.ts";
import type { TableColumn } from "../../types/TableColumn.ts";
import { commonReservationColumns } from "../../config/CommonTableColumns.tsx";
import ReservationsTable from "../../components/ReservationsTable.tsx";
import { useNavigate } from "react-router-dom";
import {
  getStatusLabel,
  ReservationStatusCode,
} from "../../constants/reservationStatus.ts";
import type {
  ReservationDto,
  ReservationsFilterParams,
} from "../../types/Reservation.ts";
import type { DictionaryValue } from "../../types/DictionaryValue.ts";
import type { PageableParam, PageableResult } from "../../types/Pageable.ts";
import { dictionaryApi, DictionaryType } from "../../api/dictionaryApi.ts";
import FilterListIcon from "@mui/icons-material/FilterList";

const DEFAULT_PAGE_SIZE = 10;

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [total, setTotal] = useState(0);
  const [reservationStatuses, setReservationStatuses] = useState<
    DictionaryValue[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [descending, setDescending] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DictionaryValue | null>(
    null,
  );
  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");
  const [appliedFilters, setAppliedFilters] =
    useState<ReservationsFilterParams>({});

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

  const handleCancel = async (reservationId: number) => {
    try {
      await reservationApi.changeReservationStatus(
        reservationId,
        ReservationStatusCode.CANCELLED,
      );
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === reservationId
            ? {
                ...r,
                reservationStatus: {
                  code: ReservationStatusCode.CANCELLED,
                  name: getStatusLabel(ReservationStatusCode.CANCELLED),
                },
              }
            : r,
        ),
      );
    } catch {
      alert("Nie udało się anulować rezerwacji");
    }
  };

  const applyFilters = () => {
    setPage(0);
    setAppliedFilters({
      reservationStatusCode: selectedStatus?.code,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
    });
  };

  const clearFilters = () => {
    setSelectedStatus(null);
    setCreatedFrom("");
    setCreatedTo("");
    setPage(0);
    setAppliedFilters({});
  };

  const activeFilterCount =
    (appliedFilters.reservationStatusCode ? 1 : 0) +
    (appliedFilters.createdFrom ? 1 : 0) +
    (appliedFilters.createdTo ? 1 : 0);

  const columns: TableColumn<ReservationDto>[] = [
    ...commonReservationColumns.filter((col) => col.header !== "Źródło"),
    {
      header: "Akcje",
      align: "center",
      render: (dto) => (
        <Button
          color="error"
          startIcon={<CancelOutlinedIcon />}
          onClick={(e) => {
            e.stopPropagation();
            void handleCancel(dto.reservationId);
          }}
          disabled={
            dto.reservationStatus.code === ReservationStatusCode.CANCELLED
          }
        >
          Anuluj
        </Button>
      ),
    },
  ];

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Moje rezerwacje
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
    </Box>
  );
}
