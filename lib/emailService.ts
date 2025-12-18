export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  // Plug SendGrid / SES / Nodemailer later
  console.log("EMAIL QUEUED:", to, subject);
}
