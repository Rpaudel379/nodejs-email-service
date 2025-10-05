import type { EmailService } from "@common/services/email-service";

export type LoaderProps = {
  services: Record<string, { emailService: EmailService }>;
};

export type ExpressProps = {
  services: Record<string, { emailService: EmailService }>;
};
