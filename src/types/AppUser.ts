export interface AppUserListItem {
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

export interface UsersFilterParams {
  query?: string;
  roleCode?: string;
  positionCodes?: string[];
}
