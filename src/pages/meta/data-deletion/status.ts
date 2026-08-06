export const prerender = false;

export function GET(): Response {
  return new Response(`<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Eliminación de datos | Nova Smart</title></head>
  <body style="font-family:system-ui,sans-serif;max-width:42rem;margin:4rem auto;padding:0 1.5rem">
    <h1>Solicitud de eliminación recibida</h1>
    <p>La solicitud fue procesada. Esta landing no almacena perfiles, tokens ni datos de usuarios de Meta.</p>
    <p>Si necesitas ayuda, contáctanos a través de nuestros canales oficiales.</p>
  </body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
