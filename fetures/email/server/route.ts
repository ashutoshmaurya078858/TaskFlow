import InviteEmail from "@/app/email/invite-email";
import { render } from "@react-email/render";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { BrevoClient } from "@getbrevo/brevo"; // 🔥 Import the modern client
import { z } from "zod";

// 1. Initialize the modern Brevo Client
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

const app = new Hono().post(
  "/invite",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      inviteLink: z.string().url(),
      workspaceName: z.string(),
    }),
  ),
  async (c) => {
    try {
      const { email, inviteLink, workspaceName } = c.req.valid("json");

      // 2. Convert your React Email component to an HTML string
      const htmlContent = await render(
        InviteEmail({ inviteLink, workspaceName }),
      );

      // 3. Send the email using the clean v5 syntax
      const response = await brevo.transactionalEmails.sendTransacEmail({
        subject: `You've been invited to ${workspaceName}`,
        htmlContent: htmlContent,

        // 🔥 FIX: Change this to your actual email address!
        sender: { name: "Flowtask", email: "poojajim30@gmail.com" },

        to: [{ email: email }],
      });

      return c.json({ data: response });
    } catch (error) {
      console.error("BREVO_ERROR:", error);

      // Extracting error safely for the frontend hook
      const errorMessage =
        (error as any)?.message || "Failed to send email via Brevo";

      return c.json({ error: errorMessage }, 500);
    }
  },
);

export default app;
