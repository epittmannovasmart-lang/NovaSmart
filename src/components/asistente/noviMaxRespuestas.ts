/**
 * Temas, preguntas y respuestas predefinidas de NoviMax, el asistente de la web.
 *
 * Es el asistente de la intranet (allí, Maxi), pero hablando con clientes: cada tema tiene
 * sus preguntas y, si quiere, un acceso a su sección de la página. Para sumar un
 * tema nuevo basta con agregar otra entrada a `TEMAS_NOVIMAX`; la interfaz no cambia.
 *
 * Los datos (planes, entregas, tiendas) salen de `pages/index.astro`: si cambia
 * algo allí, hay que corregir el texto aquí.
 */

/** Mascota a 360 px de alto para el asistente. La completa (893×1200) es `images/mascota_oficial.webp`. */
export const MASCOTA_SRC = '/images/mascota_novimax.webp'

const TELEFONO = '51983985748'

/** Asesoría humana para lo que NoviMax no resuelve, sea del tema que sea. */
export const SOPORTE = {
  nombre: 'un asesor NovaSmart',
  numero: '+51 983 985 748',
  enlace: `https://wa.me/${TELEFONO}?text=${encodeURIComponent('Hola, quiero recibir asesoría de NovaSmart')}`,
}

/** Sección de la página del tema: un solo acceso fijo al pie del chat. */
export interface SeccionTema {
  etiqueta: string
  href: string
}

export interface PreguntaNoviMax {
  id: string
  pregunta: string
  /** Texto corto antes de los pasos. */
  respuesta: string
  pasos?: string[]
  nota?: string
}

export interface TemaNoviMax {
  id: string
  titulo: string
  /** Emoji del chip del tema. */
  icono: string
  /** Lo primero que dice NoviMax al entrar al tema. Sin esto, un saludo genérico. */
  intro?: string
  seccion?: SeccionTema
  preguntas: PreguntaNoviMax[]
}

export const TEMAS_NOVIMAX: TemaNoviMax[] = [
  {
    id: 'fibra',
    titulo: 'Fibra hogar',
    icono: '⌁',
    intro: 'Tenemos planes de fibra óptica 100% simétrica desde S/ 69. Elige abajo lo que quieres saber.',
    seccion: { etiqueta: 'Ver planes de fibra', href: '#fibra' },
    preguntas: [
      {
        id: 'planes',
        pregunta: '¿Qué planes tienen?',
        respuesta: 'Van desde 200 Mbps hasta 5 Gbps, todos simétricos (misma velocidad de bajada y subida):',
        pasos: [
          '200 Mbps a S/ 69 y 300 Mbps a S/ 79, con el doble de velocidad para toda la vida.',
          '400 Mbps a S/ 69 por 6 meses y 500 Mbps a S/ 79, con bono a 1,000 Mbps por 12 meses.',
          '800 y 850 Mbps con router Wi‑Fi 6.',
          '1,000 Mbps a S/ 119 por 6 meses, con router Wi‑Fi 6 Mesh.',
          'Para los que necesitan más: 1,500 Mbps, 2.5 Gbps y 5 Gbps.',
        ],
        nota: 'Precios y bonos referenciales: un asesor te confirma la oferta vigente en tu zona.',
      },
      {
        id: 'cobertura',
        pregunta: '¿Cómo sé si llega a mi casa?',
        respuesta: 'Escríbenos tu distrito y dirección por WhatsApp y revisamos la cobertura contigo.',
      },
      {
        id: 'instalacion',
        pregunta: '¿Cuánto demora la instalación?',
        respuesta: 'La visita se coordina contigo según la disponibilidad de tu zona. Así funciona:',
        pasos: [
          'Eliges tu plan y confirmamos la cobertura.',
          'Agendamos la visita en el horario que te acomode.',
          'Un técnico instala la fibra y deja el router funcionando.',
        ],
      },
      {
        id: 'equipos',
        pregunta: '¿Qué equipo incluye?',
        respuesta: 'Todos los planes incluyen router: Wi‑Fi Dual Band en los básicos, Wi‑Fi 6 desde 800 Mbps y Wi‑Fi 6 Mesh en 1,000 Mbps. Los planes de 2.5 y 5 Gbps llevan ONT y router con capacidad 10G.',
      },
    ],
  },
  {
    id: 'movil',
    titulo: 'Líneas y chips',
    icono: '▯',
    intro: '¿Te quieres cambiar con tu número o activar una línea nueva? Te cuento cómo.',
    seccion: { etiqueta: 'Ver servicios móviles', href: '#movil' },
    preguntas: [
      {
        id: 'portabilidad',
        pregunta: '¿Puedo conservar mi número?',
        respuesta: 'Sí. Con la portabilidad te cambias a NovaSmart sin perder tu número:',
        pasos: [
          'Escríbenos por WhatsApp o visita una de nuestras tiendas.',
          'Un asesor te muestra los planes y te ayuda a elegir.',
          'Te entregamos tu chip y seguimos el cambio contigo hasta que esté activo.',
        ],
      },
      {
        id: 'chip',
        pregunta: '¿Cómo pido un chip nuevo?',
        respuesta: 'Puedes pedirlo por WhatsApp o recogerlo en cualquiera de nuestras tiendas. Te ayudamos a activarlo en el momento.',
      },
    ],
  },
  {
    id: 'equipos',
    titulo: 'Celulares y entregas',
    icono: '▣',
    intro: 'Tenemos celulares y accesorios, con entrega como te acomode.',
    seccion: { etiqueta: 'Ver celulares', href: '#celulares' },
    preguntas: [
      {
        id: 'entrega',
        pregunta: '¿Tienen delivery?',
        respuesta: 'Sí, puedes elegir entre tres opciones:',
        pasos: [
          'Retiro en tienda: en cualquiera de nuestros puntos de atención.',
          'Delivery programado: hasta en 3 días hábiles.',
          'Delivery express: en menos de 24 horas, en zonas seleccionadas.',
        ],
      },
      {
        id: 'precios',
        pregunta: '¿Los precios son finales?',
        respuesta: 'Los modelos y precios de la web son referenciales. Un asesor te confirma el precio, el stock y el plan que mejor te conviene.',
      },
    ],
  },
  {
    id: 'tiendas',
    titulo: 'Tiendas',
    icono: '⌖',
    intro: 'Tenemos 10 puntos de atención en Lima y Callao.',
    seccion: { etiqueta: 'Ver tiendas en el mapa', href: '#tiendas' },
    preguntas: [
      {
        id: 'donde',
        pregunta: '¿Dónde están?',
        respuesta: 'Nos encuentras en:',
        pasos: [
          'Parque Industrial, RP VMT y M.P. Isla José Gálvez (Villa María del Triunfo).',
          'Centro Cívico, Puruchuco y Surco.',
          'Mall Aventura SJL, Isla Comas e Isla Angamos.',
          'Isla Minka, en el Callao.',
        ],
        nota: 'En la sección de tiendas ves cada una en el mapa.',
      },
    ],
  },
]
