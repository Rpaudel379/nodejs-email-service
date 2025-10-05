import { Response } from "express";
import { ApiResponse, Pagination } from "@utils/common.dto";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  status: string,
  message: string,
  data: T,
  pagination?: Pagination
) => {
  return res
    .status(statusCode)
    .json({ status, message, data, pagination } as ApiResponse<T>);
};
