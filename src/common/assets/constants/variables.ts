import { config } from "dotenv";

config();
const env = process.env;

export const PORT = env.PORT || 5000;
export const DB_URI = env.DB_URI || "";
export const NODE_ENV = env.NODE_ENV || "development";

// Basic Authentication
export const BASIC_AUTH_USERNAME = env.BASIC_AUTH_USERNAME;
export const BASIC_AUTH_PASSWORD = env.BASIC_AUTH_PASSWORD as string;

// pagination => default values for pagination
export const CURRENT_PAGE = parseInt(env.CURRENT_PAGE as string);
export const PAGE_LIMIT = parseInt(env.PAGE_LIMIT as string);

// minio config
export const MINIO_BUCKET_NAME = env.MINIO_BUCKET_NAME as string;
export const MINIO_BUCKET_ACCESS_KEY = env.MINIO_BUCKET_ACCESS_KEY as string;
export const MINIO_BUCKET_SECRET_KEY = env.MINIO_BUCKET_SECRET_KEY as string;

export const MINIO_BUCKET_ENDPOINT = env.MINIO_BUCKET_ENDPOINT as string;
export const MINIO_BUCKET_PORT = parseInt(env.MINIO_BUCKET_PORT as string);

// webhook endpoint
export const WEBHOOK_ENDPOINT = env.WEBHOOK_ENDPOINT as string;
export const WEBHOOK_BASIC_TOKEN = env.WEBHOOK_BASIC_TOKEN as string;

// outlook credentials
export const OUTLOOK_USER = env.OUTLOOK_USER as string;
export const OUTLOOK_PASS = env.OUTLOOK_PASS as string;
export const OUTLOOK_IMAP_HOST = env.OUTLOOK_IMAP_HOST as string;
export const OUTLOOK_SMTP_HOST = env.OUTLOOK_SMTP_HOST as string;
// azure related
export const OUTLOOK_AZURE_CLIENT_ID = env.OUTLOOK_AZURE_CLIENT_ID as string;
export const OUTLOOK_AZURE_CLIENT_SECRET =
  env.OUTLOOK_AZURE_CLIENT_SECRET as string;
export const OUTLOOK_AZURE_TENANT_ID = env.OUTLOOK_AZURE_TENANT_ID as string;

// authentication types
export const AUTHENTICATION_TYPES = {
  BASIC: "basic",
  OAUTH2: "oauth2",
} as const;
