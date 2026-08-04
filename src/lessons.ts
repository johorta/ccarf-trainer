export type LessonSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  goodExample?: string
  badExample?: string
  diagram?: string[]
}

export type LessonContent = {
  topicId: string
  readingMinutes: number
  difficulty: 1 | 2 | 3 | 4 | 5
  objectives: string[]
  sections: LessonSection[]
  checklist: string[]
  summary: string[]
}

export const lessons: Record<string, LessonContent> = {
  'subagent-prompts': {
    topicId: 'subagent-prompts',
    readingMinutes: 22,
    difficulty: 5,
    objectives: [
      'Reconocer cuándo un subagente necesita más contexto antes de poder comenzar.',
      'Construir prompts autocontenidos con hallazgos, fuentes, restricciones y formato de salida.',
      'Distinguir entre contexto útil y datos irrelevantes que solo consumen tokens.',
      'Detectar las trampas habituales del examen sobre delegación incompleta.',
    ],
    sections: [
      {
        title: '1. Qué problema resuelve un subagente',
        paragraphs: [
          'Un subagente es un agente especializado al que un coordinador delega una parte concreta de un problema mayor. La ventaja no está solo en dividir trabajo: también permite aislar contexto, herramientas y criterios de éxito.',
          'El coordinador sigue siendo responsable de la estrategia global. Decide qué delegar, prepara el contexto y combina los resultados. El subagente ejecuta una tarea delimitada y devuelve evidencia utilizable.',
        ],
        diagram: ['Usuario', '↓', 'Coordinator', '├─ Search Agent', '├─ Review Agent', '└─ Synthesis Agent', '↓', 'Respuesta final'],
      },
      {
        title: '2. La regla central: el prompt debe ser autocontenido',
        paragraphs: [
          'El objetivo es que el subagente pueda completar la tarea sin volver al coordinador porque falta información básica. Cada ida y vuelta adicional aumenta latencia, consumo de tokens y riesgo de perder contexto.',
          'Autocontenido no significa copiar toda la conversación. Significa seleccionar exactamente la información necesaria para terminar la tarea.',
        ],
        bullets: [
          'Objetivo específico y criterios de éxito.',
          'Hallazgos previos para evitar repetir investigación.',
          'Datos estructurados: repositorio, rama, archivos, IDs, fechas o campos relevantes.',
          'Metadatos de fuente para preservar trazabilidad.',
          'Restricciones: qué puede leer, ejecutar o modificar.',
          'Formato de salida que el coordinador pueda sintetizar.',
        ],
      },
      {
        title: '3. Hallazgos previos y datos estructurados',
        paragraphs: [
          'Si el coordinador ya descubrió que un error solo ocurre en producción, comenzó después de un commit y no se reproduce localmente, esa información debe viajar con la delegación. De lo contrario, el subagente puede gastar la mayor parte de su tiempo redescubriendo lo mismo.',
          'Los datos estructurados reducen ambigüedad. Un bloque con repository, branch, relevantFiles y previousFindings suele ser más confiable que una descripción extensa y desordenada.',
        ],
        goodExample: 'Repository: payment-api\nBranch: feature/oauth\nRelevant files: AuthService.java, JwtValidator.java\nPrevious findings: fails only in production after commit 7ab2c.',
        badExample: 'Review the authentication problem. Ask me if you need anything.',
      },
      {
        title: '4. Metadatos de fuente',
        paragraphs: [
          'La fuente no es un detalle decorativo. Permite saber de dónde salió cada afirmación y conservar desacuerdos entre documentos, logs o entrevistas.',
          'Cuando dos fuentes entregan valores distintos, el subagente no debería mezclarlos. Debe asociar cada valor con su origen y comunicar la incertidumbre.',
        ],
        bullets: ['Nombre del archivo o documento.', 'Página, línea o sección.', 'Timestamp cuando corresponde.', 'Identificador de issue, build o commit.', 'Nivel de confianza o limitaciones.'],
      },
      {
        title: '5. Restricciones y herramientas',
        paragraphs: [
          'Un subagente debe recibir solo las herramientas necesarias para su rol. Este principio reduce decisiones irrelevantes y evita acciones fuera de alcance.',
          'Un agente de revisión puede necesitar Read, Grep y Glob, pero no Edit o Bash. Un agente de síntesis puede no necesitar ninguna herramienta de escritura.',
        ],
        goodExample: 'Read-only analysis. Use Read, Glob and Grep. Do not edit files or execute shell commands.',
        badExample: 'Use any available tool and make whatever changes are necessary.',
      },
      {
        title: '6. Formato de salida',
        paragraphs: [
          'El formato debe diseñarse según quién consumirá el resultado. Si otro agente combinará múltiples revisiones, una estructura consistente es más útil que prosa libre.',
          'Un buen formato puede exigir severidad, evidencia, archivo, línea, recomendación y confianza. Así el coordinador puede ordenar, deduplicar y sintetizar hallazgos.',
        ],
        bullets: ['Una entrada por hallazgo.', 'Campos obligatorios claramente definidos.', 'Separación entre hechos, inferencias y recomendaciones.', 'Referencias de fuente incluidas en cada hallazgo.'],
      },
      {
        title: '7. Cómo aparece en el examen',
        paragraphs: [
          'Las preguntas suelen presentar un subagente que vuelve a pedir información o repite trabajo. La causa más probable no suele ser temperatura, modelo o tamaño de contexto: suele ser que el prompt omitió contexto requerido.',
          'Otra trampa es preferir un prompt corto solo para ahorrar tokens. Un prompt algo más largo puede ser más eficiente si evita varias rondas adicionales.',
        ],
        bullets: ['MOST likely cause: contexto omitido.', 'BEST prompt: el más autocontenido y trazable.', 'LEAST suitable: el más vago o dependiente del coordinador.', 'PRIMARY purpose of source metadata: identificar el origen de cada dato.'],
      },
    ],
    checklist: [
      '¿El objetivo es específico?',
      '¿Incluye hallazgos ya conocidos?',
      '¿Los datos relevantes están estructurados?',
      '¿Cada afirmación importante conserva su fuente?',
      '¿Las herramientas y restricciones son explícitas?',
      '¿El formato de salida sirve al siguiente paso?',
      '¿El subagente puede terminar sin pedir contexto básico?',
    ],
    summary: [
      'Un prompt de subagente debe ser autocontenido, no simplemente largo.',
      'Hallazgos previos evitan trabajo repetido.',
      'Los metadatos de fuente preservan trazabilidad e incertidumbre.',
      'Las herramientas se restringen según el rol.',
      'El formato de salida se diseña para el consumidor posterior.',
    ],
  },
  delegation: {
    topicId: 'delegation',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Distinguir delegación orientada a objetivos de delegación procedural.',
      'Seleccionar el enfoque correcto según riesgo, repetibilidad e incertidumbre.',
      'Evitar la falsa regla de que goal-oriented siempre es mejor.',
      'Reconocer distractores del examen relacionados con flexibilidad y control.',
    ],
    sections: [
      {
        title: '1. Dos formas de delegar',
        paragraphs: [
          'La delegación procedural define cómo ejecutar la tarea paso a paso. La delegación orientada a objetivos define qué resultado alcanzar y permite que el agente adapte la estrategia.',
          'La diferencia no es de calidad sino de contexto. Cada estilo es adecuado para una clase diferente de problema.',
        ],
      },
      {
        title: '2. Delegación procedural',
        paragraphs: [
          'Es apropiada cuando el camino ya se conoce, debe repetirse de forma consistente o existen requisitos de cumplimiento. Reduce variabilidad y limita decisiones del agente.',
          'Su debilidad aparece cuando surgen hallazgos inesperados: una secuencia rígida puede impedir seguir evidencia relevante.',
        ],
        goodExample: 'Backup database → verify backup → request approval → execute migration → run validation.',
        badExample: 'Use a rigid 45-step diagnostic checklist for an unknown intermittent failure and never deviate.',
      },
      {
        title: '3. Delegación orientada a objetivos',
        paragraphs: [
          'Es apropiada para investigación, exploración y tareas donde el camino no se conoce de antemano. El agente recibe el objetivo, restricciones, criterios de éxito y checkpoints, pero puede decidir qué pasos tomar.',
          'Goal-oriented no significa ausencia de control. El coordinador puede exigir hitos, límites de herramientas, tiempo, costo y formato de salida.',
        ],
        goodExample: 'Determine the root cause of the intermittent authentication failures. Report evidence at each milestone and stop before modifying production.',
        badExample: 'Investigate anything you find interesting with no success criteria or boundaries.',
      },
      {
        title: '4. Regla práctica para elegir',
        bullets: [
          'Camino conocido, repetitivo o regulado → procedural.',
          'Camino desconocido, exploratorio o cambiante → goal-oriented.',
          'Alto riesgo con aprobación obligatoria → procedimiento o flujo por fases.',
          'Investigación abierta con nuevas evidencias → objetivo con checkpoints.',
        ],
      },
      {
        title: '5. Casos comparados',
        paragraphs: [
          'Investigar una degradación de rendimiento suele requerir goal-oriented porque la causa puede estar en base de datos, red, código o infraestructura.',
          'Desplegar a producción suele requerir procedural porque el orden de validación, aprobación y rollback debe ser predecible.',
          'Una auditoría mensual de cumplimiento suele ser procedural; una investigación de fraude emergente suele ser goal-oriented.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        paragraphs: [
          'El distractor más común afirma que goal-oriented es mejor porque usa menos tokens o es más rápido. La razón correcta es que permite adaptar la estrategia según nueva evidencia.',
          'Otro distractor presenta una tarea de alto riesgo y propone creatividad abierta. En esos casos, el control procedural o un flujo con aprobación suele ser superior.',
        ],
        bullets: ['MOST appropriate para investigación desconocida: objetivo + criterios + checkpoints.', 'MOST appropriate para cumplimiento repetible: procedimiento fijo.', 'BEST description: el modelo decide cómo alcanzar el objetivo respetando restricciones.', 'LEAST appropriate: creatividad abierta en una acción irreversible de producción.'],
      },
    ],
    checklist: [
      '¿El camino ya está definido?',
      '¿La tarea debe repetirse exactamente igual?',
      '¿Pueden aparecer hallazgos que cambien el plan?',
      '¿Existe riesgo irreversible o requisito de aprobación?',
      '¿Hay criterios de éxito y límites claros?',
      '¿Los checkpoints mantienen visibilidad del coordinador?',
    ],
    summary: [
      'Goal-oriented permite adaptación; procedural maximiza control y repetibilidad.',
      'La tarea determina el estilo, no una preferencia universal.',
      'Objetivos abiertos necesitan criterios de éxito y restricciones.',
      'Procesos de alto riesgo o cumplimiento suelen necesitar pasos explícitos.',
    ],
  },
}
