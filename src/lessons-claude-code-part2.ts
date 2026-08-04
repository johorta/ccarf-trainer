import type { LessonContent } from './lessons'

export const claudeCodeLessonsPart2: Record<string, LessonContent> = {
  iterative: {
    topicId: 'iterative',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Aplicar ciclos de mejora con feedback específico y medible.',
      'Distinguir refinamiento útil de instrucciones vagas como “do better”.',
      'Reducir cambios simultáneos para aislar la causa de un error.',
      'Reconocer cuándo entregar ejemplos positivos y negativos.',
    ],
    sections: [
      {
        title: '1. Qué significa refinar de forma iterativa',
        paragraphs: [
          'El refinamiento iterativo consiste en ejecutar una tarea, observar el resultado, identificar una diferencia concreta respecto del objetivo y ajustar la siguiente instrucción usando esa evidencia.',
          'No se trata de repetir el mismo prompt esperando un resultado distinto. Cada iteración debe incorporar nueva información: un error omitido, una salida esperada, una regla incumplida o un ejemplo representativo.',
        ],
        diagram: ['Objetivo', '↓', 'Primera ejecución', '↓', 'Comparar con criterio de éxito', '↓', 'Feedback específico', '↓', 'Nueva ejecución'],
      },
      {
        title: '2. Feedback específico',
        paragraphs: [
          'Un mensaje como “improve the answer” no indica qué parte está mal ni cómo medir la mejora. El modelo debe inferir demasiado y puede cambiar aspectos que ya estaban correctos.',
          'El feedback útil identifica el defecto, muestra evidencia y describe el comportamiento esperado.',
        ],
        goodExample: 'You missed three authorization checks in PaymentController. Detect calls lacking verifyMerchantOwnership and return file, line, and risk.',
        badExample: 'Do a better review and find more issues.',
      },
      {
        title: '3. Cambiar una variable por vez',
        paragraphs: [
          'Si en una sola iteración cambias el objetivo, el formato, las herramientas y los ejemplos, será difícil saber qué ajuste produjo la mejora o el empeoramiento.',
          'Conviene agrupar problemas relacionados y modificar primero el factor con mayor probabilidad de explicar el fallo. Después se evalúa nuevamente.',
        ],
      },
      {
        title: '4. Ejemplos positivos y negativos',
        paragraphs: [
          'Los ejemplos positivos muestran el nivel de detalle y estructura esperados. Los ejemplos negativos enseñan qué debe excluirse y por qué.',
          'Son especialmente útiles cuando una categoría es ambigua, cuando existen muchos falsos positivos o cuando el proyecto usa convenciones no evidentes.',
        ],
        bullets: [
          'Ejemplo correcto con explicación del criterio.',
          'Ejemplo incorrecto cercano, no absurdo.',
          'Diferencia concreta entre ambos.',
          'Cobertura de casos límite relevantes.',
        ],
      },
      {
        title: '5. Refinamiento basado en errores del sistema',
        paragraphs: [
          'Los errores de compilación, validación de schema o ejecución de tests son feedback de alta calidad porque describen una incompatibilidad verificable.',
          'La siguiente iteración debe incluir el mensaje exacto y el contexto mínimo necesario para corregirlo, evitando reenviar información no relacionada.',
        ],
      },
      {
        title: '6. Cuándo detenerse',
        paragraphs: [
          'Un ciclo de refinamiento necesita criterios de término. Sin ellos, el agente puede continuar ajustando una salida que ya cumple el objetivo.',
          'La ejecución debe detenerse cuando se satisfacen los criterios, se alcanza un límite o la mejora adicional requiere nueva información externa.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST feedback: errores concretos, ejemplos omitidos y salida esperada.',
          'LEAST useful feedback: “do better” sin evidencia.',
          'MOST controlled refinement: cambiar un factor principal y volver a evaluar.',
          'BEST stopping condition: criterios de éxito verificables y límites explícitos.',
        ],
      },
    ],
    checklist: [
      '¿Identifiqué exactamente qué salió mal?',
      '¿Incluí evidencia o ejemplos concretos?',
      '¿Definí cómo luce el resultado esperado?',
      '¿Evité cambiar demasiadas variables al mismo tiempo?',
      '¿Usé errores de tests o schemas cuando estaban disponibles?',
      '¿Existe una condición clara para detener el ciclo?',
    ],
    summary: [
      'Cada iteración debe incorporar evidencia nueva.',
      'Feedback específico supera a instrucciones vagas.',
      'Cambiar menos variables facilita diagnosticar causas.',
      'Ejemplos positivos y negativos calibran criterios ambiguos.',
      'Los criterios de término evitan refinamiento infinito.',
    ],
  },

  configuration: {
    topicId: 'configuration',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Distinguir CLAUDE.md, .claude/rules, Skills, hooks y settings.',
      'Elegir el mecanismo según persistencia, alcance y activación.',
      'Evitar concentrar todas las instrucciones en un único archivo global.',
      'Relacionar configuración con permisos y comportamiento repetible.',
    ],
    sections: [
      {
        title: '1. La configuración tiene varios niveles',
        paragraphs: [
          'Claude Code ofrece distintos mecanismos porque no todas las instrucciones tienen el mismo alcance ni el mismo momento de activación.',
          'Una regla estable del repositorio, una capacidad reutilizable, una automatización ante eventos y un permiso de herramienta son problemas diferentes. Elegir el mecanismo correcto reduce ruido y contradicciones.',
        ],
      },
      {
        title: '2. CLAUDE.md',
        paragraphs: [
          'CLAUDE.md contiene orientación persistente para trabajar en un proyecto o directorio: arquitectura, comandos, convenciones y restricciones generales.',
          'Debe incluir información estable y útil en muchas tareas. Si se llena con instrucciones temporales o extremadamente específicas, pierde claridad y consume contexto innecesariamente.',
        ],
        goodExample: 'Document build commands, module boundaries, naming conventions, and mandatory validation steps.',
        badExample: 'Store every one-time debugging instruction and every temporary ticket detail in the root CLAUDE.md.',
      },
      {
        title: '3. .claude/rules y alcance por rutas',
        paragraphs: [
          'Las reglas por rutas permiten aplicar instrucciones solo cuando se trabaja con archivos que coinciden con un patrón. Esto evita cargar reglas de Java al editar documentación o reglas de infraestructura al revisar frontend.',
          'El glob debe ser suficientemente específico para cubrir los archivos correctos sin activar la regla en todo el repositorio.',
        ],
        goodExample: 'Apply payment-domain Java conventions only to src/payments/**/*.java.',
      },
      {
        title: '4. Skills',
        paragraphs: [
          'Una Skill encapsula una capacidad reutilizable: un procedimiento, un conjunto de instrucciones y, cuando corresponde, recursos asociados.',
          'Es adecuada cuando la misma actividad debe ejecutarse muchas veces bajo demanda, por ejemplo revisar migraciones, generar un tipo de informe o preparar una release.',
        ],
      },
      {
        title: '5. Hooks',
        paragraphs: [
          'Los hooks automatizan acciones ante eventos concretos. Pueden validar, registrar, bloquear o ejecutar pasos complementarios alrededor de una operación.',
          'No sustituyen una Skill. Una Skill se invoca como capacidad; un hook responde automáticamente a un evento definido.',
        ],
      },
      {
        title: '6. Settings y permisos',
        paragraphs: [
          'Settings controla comportamiento de la herramienta y permisos, como qué acciones se permiten o requieren aprobación.',
          'Las políticas de seguridad no deben depender únicamente de una instrucción en lenguaje natural. Cuando existe un mecanismo de permisos, debe utilizarse para imponer el límite técnicamente.',
        ],
      },
      {
        title: '7. Regla práctica de selección',
        bullets: [
          'Orientación persistente del proyecto → CLAUDE.md.',
          'Regla aplicable a archivos específicos → .claude/rules con glob.',
          'Capacidad reutilizable bajo demanda → Skill.',
          'Automatización activada por evento → hook.',
          'Permisos y opciones de ejecución → settings.',
        ],
      },
      {
        title: '8. Cómo aparece en el examen',
        bullets: [
          'BEST place for a persistent project convention: CLAUDE.md.',
          'BEST place for path-specific standards: .claude/rules.',
          'BEST mechanism for reusable workflows: Skills.',
          'BEST mechanism for event-triggered automation: hooks.',
          'LEAST maintainable approach: todas las reglas en un único archivo global.',
        ],
      },
    ],
    checklist: [
      '¿La instrucción es persistente o temporal?',
      '¿Debe aplicarse a todo el proyecto o solo a ciertas rutas?',
      '¿Es una capacidad reutilizable o una automatización por evento?',
      '¿El requisito corresponde a un permiso técnico?',
      '¿El mecanismo elegido minimiza contexto irrelevante?',
      '¿Las reglas pueden mantenerse sin duplicación?',
    ],
    summary: [
      'CLAUDE.md contiene guía persistente del proyecto.',
      '.claude/rules limita reglas por rutas o patrones.',
      'Skills encapsula capacidades reutilizables.',
      'Hooks automatiza respuestas a eventos.',
      'Settings impone permisos y opciones de ejecución.',
    ],
  },

  'context-fork': {
    topicId: 'context-fork',
    readingMinutes: 17,
    difficulty: 4,
    objectives: [
      'Explicar por qué aislar una tarea protege el contexto principal.',
      'Identificar qué información entra y qué resultado debe regresar.',
      'Distinguir aislamiento de pérdida total de trazabilidad.',
      'Reconocer cuándo context: fork no es apropiado.',
    ],
    sections: [
      {
        title: '1. Qué problema resuelve el contexto aislado',
        paragraphs: [
          'Algunas tareas consumen mucho contexto intermedio: exploraciones extensas, auditorías, análisis de logs o generación de alternativas. Ejecutarlas dentro de la sesión principal puede desplazar decisiones importantes y añadir ruido.',
          'context: fork permite realizar ese trabajo en un contexto separado y devolver únicamente el resultado necesario.',
        ],
        diagram: ['Sesión principal', '├─ objetivo y contexto mínimo → contexto aislado', '│                              ↓', '│                         trabajo extenso', '│                              ↓', '└──────── resultado resumido + evidencia'],
      },
      {
        title: '2. Qué debe recibir el contexto aislado',
        paragraphs: [
          'El fork no debe depender de información implícita que solo existe en la sesión principal. Debe recibir un objetivo autocontenido, artefactos relevantes, restricciones y formato de salida.',
          'Copiar toda la sesión principal contradice parte del beneficio. La selección debe ser suficiente, pero acotada.',
        ],
      },
      {
        title: '3. Qué debe regresar',
        bullets: [
          'Conclusiones principales.',
          'Evidencia y referencias necesarias.',
          'Incertidumbre o limitaciones.',
          'Artefactos generados o sus ubicaciones.',
          'Recomendación para el siguiente paso.',
        ],
      },
      {
        title: '4. Beneficios',
        paragraphs: [
          'El aislamiento reduce contaminación del contexto principal, permite especializar instrucciones y limita la cantidad de detalle que vuelve a la conversación central.',
          'También facilita ejecutar varias investigaciones separadas y sintetizar sus resultados sin mezclar todos los pasos intermedios.',
        ],
      },
      {
        title: '5. Cuándo no conviene',
        paragraphs: [
          'No conviene aislar una tarea cuando cada detalle intermedio debe influir inmediatamente en la conversación principal o cuando la tarea es tan pequeña que el costo de preparar y sintetizar supera el beneficio.',
          'Tampoco debe utilizarse para ocultar decisiones o perder fuentes. El resultado debe preservar trazabilidad suficiente.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'PRIMARY benefit: evitar contaminar el contexto principal con trabajo intermedio extenso.',
          'BEST input: objetivo autocontenido y contexto mínimo suficiente.',
          'BEST output: síntesis, evidencia, limitaciones y referencias.',
          'LEAST appropriate use: tarea trivial o trabajo que requiere compartir cada paso en tiempo real.',
        ],
      },
    ],
    checklist: [
      '¿La tarea generará mucho contexto intermedio?',
      '¿Puede ejecutarse con un objetivo autocontenido?',
      '¿Definí qué evidencia debe regresar?',
      '¿La sesión principal necesita solo el resultado y no cada paso?',
      '¿El costo de aislar está justificado por la complejidad?',
      '¿Se preserva la trazabilidad de las conclusiones?',
    ],
    summary: [
      'context: fork aísla trabajo especializado o extenso.',
      'El fork necesita contexto explícito y suficiente.',
      'Solo debe regresar información útil para el siguiente paso.',
      'Aislamiento no significa perder fuentes ni incertidumbre.',
      'No es necesario para tareas triviales o altamente interactivas.',
    ],
  },

  'output-schema': {
    topicId: 'output-schema',
    readingMinutes: 19,
    difficulty: 5,
    objectives: [
      'Diseñar salidas según el consumidor posterior.',
      'Distinguir prosa humana, estructura automática y formatos híbridos.',
      'Preservar fuentes, severidad, incertidumbre y campos obligatorios.',
      'Evitar schemas excesivamente rígidos o demasiado vagos.',
    ],
    sections: [
      {
        title: '1. El consumidor define el formato',
        paragraphs: [
          'La mejor salida no se elige por preferencia estética. Se diseña según quién o qué la utilizará después.',
          'Una persona puede beneficiarse de un resumen narrativo. Un coordinador o pipeline necesita campos consistentes para ordenar, validar y combinar resultados.',
        ],
      },
      {
        title: '2. Salida estructurada',
        paragraphs: [
          'La estructura es apropiada cuando los resultados deben filtrarse, compararse, almacenarse o procesarse automáticamente.',
          'Los campos deben tener significado claro y tipos coherentes. Incluir un campo sin definir su semántica crea una estructura aparente pero no confiable.',
        ],
        goodExample: 'Return findings with id, severity, category, file, line, evidence, recommendation, source, and confidence.',
        badExample: 'Return a JSON object containing anything you consider useful.',
      },
      {
        title: '3. Prosa y formato híbrido',
        paragraphs: [
          'La prosa sigue siendo útil para explicar contexto, decisiones y relaciones difíciles de expresar en campos aislados.',
          'Un formato híbrido puede incluir findings estructurados y un resumen narrativo. Esto permite automatización y comprensión humana sin duplicar información innecesariamente.',
        ],
      },
      {
        title: '4. Trazabilidad y metadatos',
        paragraphs: [
          'Cuando varios subagentes producen resultados, cada hallazgo debe conservar su origen. Sin fuente, un coordinador no puede verificar, resolver contradicciones ni medir confianza.',
          'Los metadatos pueden incluir archivo, línea, documento, timestamp, agente productor y nivel de confianza.',
        ],
      },
      {
        title: '5. Campos obligatorios, opcionales y nulos',
        paragraphs: [
          'Un schema debe representar la realidad. Si una línea no existe para cierto tipo de fuente, line puede ser opcional o nullable en vez de inventar un valor.',
          'Los campos obligatorios deben limitarse a información necesaria para consumir el resultado. Hacer obligatorio todo aumenta fallos o incentiva datos inventados.',
        ],
      },
      {
        title: '6. Compatibilidad entre agentes',
        paragraphs: [
          'Si varios especialistas alimentan una síntesis, conviene compartir una base común de campos, permitiendo extensiones específicas por dominio.',
          'La consistencia facilita deduplicar hallazgos y comparar severidad. La especialización evita forzar todos los resultados dentro de una estructura que no representa su información.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST schema: diseñado para el consumidor downstream.',
          'PRIMARY purpose of metadata: trazabilidad y verificación.',
          'BEST hybrid output: estructura para automatización más resumen para humanos.',
          'LEAST useful schema: campos vagos sin semántica o estructura elegida por estética.',
        ],
      },
    ],
    checklist: [
      '¿Identifiqué al consumidor posterior?',
      '¿Cada campo tiene semántica y tipo claros?',
      '¿Los campos obligatorios son realmente necesarios?',
      '¿Represento ausencia sin inventar valores?',
      '¿Cada hallazgo conserva fuente y confianza?',
      '¿El formato permite combinar resultados de varios agentes?',
      '¿Hace falta un resumen narrativo además de la estructura?',
    ],
    summary: [
      'El consumidor posterior determina el formato.',
      'Estructura sirve para automatización; prosa, para explicación.',
      'Los formatos híbridos pueden cubrir ambos usos.',
      'Fuentes y confianza preservan trazabilidad.',
      'Un schema debe representar ausencia y variación reales.',
    ],
  },
}
