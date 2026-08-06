export const prerender = false;

const page = (title: string, message: string) => `<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
  <body style="font-family:system-ui,sans-serif;max-width:42rem;margin:4rem auto;padding:0 1.5rem">
    <h1>${title}</h1><p>${message}</p><p><a href="/">Volver a Nova Smart</a></p>
  </body>
</html>`;

export function GET({ url }: { url: URL }): Response {
  if (url.searchParams.has("error")) {
    return new Response(
      page("No se completó la autorización", "Puedes cerrar esta ventana e intentar nuevamente."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  return new Response(
    page("Autorización recibida", "La autorización de Meta se recibió correctamente. Puedes cerrar esta ventana."),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
