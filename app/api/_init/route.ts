import "@/lib/startCron";

export async function GET() {
  return new Response("Cron started");
}
