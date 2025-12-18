export async function notifyUser({
  channel,
  message,
}: {
  channel: "email" | "sms" | "whatsapp";
  message: string;
}) {
  console.log(`NOTIFY [${channel}]:`, message);
}
