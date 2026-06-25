export function GET(request, { params }) {
  return { id: params.id };
}

export async function POST(request, { params }) {
  const received = await request.json().catch(() => null);
  return { id: params.id, received };
}
