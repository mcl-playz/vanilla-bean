export function GET(request, { query }) {
  return { hello: query.name ?? "world" };
}
