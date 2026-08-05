import { readMetaSignedRequest } from "../../lib/meta-signed-request";

export const prerender = false;

export async function POST({ request, url }: { request: Request; url: URL }): Promise<Response> {
  const form = await request.formData();
  const payload = await readMetaSignedRequest(form.get("signed_request")?.toString() ?? null);

  if (!payload) {
    return Response.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  // La landing no guarda datos de usuarios de Meta; la eliminación se confirma de inmediato.
  const confirmationCode = crypto.randomUUID();
  const statusUrl = new URL("/meta/data-deletion/status", url.origin);
  statusUrl.searchParams.set("code", confirmationCode);

  return Response.json({
    url: statusUrl.toString(),
    confirmation_code: confirmationCode,
  });
}
