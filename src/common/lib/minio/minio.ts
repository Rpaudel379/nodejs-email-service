import {
  MINIO_BUCKET_ACCESS_KEY,
  MINIO_BUCKET_ENDPOINT,
  MINIO_BUCKET_PORT,
  MINIO_BUCKET_SECRET_KEY,
} from "@assets/constants/variables";
import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: MINIO_BUCKET_ENDPOINT,
  port: MINIO_BUCKET_PORT,
  useSSL: false,
  accessKey: MINIO_BUCKET_ACCESS_KEY,
  secretKey: MINIO_BUCKET_SECRET_KEY,
});
