export type TableColumn<T> = {
  header: string;
  render: (dto: T, index: number) => React.ReactNode;
  align?: "left" | "right" | "center";
  sortKey?: string;
  exportValue?: (dto: T) => string | number;
};
