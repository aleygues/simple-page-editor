import { Resend } from "resend";
import { Logger } from "../utils/Logger";
import * as path from "path";
import * as fs from "fs/promises";

export interface EmailTemplateProps {
  [key: string]: any;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  props: EmailTemplateProps;
}

class EmailService {
  private static instance: EmailService;
  private resend!: Resend;

  private constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      Logger.warn("Emails", "RESEND_API_KEY not configured");
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send an email using a React template
   */
  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { to, subject, template, props } = options;

    try {
      // Build the template path
      const templatePath = path.join(
        __dirname,
        "../../emails",
        template,
        "index.html",
      );

      // Read the pre-compiled HTML template
      let html: string;
      try {
        html = await fs.readFile(templatePath, "utf-8");
      } catch (readError) {
        Logger.error("Emails", `Failed to read template: ${template}`, {
          error: (readError as Error).message,
        });
        throw new Error(`Email template not found: ${template}`);
      }

      // Replace template placeholders with actual props
      // Placeholders are in the format {{propName}}
      for (const [key, value] of Object.entries(props)) {
        const placeholder = `{{${key}}}`;
        html = html.split(placeholder).join(String(value));
      }

      // Send via Resend
      const { error } = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@simple-page-editor.com",
        to,
        subject,
        html,
      });

      if (error) {
        Logger.error("Emails", "Failed to send email", {
          error: error.message,
          to,
          subject,
        });
        throw new Error(`Failed to send email: ${error.message}`);
      }

      Logger.info("Emails", "Email sent successfully", {
        to,
        subject,
        template,
      });
    } catch (error) {
      Logger.error("Emails", "Error sending email", {
        error: (error as Error).message,
        to,
        subject,
      });
      throw error;
    }
  }

  /**
   * Send a validation email to a new user
   */
  async sendValidationEmail(email: string, token: string): Promise<void> {
    const validationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/validate?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: "Validate your account",
      template: "validate-account",
      props: {
        validationUrl,
        email,
      },
    });
  }
}

export const Email = EmailService.getInstance();
