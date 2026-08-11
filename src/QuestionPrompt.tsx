import { useState, type ReactNode } from 'react'
import type { Question } from './data'

type Props = {
  question: Question
}

const contextualTerms: Record<string, string> = {
  'most appropriate': 'la opción MÁS adecuada para este caso',
  'least appropriate': 'la opción MENOS adecuada para este caso',
  'most likely': 'con mayor probabilidad de ser correcto o producir ese resultado',
  'least likely': 'con menor probabilidad de ser correcto o producir ese resultado',
  'what should': 'qué debería hacer o elegir',
  'what would you use': 'qué herramienta, mecanismo o enfoque usarías',
  'which approach': 'qué enfoque o estrategia',
  'which method': 'qué método',
  'which strategy': 'qué estrategia',
  'which tool': 'qué herramienta',
  'which configuration': 'qué configuración',
  'which setting': 'qué ajuste/configuración',
  'which sequence': 'qué secuencia u orden de pasos',
  'which workflow': 'qué flujo de trabajo',
  'do first': 'hacer primero',
  'checked first': 'revisarse primero',
  'should be used first': 'debería usarse primero',
  'before execution': 'antes de ejecutar',
  'after execution': 'después de ejecutar',
  'before accepting': 'antes de aceptar',
  'when needed': 'cuando sea necesario',
  'without': 'sin',
  'unless': 'a menos que',
  'while': 'mientras',
  'instead of': 'en vez de / en lugar de',
  'rather than': 'en vez de / en lugar de',
  'depends on': 'depende de',
  'requires': 'requiere',
  'required': 'requerido / obligatorio',
  'pending work': 'trabajo pendiente',
  'completed work': 'trabajo completado',
  'success criteria': 'criterios que definen cuándo la tarea está bien terminada',
  'source references': 'referencias a las fuentes de donde salió la información',
  'prior findings': 'hallazgos obtenidos previamente',
  'structured output': 'salida estructurada con un formato definido',
  'structured findings': 'hallazgos devueltos con campos/formato estable',
  'downstream': 'sistema o paso posterior que consume el resultado',
  'high-volume': 'gran volumen de elementos',
  'read-only': 'solo lectura, sin capacidad de modificar',
  'least privilege': 'mínimo privilegio: solo los permisos necesarios',
  'path glob': 'patrón para seleccionar rutas o nombres de archivo',
  'context window': 'ventana de contexto disponible para el modelo',
  'context fork': 'contexto aislado para ejecutar una tarea separadamente',
  'false positive': 'falso positivo: algo marcado como problema cuando en realidad es válido',
  'human review': 'revisión realizada por una persona',
  'message batches': 'procesamiento asíncrono por lotes de muchas solicitudes',
  'tool use': 'uso/invocación de herramientas',
  'tool choice': 'control sobre qué herramienta debe o puede invocarse',
  'json schema': 'esquema que define la estructura y tipos válidos del JSON',
  'edge cases': 'casos límite o poco comunes',
  'failure modes': 'formas en que algo puede fallar',
  'retry counts': 'cantidad de reintentos realizados',
  'deployment metadata': 'metadatos del despliegue',
  'service-status': 'estado de disponibilidad/salud de un servicio',
  'production': 'entorno productivo / real',
  'scope': 'alcance al que aplica algo',
  'discovery': 'descubrimiento de capacidades disponibles',
  'findings': 'hallazgos',
  'constraints': 'restricciones',
  'checkpoint': 'punto de control guardado para continuar o revisar',
  'checkpoints': 'puntos de control para seguir progreso o reanudar',
  'ambiguous': 'ambiguo: puede interpretarse de más de una forma',
  'unusual': 'inusual / fuera de lo común',
  'confidence': 'nivel de confianza en el resultado',
  'reliable': 'confiable',
  'reliably': 'de forma confiable',
  'retrieve': 'recuperar / obtener',
  'lookup': 'consulta para obtener información',
  'lookups': 'consultas para obtener información',
  'merge': 'fusionar / combinar resultados',
  'synthesize': 'sintetizar: combinar resultados en una conclusión',
  'synthesis': 'síntesis de varios resultados',
  'retain': 'conservar',
  'retained': 'conservado',
  'omit': 'omitir / no incluir',
  'omits': 'omite / no incluye',
  'truncated': 'truncado / cortado antes de terminar',
  'truncates': 'se corta antes de terminar',
  'boundary': 'límite entre lo que se incluye y lo que se excluye',
  'boundaries': 'límites de inclusión/exclusión',
  'writable': 'con permiso de escritura/modificación',
  'blast radius': 'alcance potencial del daño de una acción',
}

function isWordCharacter(value: string | undefined) {
  return Boolean(value && /[A-Za-z0-9_]/.test(value))
}

function canMatch(prompt: string, start: number, term: string) {
  if (prompt.slice(start, start + term.length).toLowerCase() !== term.toLowerCase()) return false
  const before = prompt[start - 1]
  const after = prompt[start + term.length]
  if (isWordCharacter(term[0]) && isWordCharacter(before)) return false
  if (isWordCharacter(term[term.length - 1]) && isWordCharacter(after)) return false
  return true
}

export default function QuestionPrompt({ question }: Props) {
  const [activeToken, setActiveToken] = useState<string | null>(null)
  const translations = new Map<string, string>()
  Object.entries(contextualTerms).forEach(([term, translation]) => translations.set(term.toLowerCase(), translation))
  Object.entries(question.vocabulary ?? {}).forEach(([term, translation]) => {
    if (!translations.has(term.toLowerCase())) translations.set(term.toLowerCase(), translation)
  })

  const terms = [...translations.keys()].sort((a, b) => b.length - a.length)
  const nodes: ReactNode[] = []
  let cursor = 0
  let textStart = 0
  let translatedTerms = 0

  while (cursor < question.prompt.length) {
    const match = terms.find((term) => canMatch(question.prompt, cursor, term))
    if (!match) {
      cursor += 1
      continue
    }

    if (textStart < cursor) nodes.push(question.prompt.slice(textStart, cursor))
    const original = question.prompt.slice(cursor, cursor + match.length)
    const translation = translations.get(match)!
    const tokenKey = `${cursor}-${match}`
    translatedTerms += 1
    nodes.push(
      <button
        type="button"
        className={`translation-token ${activeToken === tokenKey ? 'active' : ''}`}
        data-translation={translation}
        key={tokenKey}
        aria-label={`${original}: ${translation}`}
        aria-pressed={activeToken === tokenKey}
        onClick={() => setActiveToken((current) => current === tokenKey ? null : tokenKey)}
      >
        {original}
      </button>,
    )
    cursor += match.length
    textStart = cursor
  }

  if (textStart < question.prompt.length) nodes.push(question.prompt.slice(textStart))

  return <>
    <span className="translated-question-text">{nodes}</span>
    {translatedTerms > 0 && <span className="translation-hint">🌐 Toca las palabras subrayadas para ver su significado en español.</span>}
  </>
}
