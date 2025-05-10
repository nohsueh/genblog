export async function GET() {
  return new Response(
    `google.com, ${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}, DIRECT, f08c47fec0942fa0`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}
