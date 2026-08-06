type MetaPayload = Record<string, unknown>;

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/** Validates the signed_request payload sent by Meta to server callbacks. */
export async function readMetaSignedRequest(
  signedRequest: string | null,
): Promise<MetaPayload | null> {
  const appSecret = import.meta.env.META_APP_SECRET;
  if (!signedRequest || !appSecret) return null;

  const [encodedSignature, encodedPayload, ...extraParts] = signedRequest.split(".");
  if (!encodedSignature || !encodedPayload || extraParts.length > 0) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(appSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(encodedSignature) as BufferSource,
      new TextEncoder().encode(encodedPayload),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload)));
    return typeof payload === "object" && payload !== null ? payload as MetaPayload : null;
  } catch {
    return null;
  }
}
