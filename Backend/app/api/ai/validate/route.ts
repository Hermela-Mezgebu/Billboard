// /app/api/ai/validate/route.ts
export async function POST(req: Request) {
  const body = await req.json();

  // fake logic (replace with OpenAI Vision)
  const fake =
    body.price < 100 ||
    body.location.length < 3;

  return Response.json({
    fake,
    confidence: fake ? 0.82 : 0.12,
    reason: fake ? "Suspicious pricing or invalid location" : "Valid"
  });
}