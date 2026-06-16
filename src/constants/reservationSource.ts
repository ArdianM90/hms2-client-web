export const ReservationSourceCode = {
  HMS_WEB: "hms-web",
  HMS_MOB: "hms-mobile",
  PHONE: "phone",
  EMAIL: "email",
  RECEPTION: "reception",
  OTHER: "other",
} as const;

export type ReservationSourceCode =
  (typeof ReservationSourceCode)[keyof typeof ReservationSourceCode];
