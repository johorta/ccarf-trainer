import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export type TransferProgress = {
  answered: number
  correct: number
  byTopic: Record<string, { answered: number; correct: number }>
  completedLessons: string[]
  lastTopicId?: string
}

type CompactPayload = {
  v: 1
  l: 'es' | 'en'
  a: number
  c: number
  t: Record<string, [number, number]>
  d: string[]
  x?: string
}

type ProgressTransferProps = {
  locale: 'es' | 'en'
  progress: TransferProgress
  onImport: (progress: TransferProgress) => void
}

type StoredProgressTransferProps = {
  locale: 'es' | 'en'
  storageKey: string
}

const text = {
  es: {
    eyebrow: 'TRANSFERENCIA ENTRE DISPOSITIVOS',
    title: 'Pasar progreso con QR',
    description: 'Genera un QR en este dispositivo y escanéalo con el otro. Se transfieren lecciones y práctica, pero no el historial de simuladores.',
    generate: 'Generar código QR',
    generating: 'Generando…',
    close: 'Cerrar',
    scanTitle: 'Escanea este código',
    scanHelp: 'Abre la cámara del celular, escanea el QR y confirma la importación en la página que se abrirá.',
    incomingTitle: 'Progreso recibido',
    incomingHelp: 'Se reemplazarán las lecciones y estadísticas de práctica guardadas en este dispositivo. El historial local de simuladores no se modifica.',
    import: 'Importar progreso',
    cancel: 'Cancelar',
    imported: 'Progreso importado correctamente.',
    invalid: 'El enlace de transferencia no es válido o está dañado.',
    tooLarge: 'El progreso es demasiado grande para un QR. Reduce el historial de práctica o usa la exportación JSON.',
    launcher: 'Transferir progreso por QR',
  },
  en: {
    eyebrow: 'DEVICE-TO-DEVICE TRANSFER',
    title: 'Transfer progress with QR',
    description: 'Generate a QR code on this device and scan it with another one. Lessons and practice progress are transferred; mock-exam history is not.',
    generate: 'Generate QR code',
    generating: 'Generating…',
    close: 'Close',
    scanTitle: 'Scan this code',
    scanHelp: 'Open the phone camera, scan the QR code, and confirm the import on the page that opens.',
    incomingTitle: 'Progress received',
    incomingHelp: 'Saved lesson and practice progress on this device will be replaced. Local mock-exam history is not changed.',
    import: 'Import progress',
    cancel: 'Cancel',
    imported: 'Progress imported successfully.',
    invalid: 'The transfer link is invalid or damaged.',
    tooLarge: 'The progress payload is too large for a QR code. Reduce practice history or use JSON export.',
    launcher: 'Transfer progress by QR',
  },
} as const

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function compress(bytes: Uint8Array) {
  if (typeof CompressionStream === 'undefined') return null
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function decompress(bytes: Uint8Array) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Compression is not supported by this browser')
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

function compact(progress: TransferProgress, locale: 'es' | 'en'): CompactPayload {
  return {
    v: 1,
    l: locale,
    a: progress.answered,
    c: progress.correct,
    t: Object.fromEntries(Object.entries(progress.byTopic).map(([id, score]) => [id, [score.answered, score.correct]])),
    d: progress.completedLessons,
    x: progress.lastTopicId,
  }
}

function expand(payload: CompactPayload): TransferProgress {
  if (payload.v !== 1 || !Array.isArray(payload.d) || typeof payload.t !== 'object') throw new Error('Unsupported payload')
  return {
    answered: Math.max(0, Number(payload.a) || 0),
    correct: Math.max(0, Number(payload.c) || 0),
    byTopic: Object.fromEntries(
      Object.entries(payload.t).map(([id, score]) => [id, { answered: Math.max(0, Number(score?.[0]) || 0), correct: Math.max(0, Number(score?.[1]) || 0) }]),
    ),
    completedLessons: payload.d.filter((id): id is string => typeof id === 'string'),
    lastTopicId: typeof payload.x === 'string' ? payload.x : undefined,
  }
}

async function encode(progress: TransferProgress, locale: 'es' | 'en') {
  const bytes = new TextEncoder().encode(JSON.stringify(compact(progress, locale)))
  const compressed = await compress(bytes)
  return compressed && compressed.length < bytes.length ? `z.${toBase64Url(compressed)}` : `j.${toBase64Url(bytes)}`
}

async function decode(value: string) {
  const [mode, data] = value.split('.', 2)
  if (!data || (mode !== 'z' && mode !== 'j')) throw new Error('Invalid payload')
  const bytes = fromBase64Url(data)
  const decoded = mode === 'z' ? await decompress(bytes) : bytes
  return expand(JSON.parse(new TextDecoder().decode(decoded)) as CompactPayload)
}

function transferValueFromHash() {
  const marker = '#/transfer/'
  return window.location.hash.startsWith(marker) ? window.location.hash.slice(marker.length) : null
}

function clearTransferHash() {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}

function safeStoredProgress(storageKey: string): TransferProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Partial<TransferProgress>
    return {
      answered: Math.max(0, Number(stored.answered) || 0),
      correct: Math.max(0, Number(stored.correct) || 0),
      byTopic: stored.byTopic ?? {},
      completedLessons: stored.completedLessons ?? [],
      lastTopicId: stored.lastTopicId,
    }
  } catch {
    return { answered: 0, correct: 0, byTopic: {}, completedLessons: [] }
  }
}

export default function ProgressTransfer({ locale, progress, onImport }: ProgressTransferProps) {
  const labels = text[locale]
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [incoming, setIncoming] = useState<TransferProgress | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const transferValue = transferValueFromHash()
    if (!transferValue) return
    decode(transferValue)
      .then((decoded) => setIncoming(decoded))
      .catch(() => setStatus(labels.invalid))
  }, [labels.invalid])

  async function generateQr() {
    setGenerating(true)
    setStatus(null)
    try {
      const payload = await encode(progress, locale)
      const transferUrl = `${window.location.origin}${window.location.pathname}#/transfer/${payload}`
      if (transferUrl.length > 2600) throw new Error('Payload too large')
      setQrUrl(await QRCode.toDataURL(transferUrl, { errorCorrectionLevel: 'M', margin: 2, width: 360 }))
    } catch {
      setStatus(labels.tooLarge)
    } finally {
      setGenerating(false)
    }
  }

  function importIncoming() {
    if (!incoming) return
    onImport(incoming)
    setIncoming(null)
    setStatus(labels.imported)
    clearTransferHash()
  }

  function cancelIncoming() {
    setIncoming(null)
    clearTransferHash()
  }

  return (
    <article className="transfer-card">
      <span className="eyebrow">{labels.eyebrow}</span>
      <h2>{labels.title}</h2>
      <p>{labels.description}</p>
      <button className="primary" onClick={generateQr} disabled={generating}>{generating ? labels.generating : labels.generate}</button>
      {status && <p className="transfer-status" role="status">{status}</p>}

      {qrUrl && (
        <div className="transfer-dialog" role="dialog" aria-modal="true" aria-label={labels.scanTitle}>
          <div className="transfer-dialog-content">
            <span className="eyebrow">QR</span>
            <h2>{labels.scanTitle}</h2>
            <p>{labels.scanHelp}</p>
            <img className="transfer-qr" src={qrUrl} alt={labels.scanTitle} />
            <button className="secondary" onClick={() => setQrUrl(null)}>{labels.close}</button>
          </div>
        </div>
      )}

      {incoming && (
        <div className="transfer-dialog" role="dialog" aria-modal="true" aria-label={labels.incomingTitle}>
          <div className="transfer-dialog-content">
            <span className="eyebrow">QR</span>
            <h2>{labels.incomingTitle}</h2>
            <p>{labels.incomingHelp}</p>
            <div className="transfer-summary">
              <strong>{incoming.completedLessons.length}</strong>
              <span>{locale === 'es' ? 'lecciones completadas' : 'completed lessons'}</span>
              <strong>{incoming.answered}</strong>
              <span>{locale === 'es' ? 'preguntas practicadas' : 'practice questions'}</span>
            </div>
            <div className="transfer-actions">
              <button className="secondary" onClick={cancelIncoming}>{labels.cancel}</button>
              <button className="primary" onClick={importIncoming}>{labels.import}</button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export function StoredProgressTransfer({ locale, storageKey }: StoredProgressTransferProps) {
  const labels = text[locale]
  const [open, setOpen] = useState(() => Boolean(transferValueFromHash()))
  const [progress, setProgress] = useState(() => safeStoredProgress(storageKey))

  function importStoredProgress(incoming: TransferProgress) {
    let stored: Record<string, unknown> = {}
    try {
      stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Record<string, unknown>
    } catch {
      stored = {}
    }
    localStorage.setItem(storageKey, JSON.stringify({
      ...stored,
      ...incoming,
      examAttempts: Array.isArray(stored.examAttempts) ? stored.examAttempts : [],
    }))
    setProgress(incoming)
    clearTransferHash()
    window.location.reload()
  }

  function close() {
    setOpen(false)
    if (transferValueFromHash()) clearTransferHash()
  }

  return (
    <>
      <button className="transfer-launcher" onClick={() => { setProgress(safeStoredProgress(storageKey)); setOpen(true) }} aria-label={labels.launcher}>
        <span aria-hidden="true">▦</span>{labels.launcher}
      </button>
      {open && (
        <div className="transfer-drawer" role="dialog" aria-modal="true" aria-label={labels.title}>
          <div className="transfer-drawer-content">
            <button className="transfer-drawer-close" onClick={close} aria-label={labels.close}>×</button>
            <ProgressTransfer locale={locale} progress={progress} onImport={importStoredProgress} />
          </div>
        </div>
      )}
    </>
  )
}
