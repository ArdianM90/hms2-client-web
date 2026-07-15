export interface EmployeeListItem {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleCode: string;
  positionCodes: string[];
}

export interface EmployeeRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleCode: string;
  positionCodes: string[];
}

export interface EmployeesFilterParams {
  query?: string;
  roleCode?: string;
  positionCodes?: string[];
}
