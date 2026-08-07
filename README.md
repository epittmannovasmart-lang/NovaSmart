# Nova Smart — Sitio Web Oficial Corporativo

Sitio web corporativo e informativo oficial de **Nova Smart** (Distribuidor Autorizado Claro / Consorcio Claro Perú), especializado en la comercialización e instalación de servicios de Fibra Óptica (FTTH/HFC) y bolsa de trabajo.

---

## Estructura del Proyecto

```text
nova_smart_web/
├── public/
│   ├── images/
│   │   └── equipo/              # Fotografías reales optimizadas por área
│   └── logo_oficial.jpeg        # Logo oficial y Favicon del sitio
├── src/
│   ├── components/              # Componentes modulares UI
│   │   ├── AyudaSeccion.astro   # Módulo "¿En qué podemos ayudarte?"
│   │   ├── Contacto.astro       # Formulario de contacto comercial
│   │   ├── Footer.astro         # Pie de página corporativo
│   │   ├── GaleriaEquipo.astro  # Galería interactiva de personal y áreas
│   │   ├── Header.astro         # Navegación principal y logo
│   │   ├── HeroCarousel.astro   # Carrusel principal de 3 diapositivas
│   │   ├── Nosotros.astro       # Presentación institucional
│   │   ├── PlanesOferta.astro   # Catálogo de planes Fibra Óptica Claro (37 planes)
│   │   ├── Servicios.astro      # Líneas de servicio técnico y comercial
│   │   └── Trabajos.astro       # Bolsa de vacantes y formulario de postulación
│   ├── data/
│   │   ├── promociones.json     # Datos de planes Claro (1Play, 2Play, 3Play, Focalizada)
│   │   ├── OFERTA REGULAR HFC Y FTTH VALIDO HASTA EL 15-08.pdf
│   │   └── OFERTA FOCALIZADA VALIDO HASTA EL 15-08.pdf
│   ├── layouts/
│   │   └── Layout.astro         # Plantilla global con Astro ClientRouter y View Transitions
│   ├── pages/
│   │   ├── atencion-soporte.astro
│   │   ├── contratar-fibra.astro
│   │   ├── eliminar-datos.astro
│   │   ├── index.astro          # Página principal ensamblada
│   │   ├── privacidad.astro
│   │   ├── terminos.astro
│   │   ├── trabajar-nosotros.astro
│   │   └── visitar-tiendas.astro
│   └── styles/
│       └── global.css           # Sistema de estilos corporativos (Claro UX)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Comandos de Desarrollo

| Comando | Desarrollo |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:4321` |
| `astro dev --background` | Servidor en segundo plano |
| `astro dev stop` | Detener servidor background |
| `astro dev status` | Verificar estado del servidor |
| `astro dev logs` | Ver logs del servidor |
| `npx astro check` | Diagnóstico TypeScript (0 errores) |
| `npx astro build` | Build de producción en `./dist/` |
| `npm run preview` | Previsualizar build en local |

---

## MCPs Utilizados

### Scrapeo de PDFs Claro

| MCP | Paquete | Uso |
| :--- | :--- | :--- |
| **pdf_extraction** | `mcp-pdf-reader` | Lectura de texto extraído de PDFs (`read_pdf_text`, `read_by_ocr`) |
| **pdf_citra** | `@sylphx/pdf-reader-mcp` | Renderizado de páginas PDF como imágenes (`render_page`), inspección de estructura PDF (`inspect`), evidencia de regiones (`extract_regions`) |

**Nota**: Los PDFs de Claro son generados en Adobe Illustrator (texto embebido como gráficos, no seleccionable). `pdf_extraction` retorna texto vacío. `pdf_citra` con `render_page` genera PNGs de alta resolución (1920x3408 a 2.0x scale) que se analizan visualmente para extraer datos de planes.

### Automatización y Navegación

| MCP | Paquete | Uso |
| :--- | :--- | :--- |
| **argus** | `argus-mcp` | Screenshots de páginas web, navegación automatizada |
| **chrome-devtools** | `chrome-devtools-mcp` | inspección de DOM, console logs, network requests, DevTools |
| **browserbase** | `@browserbasehq/mcp` | Navegación en la nube, extracción de contenido web |

### Gestión de Código y Datos

| MCP | Paquete | Uso |
| :--- | :--- | :--- |
| **github** | `@modelcontextprotocol/server-github` | CRUD de repos, issues, PRs, commits |
| **omnisql** | `omnisql-mcp` | Consultas SQL, gestión de bases de datos |
| **shadcn** | `shadcn-mcp` | Generación de componentes UI |

### Memoria y Contexto

| MCP | Paquete | Uso |
| :--- | :--- | :--- |
| **memorix** | `memorix` | Memoria de trabajo entre sesiones, contexto de proyecto |

---

## Datos de Planes Claro

Ubicación: `src/data/promociones.json`

| Modalidad | Cantidad | Subcategorías |
| :--- | :--- | :--- |
| 1 Play (Internet) | 10 | — |
| 2 Play (Int + TV / Telf) | 16 | Internet + TV (10) · Internet + Telefonía (6) |
| 3 Play (Trío Completo) | 6 | — |
| Ofertas Focalizadas | 5 | — |
| **Total** | **37** | |

**Vigencia**: Campaña hasta el 15 de Agosto de 2026

Campos por plan: `speed`, `price`, `priceNote`, `regularPrice`, `fullClaroSpeed`, `tag`, `equipos`, `entretenimiento`, `features[]`

---

## Repositorio Oficial

* **GitHub**: [https://github.com/jeremynovasmart/NovaSmart.git](https://github.com/jeremynovasmart/NovaSmart.git)
