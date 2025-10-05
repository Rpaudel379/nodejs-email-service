import mongoose from "mongoose";
import z from "zod";

export const IdSchema = z
  .string({ required_error: "id is required" })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid id",
    path: ["id"],
  });

export type Id = z.infer<typeof IdSchema>;

// pagination
export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalContent: number;
};

export type PaginatedEntity<T> = {
  data: T;
  totalContent: number;
};

export type PaginatedDTO<T> = {
  data: T;
  pagination: Pagination;
};

// api response
export type ApiResponse<T> = {
  status: "success" | "error" | "failed";
  message: string;
  data: T;
  pagination?: Pagination;
};
