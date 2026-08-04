import type { LessonContent } from './lessons'

export const claudeCodeLessonsPart3: Record<string, LessonContent> = {
  synthesis: {
    topicId: 'synthesis',
    readingMinutes: 19,
    difficulty: 4,
    objectives: [
      'Combinar resultados de múltiples fuentes sin borrar desacuerdos.',
      'Separar hechos, inferencias y recomendaciones.',
      'Preservar trazabilidad y nivel de confianza por hallazgo.',
      'Reconocer cuándo una síntesis introduce certeza falsa.',
    ],
    sections: [
      {
        title: '1. Sintetizar no es promediar ni elegir una fuente',
        paragraphs: [
          'Una síntesis útil organiza resultados de varias fuentes para producir una conclusión coherente, pero no debe ocultar contradicciones. Si dos revisores reportan cifras diferentes, el resultado debe conservar ambas, explicar el contexto y señalar qué evidencia falta para resolver el conflicto.',
          'Elegir arbitrariamente una fuente o promediar valores incompatibles crea una apariencia de precisión que los datos no sostienen.',
        ],
      },
      {
        title: '2. Mantener la procedencia de cada afirmación',
        paragraphs: [
          'Cada hallazgo importante debe conservar su origen: archivo, línea, documento, agente, timestamp o identificador. La procedencia permite validar una afirmación, detectar información obsoleta y entender por qué dos fuentes difieren.',
          'La síntesis puede agrupar hallazgos equivalentes, pero no debe separar la conclusión de la evidencia que la respalda.',
        ],
        diagram: ['Fuente A ─ hallazgo + referencia ─┐', 'Fuente B ─ hallazgo + referencia ─┼─ Síntesis', 'Fuente C ─ desacuerdo + referencia ─┘', '↓', 'Conclusión + incertidumbre + próximos pasos'],
      },
      {
        title: '3. Hechos, inferencias y recomendaciones',
        paragraphs: [
          'Un hecho está directamente respaldado por evidencia observada. Una inferencia conecta hechos mediante razonamiento. Una recomendación propone una acción. Mezclar estas categorías hace difícil evaluar la solidez del resultado.',
          'Una buena síntesis etiqueta o redacta claramente estas diferencias. También evita presentar una inferencia plausible como si fuera un dato confirmado.',
        ],
        goodExample: 'Fact: error rate rose after commit 7ab2c. Inference: the change may affect token validation. Recommendation: compare the validator behavior before and after that commit.',
        badExample: 'Commit 7ab2c definitely caused the incident, so revert it immediately.',
      },
      {
        title: '4. Confianza e incertidumbre',
        paragraphs: [
          'El nivel de confianza debe reflejar la calidad y consistencia de la evidencia. Varias fuentes independientes que coinciden pueden aumentar confianza; una única fuente incompleta o un conflicto no resuelto deben reducirla.',
          'Expresar incertidumbre no debilita la respuesta. Permite al consumidor tomar decisiones proporcionales al riesgo y solicitar la evidencia que falta.',
        ],
        bullets: [
          'Alta confianza: evidencia directa y consistente.',
          'Confianza media: evidencia parcial con inferencia razonable.',
          'Baja confianza: datos escasos, contradictorios o indirectos.',
          'Unknown: no existe evidencia suficiente para una conclusión.',
        ],
      },
      {
        title: '5. Deduplicación sin pérdida de información',
        paragraphs: [
          'Cuando varios agentes reportan el mismo problema, la síntesis debe fusionar duplicados, conservar las mejores referencias y registrar si existe consenso.',
          'Dos hallazgos parecidos no siempre son idénticos. Antes de fusionarlos, verifica que compartan causa, ubicación e impacto.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'BEST synthesis: combina, deduplica, conserva fuentes y representa desacuerdos.',
          'LEAST appropriate behavior: escoger una fuente arbitrariamente y ocultar las demás.',
          'PRIMARY purpose of confidence: comunicar la solidez de la evidencia.',
          'MOST important distinction: hechos observados versus inferencias y recomendaciones.',
        ],
      },
    ],
    checklist: [
      '¿Cada conclusión importante conserva una referencia?',
      '¿Los desacuerdos permanecen visibles?',
      '¿Separé hechos, inferencias y recomendaciones?',
      '¿El nivel de confianza corresponde a la evidencia?',
      '¿Deduplicar no eliminó matices relevantes?',
      '¿La síntesis indica qué información falta?',
    ],
    summary: [
      'Una síntesis confiable preserva procedencia, desacuerdos e incertidumbre.',
      'No se deben promediar ni mezclar afirmaciones incompatibles sin explicación.',
      'Los hechos deben distinguirse de inferencias y recomendaciones.',
      'La confianza refleja evidencia, no estilo de redacción.',
      'La deduplicación debe conservar referencias y matices relevantes.',
    ],
  },

  'long-context': {
    topicId: 'long-context',
    readingMinutes: 20,
    difficulty: 4,
    objectives: [
      'Gestionar sesiones extensas sin mantener cada detalle en el contexto activo.',
      'Usar aislamiento, archivos de estado y resúmenes para conservar continuidad.',
      'Distinguir información operativa de historial irrelevante.',
      'Reconocer señales de degradación por saturación de contexto.',
    ],
    sections: [
      {
        title: '1. El problema de las sesiones largas',
        paragraphs: [
          'Una sesión extensa acumula mensajes, resultados de herramientas, archivos y decisiones. Aunque el contexto sea grande, mantener todo activo aumenta costo, ruido y riesgo de que instrucciones antiguas compitan con el objetivo actual.',
          'La solución no es conservar cada token indefinidamente. El sistema debe transformar el historial en estado operativo compacto y recuperar detalles solo cuando vuelvan a ser necesarios.',
        ],
      },
      {
        title: '2. Estado externo y scratchpads',
        paragraphs: [
          'Los hallazgos, decisiones, pendientes y referencias pueden persistirse en archivos estructurados o scratchpads. Esto permite que el agente consulte el estado actual sin depender de toda la conversación.',
          'Un scratchpad útil no es una copia de cada mensaje. Debe ser una representación mantenida y actualizada del trabajo.',
        ],
        bullets: [
          'Objetivo actual y criterios de éxito.',
          'Hallazgos confirmados con fuentes.',
          'Hipótesis abiertas y evidencia pendiente.',
          'Decisiones tomadas y razones.',
          'Tareas completadas, bloqueadas y siguientes pasos.',
        ],
      },
      {
        title: '3. Aislamiento mediante subagentes o contextos separados',
        paragraphs: [
          'Una investigación especializada puede ejecutarse en un contexto aislado y devolver solo un resultado compacto. Esto evita que miles de detalles intermedios contaminen la sesión principal.',
          'El contexto principal debe recibir la información necesaria para decidir, no todo el proceso interno del agente especializado.',
        ],
        diagram: ['Sesión principal', '├─ contexto aislado A → resumen + evidencia', '├─ contexto aislado B → resumen + evidencia', '└─ contexto aislado C → resumen + evidencia', '↓', 'Decisión integrada'],
      },
      {
        title: '4. Lectura selectiva y recuperación bajo demanda',
        paragraphs: [
          'Cuando una decisión requiere un detalle antiguo, el agente puede volver a leer el archivo, log o scratchpad correspondiente. Recuperar bajo demanda es más eficiente que mantener cada artefacto siempre activo.',
          'Las referencias estables —rutas, IDs, hashes, líneas o timestamps— permiten recuperar el dato correcto cuando se necesita.',
        ],
      },
      {
        title: '5. Señales de contexto degradado',
        bullets: [
          'El agente repite preguntas ya resueltas.',
          'Olvida restricciones recientes o aplica reglas obsoletas.',
          'Confunde archivos, versiones o decisiones.',
          'Produce resúmenes contradictorios.',
          'Dedica demasiada salida a detalles históricos irrelevantes.',
        ],
      },
      {
        title: '6. Resumir sin perder control',
        paragraphs: [
          'Un resumen debe conservar decisiones, evidencia, incertidumbre y pendientes. Un resumen demasiado agresivo puede borrar precisamente la información necesaria para continuar.',
          'La mejor estrategia combina resúmenes jerárquicos, estado estructurado y enlaces a artefactos originales.',
        ],
        goodExample: 'Persist a compact task state with findings and source references, then reload only the files needed for the next decision.',
        badExample: 'Keep every tool result and full file content in the active conversation forever.',
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST long-session strategy: estado persistido, aislamiento y recuperación selectiva.',
          'LEAST efficient behavior: conservar todo el historial activo indefinidamente.',
          'PRIMARY role of scratchpads: mantener estado operativo, no duplicar la conversación.',
          'BEST response to context degradation: resumir, persistir decisiones y recargar solo lo necesario.',
        ],
      },
    ],
    checklist: [
      '¿El contexto activo contiene solo información necesaria?',
      '¿Las decisiones y pendientes están persistidos?',
      '¿Los artefactos importantes tienen referencias recuperables?',
      '¿Las tareas especializadas pueden aislarse?',
      '¿El resumen conserva incertidumbre y evidencia?',
      '¿Puedo detectar y corregir señales de contexto degradado?',
    ],
    summary: [
      'Las sesiones largas requieren estado externo y lectura selectiva.',
      'El aislamiento evita contaminar la conversación principal.',
      'Los scratchpads representan el estado actual, no todo el historial.',
      'Las referencias permiten recuperar detalles bajo demanda.',
      'Resumir debe conservar decisiones, evidencia, incertidumbre y pendientes.',
    ],
  },

  'context-optimization': {
    topicId: 'context-optimization',
    readingMinutes: 20,
    difficulty: 4,
    objectives: [
      'Aplicar resúmenes, ventanas deslizantes y estado estructurado.',
      'Priorizar información según relevancia, vigencia y costo de recuperación.',
      'Evitar duplicación y repetición innecesaria de instrucciones.',
      'Distinguir compactación segura de pérdida destructiva de contexto.',
    ],
    sections: [
      {
        title: '1. Optimizar no significa reducir contexto a cualquier costo',
        paragraphs: [
          'La optimización busca mantener la información que afecta decisiones futuras y retirar detalles que pueden recuperarse o ya no son relevantes. El objetivo es maximizar utilidad por token.',
          'Eliminar contexto sin criterio puede producir errores más costosos que el ahorro obtenido.',
        ],
      },
      {
        title: '2. Estado estructurado',
        paragraphs: [
          'Un objeto de estado compacto puede representar objetivo, restricciones, resultados, pendientes y fuentes. Al actualizarlo después de cada fase, el sistema evita reconstruir el progreso desde una conversación extensa.',
          'La estructura también facilita validación: campos requeridos, versiones y estados conocidos pueden comprobarse de forma determinista.',
        ],
        goodExample: '{ objective, constraints, completedTasks, pendingTasks, findings, sourceRefs, openQuestions }',
      },
      {
        title: '3. Ventanas deslizantes y resúmenes jerárquicos',
        paragraphs: [
          'Una ventana deslizante mantiene interacciones recientes en detalle y reemplaza historia antigua por resúmenes. Los resúmenes jerárquicos pueden existir por tarea, fase y sesión completa.',
          'Las decisiones recientes o activas deben permanecer accesibles; los detalles cerrados pueden reducirse a una conclusión con referencias.',
        ],
        diagram: ['Mensajes recientes: detalle completo', '↓', 'Resumen de fase actual', '↓', 'Resumen histórico + referencias externas'],
      },
      {
        title: '4. Relevancia, vigencia y recuperabilidad',
        bullets: [
          'Relevancia: ¿afecta la decisión actual o futura?',
          'Vigencia: ¿sigue siendo válida para la versión actual?',
          'Recuperabilidad: ¿puede volver a cargarse desde una fuente estable?',
          'Costo: ¿es más barato conservarla o recuperarla después?',
          'Riesgo: ¿perderla podría causar una acción incorrecta o irreversible?',
        ],
      },
      {
        title: '5. Evitar duplicación',
        paragraphs: [
          'Repetir instrucciones, archivos o resultados en cada turno consume contexto sin aportar señal nueva. Las reglas persistentes deben residir en la configuración apropiada y las fuentes grandes deben referenciarse en lugar de copiarse una y otra vez.',
          'También conviene normalizar hallazgos equivalentes para evitar que la repetición aparente mayor evidencia de la que realmente existe.',
        ],
      },
      {
        title: '6. Compactación segura',
        paragraphs: [
          'Antes de compactar, identifica qué debe sobrevivir: criterios de éxito, decisiones, restricciones, evidencia, fuentes, errores y tareas pendientes. Luego verifica que el resumen resultante permita continuar sin reinterpretar el trabajo.',
          'Los detalles descartados deben seguir disponibles mediante referencias cuando el riesgo o la auditoría lo requieran.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST context optimization: resumen + estado estructurado + recuperación selectiva.',
          'LEAST appropriate strategy: repetir la conversación completa en cada turno.',
          'PRIMARY purpose of a sliding window: mantener detalle reciente y compactar historia antigua.',
          'MOST important data to retain: decisiones, restricciones, pendientes y referencias de evidencia.',
        ],
      },
    ],
    checklist: [
      '¿El estado estructurado representa el progreso actual?',
      '¿La información retenida es relevante y vigente?',
      '¿Los detalles descartados pueden recuperarse?',
      '¿Evité repetir reglas o artefactos sin necesidad?',
      '¿La ventana conserva suficiente detalle reciente?',
      '¿La compactación mantiene decisiones, restricciones y evidencia?',
    ],
    summary: [
      'Optimizar contexto significa conservar la información con valor futuro.',
      'El estado estructurado reduce dependencia del historial conversacional.',
      'Las ventanas deslizantes combinan detalle reciente con resúmenes antiguos.',
      'Relevancia, vigencia, recuperabilidad y riesgo guían la retención.',
      'La compactación segura conserva decisiones, restricciones, evidencia y pendientes.',
    ],
  },
}
