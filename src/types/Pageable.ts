export type PageableParam = {
  page: number;
  pageSize: number;
  sortBy?: string;
  descending: boolean;
};

export type PageableResult<T> = {
  results: T;
  total: number;
};
