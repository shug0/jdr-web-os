export function corsMiddleware(request: Request, response: Response) {
  // Basic CORS headers
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  return new Response(null, {
    status: 200,
    headers,
  });
}