export type ReservationColumn<T> = {
    header: string;
    render: (dto: T, index: number) => React.ReactNode;
    align?: "left" | "right" | "center";
};