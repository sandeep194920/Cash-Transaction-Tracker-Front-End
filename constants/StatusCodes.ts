import { StatusCodesT } from "./../types";

export const STATUS_CODES: Record<StatusCodesT, number> = {
  INVALID_CREDENTIALS: 401,
  USER_EXISTS: 409,
  USER_VERIFIED_ALREADY: 409,
  SERVER_ERROR: 500,
  CREATED: 201,
  SUCCESS: 200,
  EMAIL_NOT_VERIFIED: 403,
  NOT_FOUND: 404,
};
