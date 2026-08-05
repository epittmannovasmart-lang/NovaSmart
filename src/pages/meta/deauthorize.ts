import { readMetaSignedRequest } from "../../lib/meta-signed-request";

export const prerender = false;

export async function POST({ request }: { request: Request }): Promise<Response> {
  const form = await request.formData();
  const payload = await readMetaSignedRequest(form.get("signed_request")?.toString() ?? null);

  if (!payload) {
    return Response.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  // Nova Smart no conserva tokens ni perfiles de Facebook en esta landing.
  return Response.json({ success: true });
}
