/**
 * NoviMax — la mascota de NovaSmart, como un chat con respuestas predefinidas.
 * Es el asistente de la intranet (allí, Maxi), adaptado a clientes de la web.
 *
 * Cerrado: la mascota flotando en la esquina inferior derecha con la burbuja
 * «¿Te ayudo?». Abierto: una conversación. Lo que eliges queda como burbuja
 * tuya y NoviMax responde debajo, así el historial no se pierde al cambiar de
 * pregunta o de tema. Las opciones van siempre al pie: temas, o las preguntas
 * del tema actual. En PC es una ventana flotante; en celular, una tarjeta abajo.
 * Al pie hay siempre un acceso a WhatsApp para lo que NoviMax no sabe.
 *
 * La conversación se guarda en `sessionStorage` (solo ids, no textos): cerrar y
 * reabrir la mantiene; cerrar la pestaña la borra. Los textos viven en
 * `noviMaxRespuestas.ts`; aquí solo está la interfaz.
 *
 * Se monta con `client:only`: depende de `sessionStorage` y no aporta nada al HTML del servidor.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MASCOTA_SRC, SOPORTE, TEMAS_NOVIMAX, type PreguntaNoviMax, type SeccionTema, type TemaNoviMax } from './noviMaxRespuestas'
import './AsistenteNoviMax.css'

type Mensaje =
  | { de: 'bot'; tipo: 'saludo' }
  | { de: 'bot'; tipo: 'soporte' }
  | { de: 'bot'; tipo: 'tema'; temaId: string }
  | { de: 'bot'; tipo: 'respuesta'; temaId: string; preguntaId: string }
  | { de: 'usuario'; texto: string }

interface Conversacion { mensajes: Mensaje[]; temaId: string | null }

const CLAVE_CHAT = 'novimax:chat:v1'
/** Lo que tarda NoviMax en «escribir»: da ritmo de chat sin hacer esperar. */
const ESPERA_RESPUESTA_MS = 450

const temaPorId = (id: string | null) => TEMAS_NOVIMAX.find((t) => t.id === id) ?? null
/** Siempre se empieza eligiendo tema: el camino es tema → pregunta. */
const inicioChat = (): Conversacion => ({ mensajes: [{ de: 'bot', tipo: 'saludo' }], temaId: null })
const preguntaPorId = (t: TemaNoviMax | null, id: string) => t?.preguntas.find((p) => p.id === id) ?? null

/** Lee la conversación guardada descartando lo que ya no exista (temas o preguntas borrados). */
function conversacionGuardada(): Conversacion {
  try {
    const c = JSON.parse(sessionStorage.getItem(CLAVE_CHAT) ?? 'null') as Conversacion | null
    if (!c || !Array.isArray(c.mensajes)) return { mensajes: [], temaId: null }
    const mensajes = c.mensajes.filter((m) =>
      m.de === 'usuario' ? typeof m.texto === 'string'
        : m.tipo === 'saludo' || m.tipo === 'soporte' ? true
          : m.tipo === 'tema' ? !!temaPorId(m.temaId)
            : !!preguntaPorId(temaPorId(m.temaId), m.preguntaId))
    return { mensajes, temaId: temaPorId(c.temaId) ? c.temaId : null }
  } catch {
    return { mensajes: [], temaId: null }
  }
}

const cx = (...clases: (string | false | null | undefined)[]) => clases.filter(Boolean).join(' ')

function Mascota({ className }: { className?: string }) {
  const [sinImagen, setSinImagen] = useState(false)
  // Si la imagen no carga, un círculo con la inicial ocupa su lugar.
  if (sinImagen) return <span className={cx('novimax-mascota--vacia', className)}>N</span>
  return <img src={MASCOTA_SRC} alt="NoviMax, la mascota de NovaSmart" className={cx('novimax-mascota', className)} onError={() => setSinImagen(true)} draggable={false} />
}

function Avatar({ className }: { className?: string }) {
  return (
    <span className={cx('novimax-avatar', className)}>
      <Mascota />
    </span>
  )
}

function IconoWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}

/**
 * Contacto con un asesor. En celular, el botón abre WhatsApp directamente; en
 * PC se suma el número, porque ahí WhatsApp suele estar en el teléfono.
 */
function TarjetaSoporte() {
  return (
    <div className="novimax-soporte">
      <a href={SOPORTE.enlace} target="_blank" rel="noopener noreferrer" className="novimax-soporte__boton">
        <IconoWhatsapp />
        Escribir por WhatsApp
      </a>
      <p className="novimax-soporte__numero">¿WhatsApp en el celular? Agréganos: <b>{SOPORTE.numero}</b></p>
    </div>
  )
}

function BurbujaBot({ children }: { children: ReactNode }) {
  return (
    <div className="novimax-fila">
      <Avatar className="novimax-avatar--chico" />
      <div className="novimax-burbuja">{children}</div>
    </div>
  )
}

export default function AsistenteNoviMax() {
  const [abierto, setAbierto] = useState(false)
  const [chat, setChat] = useState<Conversacion>(conversacionGuardada)
  const [escribiendo, setEscribiendo] = useState(false)
  const finRef = useRef<HTMLDivElement>(null)
  const listaRef = useRef<HTMLDivElement>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  const tema = temaPorId(chat.temaId)

  // Guarda la conversación: al cerrar y reabrir sigue donde quedó.
  useEffect(() => {
    try { sessionStorage.setItem(CLAVE_CHAT, JSON.stringify(chat)) } catch { /* sin almacenamiento: solo se pierde al recargar */ }
  }, [chat])

  // Tras una respuesta, la vista se detiene en la pregunta que la originó: con
  // respuestas largas, bajar hasta el final escondía el comienzo. Mientras
  // NoviMax «escribe», o al reabrir, se va al final.
  useEffect(() => {
    if (!abierto) return
    const comportamiento: ScrollBehavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    const n = chat.mensajes.length
    const ultimo = chat.mensajes[n - 1]
    const anterior = chat.mensajes[n - 2]
    if (!escribiendo && ultimo?.de === 'bot' && anterior?.de === 'usuario') {
      listaRef.current?.querySelector(`[data-msg="${n - 2}"]`)?.scrollIntoView({ behavior: comportamiento, block: 'start' })
    } else {
      finRef.current?.scrollIntoView({ behavior: comportamiento, block: 'end' })
    }
  }, [abierto, chat.mensajes, escribiendo])

  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current) }, [])

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [abierto])

  function abrir() {
    // La primera vez, NoviMax saluda; después se retoma la conversación guardada.
    if (chat.mensajes.length === 0) setChat(inicioChat())
    setAbierto(true)
  }

  /** Agrega lo que eligió el usuario y, tras un instante «escribiendo», la respuesta de NoviMax. */
  function responder(textoUsuario: string, respuesta: Mensaje, temaId: string | null) {
    if (escribiendo) return
    setChat((c) => ({ mensajes: [...c.mensajes, { de: 'usuario', texto: textoUsuario }], temaId }))
    setEscribiendo(true)
    temporizador.current = setTimeout(() => {
      setChat((c) => ({ ...c, mensajes: [...c.mensajes, respuesta] }))
      setEscribiendo(false)
    }, ESPERA_RESPUESTA_MS)
  }

  const elegirTema = (t: TemaNoviMax) => responder(t.titulo, { de: 'bot', tipo: 'tema', temaId: t.id }, t.id)
  const elegirPregunta = (t: TemaNoviMax, p: PreguntaNoviMax) =>
    responder(p.pregunta, { de: 'bot', tipo: 'respuesta', temaId: t.id, preguntaId: p.id }, t.id)
  const otroTema = () => responder('Quiero ver los temas', { de: 'bot', tipo: 'saludo' }, null)
  // Se queda en el tema actual: tras hablar con un asesor, sus preguntas siguen a mano.
  const pedirSoporte = () => responder('Tengo otra duda', { de: 'bot', tipo: 'soporte' }, chat.temaId)

  function reiniciar() {
    if (temporizador.current) clearTimeout(temporizador.current)
    setEscribiendo(false)
    setChat(inicioChat())
  }

  function irASeccion(s: SeccionTema) {
    // En celular el chat tapa la página: se cierra para que se vea la sección.
    if (window.matchMedia('(max-width: 639px)').matches) setAbierto(false)
    document.querySelector(s.href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const yaPreguntadas = new Set(chat.mensajes.flatMap((m) => (m.de === 'bot' && m.tipo === 'respuesta' ? [`${m.temaId}:${m.preguntaId}`] : [])))
  const pendientes = tema ? tema.preguntas.filter((p) => !yaPreguntadas.has(`${tema.id}:${p.id}`)) : []

  function contenidoBot(m: Exclude<Mensaje, { de: 'usuario' }>) {
    if (m.tipo === 'saludo') {
      return <p>¡Hola! Soy <b className="novimax-marca">NoviMax</b> 👋, el asistente de NovaSmart. Elige un tema y te ayudo a encontrar lo que buscas.</p>
    }
    if (m.tipo === 'soporte') {
      return (
        <>
          <p>Si no encontraste tu respuesta, escríbele a <b>{SOPORTE.nombre}</b> por WhatsApp. Cuéntanos qué necesitas y te respondemos.</p>
          <TarjetaSoporte />
        </>
      )
    }
    const t = temaPorId(m.temaId)
    if (!t) return null
    if (m.tipo === 'tema') {
      return <p>{t.intro ?? <>Perfecto, hablemos de <b>{t.titulo}</b>. Elige abajo lo que quieres saber.</>}</p>
    }
    const p = preguntaPorId(t, m.preguntaId)
    if (!p) return null
    return (
      <>
        <p>{p.respuesta}</p>
        {p.pasos && (
          <ol className="novimax-pasos">
            {p.pasos.map((paso, i) => (
              <li key={i}><span>{i + 1}</span>{paso}</li>
            ))}
          </ol>
        )}
        {p.nota && <p className="novimax-nota">{p.nota}</p>}
      </>
    )
  }

  if (!abierto) {
    return (
      <button type="button" onClick={abrir} className="novimax-lanzador" title="Abrir a NoviMax">
        <span className="novimax-lanzador__burbuja">¿Te ayudo?</span>
        <Mascota className="novimax-lanzador__mascota" />
      </button>
    )
  }

  return (
    <section role="dialog" aria-label="Chat con NoviMax, asistente de NovaSmart" className="novimax-chat">
      <header className="novimax-chat__cabecera">
        <Avatar className="novimax-avatar--grande" />
        <div className="novimax-chat__titulo">
          <p>NoviMax</p>
          <p><span />{tema ? `Te ayuda con ${tema.titulo}` : 'Asistente de NovaSmart'}</p>
        </div>
        <button type="button" onClick={reiniciar} className="novimax-chat__accion" title="Empezar de nuevo" aria-label="Empezar de nuevo">↻</button>
        <button type="button" onClick={() => setAbierto(false)} className="novimax-chat__accion" title="Cerrar" aria-label="Cerrar">✕</button>
      </header>

      <div ref={listaRef} className="novimax-chat__lista" aria-live="polite">
        {chat.mensajes.map((m, i) =>
          m.de === 'usuario' ? (
            <div key={i} data-msg={i} className="novimax-fila novimax-fila--usuario">
              <p className="novimax-burbuja novimax-burbuja--usuario">{m.texto}</p>
            </div>
          ) : (
            <BurbujaBot key={i}>{contenidoBot(m)}</BurbujaBot>
          ),
        )}
        {escribiendo && (
          <BurbujaBot>
            <span className="novimax-escribiendo" aria-label="NoviMax está escribiendo"><i /><i /><i /></span>
          </BurbujaBot>
        )}
        <div ref={finRef} />
      </div>

      <footer className="novimax-chat__pie">
        {/* Volver a los temas va junto al título y no al final de la lista: ahí
            quedaba escondido tras el scroll de las preguntas. */}
        <div className="novimax-chat__pie-titulo">
          <p>{!tema ? 'Elige un tema' : pendientes.length ? `Preguntas sobre ${tema.titulo}` : `Ya viste todo sobre ${tema.titulo} ✓`}</p>
          {tema && <button type="button" disabled={escribiendo} onClick={otroTema}>Ver temas</button>}
        </div>
        <div className="novimax-chips">
          {!tema && TEMAS_NOVIMAX.map((t) => (
            <button key={t.id} type="button" disabled={escribiendo} onClick={() => elegirTema(t)} className="novimax-chip">
              <b aria-hidden="true">{t.icono}</b>{t.titulo}
            </button>
          ))}
          {/* Solo lo que falta preguntar: lo respondido ya está en el historial. */}
          {tema && pendientes.map((p) => (
            <button key={p.id} type="button" disabled={escribiendo} onClick={() => elegirPregunta(tema, p)} className="novimax-chip">
              {p.pregunta}
            </button>
          ))}
          {tema && pendientes.length === 0 && (
            <button type="button" disabled={escribiendo} onClick={reiniciar} className="novimax-chip novimax-chip--neutro">↻ Empezar de nuevo</button>
          )}
        </div>
        {/* Un único acceso a la sección, siempre a mano: en cada respuesta se repetía. */}
        {tema?.seccion && (
          <button type="button" onClick={() => irASeccion(tema.seccion!)} className="novimax-seccion">
            {tema.seccion.etiqueta} <b>→</b>
          </button>
        )}
        {/* Para lo que NoviMax no sabe, de cualquier tema: siempre visible y discreto. */}
        <button type="button" disabled={escribiendo} onClick={pedirSoporte} className="novimax-otra-duda">
          <IconoWhatsapp />
          ¿Otra duda? Habla con un asesor
        </button>
      </footer>
    </section>
  )
}
