export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors?: Record<string, string | string[] | undefined>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string | string[] | undefined>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "failed" : "error";
    this.isOperational = true;
    this.errors = errors;

    // capture the stack trace but exclude the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}
