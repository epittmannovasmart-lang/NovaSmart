# Nova Smart — Sitio Web Oficial Corporativo

Sitio web corporativo e informativo oficial de **Nova Smart** (Distribuidor Autorizado Claro / Consorcio Claro Perú), especializado en la comercialización e instalación de servicios de Fibra Óptica (FTTH/HFC) y bolsa de trabajo.

---

## 📁 Estructura del Proyecto

```text
nova_smart_web/
├── public/
│   ├── images/
│   │   └── equipo/           # Fotografías reales optimizadas por área
│   │       ├── administracion_1.jpg
│   │       ├── callcenter_1.jpg
│   │       ├── promotores_campo_1.jpg
│   │       ├── tecnicos_1.jpg
│   │       └── tienda_1.jpg ...
│   └── logo_oficial.jpeg     # Logo oficial y Favicon del sitio
├── src/
│   ├── components/           # Componentes modulares UI
│   │   ├── AyudaSeccion.astro     # Módulo "¿En qué podemos ayudarte?"
│   │   ├── Contacto.astro         # Formulario de contacto comercial
│   │   ├── Footer.astro           # Pie de página corporativo
│   │   ├── GaleriaEquipo.astro    # Galería interactiva de personal y áreas
│   │   ├── Header.astro           # Navegación principal y logo
│   │   ├── HeroCarousel.astro     # Carrusel principal de 3 diapositivas
│   │   ├── Nosotros.astro         # Presentación institucional
│   │   ├── PlanesOferta.astro     # Cotizador de planes Fibra Óptica Claro
│   │   ├── Servicios.astro        # Líneas de servicio técnico y comercial
│   │   └── Trabajos.astro         # Bolsa de vacantes y formulario de postulación
│   ├── layouts/
│   │   └── Layout.astro      # Plantilla global con Astro ClientRouter y View Transitions
│   ├── pages/
│   │   └── index.astro       # Página principal ensamblada
│   └── styles/
│       └── global.css        # Sistema de estilos corporativos (Alicorp/Claro UX)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🛠️ Comandos de Desarrollo y Compilación

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:4321` |
| `npx astro check` | Realiza el diagnóstico completo de tipos TypeScript y sintaxis Astro (0 errores) |
| `npx astro build` | Genera la versión de producción optimizada estática en el directorio `./dist/` |
| `npm run preview` | Previsualiza la compilación de producción en local |

---

## 🔗 Repositorio Oficial
* **GitHub**: [https://github.com/jeremynovasmart/NovaSmart.git](https://github.com/jeremynovasmart/NovaSmart.git)
