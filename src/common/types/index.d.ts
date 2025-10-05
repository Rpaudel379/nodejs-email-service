import "mailparser";

declare module "mailparser" {
  interface ParsedMail {
    /**
     * custom minio attachment which hold objectName(filename)[] from minio bucket
     */
    minioAttachments: string[];
  }
}
