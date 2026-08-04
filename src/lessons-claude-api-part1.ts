import type { LessonContent } from './lessons'

export const claudeApiLessonsPart1: Record<string, LessonContent> = {
  'human-review': {
    topicId: 'human-review',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Diseñar reglas de revisión humana basadas en riesgo, confianza y ambigüedad.',
      'Distinguir revisión selectiva de muestreo aleatorio.',
      'Definir qué información debe recibir la persona revisora.',
      'Reconocer decisiones que nunca deberían automatizarse sin una aprobación explícita.',
    ],
    sections: [
      {
        title: '1. Por qué existe human-in-the-loop',
        paragraphs: [
          'La revisión humana no debe agregarse como una fase decorativa. Su propósito es intervenir cuando el costo de un error supera el beneficio de automatizar completamente o cuando la evidencia disponible no permite una decisión confiable.',
          'Un buen sistema automatiza los casos claros y dirige a personas los casos donde el juicio, la responsabilidad o el contexto externo son necesarios.',
        ],
        diagram: ['Entrada', '↓', 'Modelo + validaciones', '├─ bajo riesgo y alta confianza → continuar', '├─ ambigüedad → revisión humana', '└─ alto riesgo → aprobación obligatoria'],
      },
      {
        title: '2. Señales para enrutar a revisión',
        bullets: [
          'Confianza baja o evidencia contradictoria.',
          'Documento, usuario o patrón fuera de distribución.',
          'Campos críticos ausentes o ambiguos.',
          'Acción irreversible o con impacto financiero, legal o de seguridad.',
          'Incumplimiento de una validación determinista.',
          'Desacuerdo entre múltiples revisores o modelos.',
          'Solicitud explícita de aprobación por política.',
        ],
      },
      {
        title: '3. Riesgo y confianza no son lo mismo',
        paragraphs: [
          'La confianza describe cuánto respaldo existe para una predicción. El riesgo describe la consecuencia de equivocarse. Una clasificación de baja confianza y bajo impacto puede simplemente marcarse como desconocida; una decisión de alta confianza pero enorme impacto puede requerir aprobación igualmente.',
          'Por eso una regla robusta combina probabilidad de error, severidad del daño y capacidad de revertir la acción.',
        ],
        goodExample: 'Auto-approve low-risk document tags only when confidence is high; route payment rejection and identity mismatches to a reviewer regardless of confidence threshold.',
        badExample: 'Automatically execute every prediction above 70% confidence, even when it closes an account or sends money.',
      },
      {
        title: '4. Revisión por documento y por campo',
        paragraphs: [
          'No siempre es necesario reenviar un caso completo. Si solo un campo es ambiguo, el sistema puede pedir revisión de ese campo y conservar el resto de la extracción validada.',
          'Este enfoque reduce carga humana y evita que la persona repita trabajo que el sistema ya resolvió con suficiente certeza.',
        ],
      },
      {
        title: '5. Qué debe mostrar la interfaz de revisión',
        bullets: [
          'Entrada original o fragmento relevante.',
          'Predicción propuesta y alternativas posibles.',
          'Evidencia o ubicación que sustentó la decisión.',
          'Motivo del enrutamiento: baja confianza, política, conflicto o riesgo.',
          'Acciones permitidas y consecuencias de cada una.',
          'Registro de quién aprobó, rechazó o corrigió.',
        ],
      },
      {
        title: '6. Por qué el muestreo aleatorio no basta',
        paragraphs: [
          'El muestreo aleatorio sirve para medir calidad global y descubrir errores inesperados, pero no concentra el esfuerzo en los casos más peligrosos. Debe complementar, no reemplazar, el enrutamiento por riesgo y ambigüedad.',
          'Un sistema maduro puede combinar revisión obligatoria, revisión basada en señales y una pequeña muestra aleatoria para monitoreo continuo.',
        ],
      },
      {
        title: '7. Feedback y mejora del sistema',
        paragraphs: [
          'Las correcciones humanas deben registrarse con su contexto para evaluar errores recurrentes, ajustar reglas y construir conjuntos de evaluación. No conviene usar cada corrección como entrenamiento automático sin validación, porque el revisor también puede equivocarse o aplicar criterios inconsistentes.',
        ],
      },
      {
        title: '8. Cómo aparece en el examen',
        bullets: [
          'BEST routing strategy: casos ambiguos, inusuales, de baja confianza o alto riesgo.',
          'LEAST effective strategy: muestreo aleatorio como única regla.',
          'MUST require approval: acciones sensibles o irreversibles definidas por política.',
          'BEST reviewer context: predicción, evidencia, razón del escalamiento y acciones claras.',
          'BEST efficiency improvement: revisar solo campos ambiguos cuando el resto está validado.',
        ],
      },
    ],
    checklist: [
      '¿La regla considera tanto confianza como impacto?',
      '¿Las acciones irreversibles tienen una aprobación explícita?',
      '¿Los casos fuera de distribución se detectan y enrutan?',
      '¿La persona recibe evidencia suficiente para decidir?',
      '¿Es posible revisar solo el campo problemático?',
      '¿El muestreo aleatorio complementa las reglas dirigidas?',
      '¿Las correcciones quedan registradas para evaluación?',
    ],
    summary: [
      'Human review debe concentrarse donde el error es probable o costoso.',
      'Riesgo y confianza son dimensiones diferentes.',
      'Las políticas pueden exigir aprobación incluso con alta confianza.',
      'La revisión a nivel de campo reduce trabajo innecesario.',
      'Las decisiones humanas deben conservar evidencia y trazabilidad.',
    ],
  },

  batches: {
    topicId: 'batches',
    readingMinutes: 21,
    difficulty: 5,
    objectives: [
      'Elegir entre Messages API y Message Batches según latencia y volumen.',
      'Diseñar solicitudes batch identificables y recuperables.',
      'Manejar resultados parciales y errores por solicitud.',
      'Evitar usar procesamiento batch en experiencias interactivas.',
    ],
    sections: [
      {
        title: '1. Dos necesidades distintas',
        paragraphs: [
          'La Messages API es apropiada cuando una aplicación necesita una respuesta dentro del flujo actual: chat, validación interactiva, asistencia en tiempo real o una llamada que alimenta inmediatamente el siguiente paso.',
          'Message Batches está diseñado para procesar muchas solicitudes de forma asíncrona cuando el usuario o el sistema no necesita cada respuesta de inmediato.',
        ],
        diagram: ['Interacción inmediata', '↓', 'Messages API', '↓', 'respuesta en la misma operación', '', 'Gran volumen diferido', '↓', 'Message Batch', '↓', 'consultar estado y recuperar resultados'],
      },
      {
        title: '2. Regla de selección',
        bullets: [
          'Respuesta inmediata o flujo interactivo → Messages API.',
          'Miles de documentos procesados durante horas o durante la noche → Message Batches.',
          'Una solicitud depende del resultado de la anterior → flujo secuencial con Messages API o múltiples etapas batch.',
          'Trabajo independiente, tolerante a espera y de alto volumen → batch.',
        ],
      },
      {
        title: '3. Identificadores por solicitud',
        paragraphs: [
          'Cada elemento de un lote debe tener un identificador estable definido por la aplicación. Ese identificador permite relacionar el resultado con el documento, cliente o tarea original, aunque las respuestas no se devuelvan en el mismo orden.',
          'El identificador también facilita reintentos selectivos y evita depender de la posición dentro del archivo o arreglo.',
        ],
        goodExample: 'custom_id: invoice-2026-00421 maps the model result back to the exact invoice record.',
        badExample: 'Assume the fifth returned result always belongs to the fifth submitted document.',
      },
      {
        title: '4. Ciclo de vida asíncrono',
        paragraphs: [
          'La aplicación crea el lote, conserva su identificador, consulta el estado y recupera los resultados cuando están disponibles. No debe mantener una solicitud HTTP abierta esperando que todo el lote termine.',
          'La interfaz o scheduler puede mostrar estados como enviado, procesando, completado, cancelado o expirado según lo que ofrezca el servicio y la aplicación.',
        ],
      },
      {
        title: '5. Resultados parciales y errores',
        paragraphs: [
          'Un lote puede contener solicitudes exitosas y fallidas. El procesamiento posterior debe evaluar cada resultado individualmente, registrar el motivo del fallo y decidir si es reintentable.',
          'Reenviar el lote completo por unos pocos errores puede duplicar trabajo. Los reintentos selectivos deben conservar el mismo identificador lógico o una relación explícita con el intento anterior.',
        ],
      },
      {
        title: '6. Idempotencia y deduplicación',
        paragraphs: [
          'Aunque una inferencia no modifique estado por sí sola, la aplicación que consume el resultado puede hacerlo. Debe evitar aplicar dos veces una clasificación, una notificación o una actualización cuando se repite una descarga o un reintento.',
          'Una tabla de resultados procesados por custom_id o un estado persistente permite reconocer elementos ya aplicados.',
        ],
      },
      {
        title: '7. Cuándo no usar batch',
        bullets: [
          'Chat donde la persona espera una respuesta ahora.',
          'Validación sincrónica que bloquea una transacción.',
          'Workflow agentic donde cada paso depende del resultado anterior.',
          'Carga pequeña donde la complejidad operativa supera el beneficio.',
        ],
      },
      {
        title: '8. Cómo aparece en el examen',
        bullets: [
          'MOST appropriate for 50,000 documents overnight: Message Batches.',
          'MOST appropriate for an interactive assistant: Messages API.',
          'PRIMARY purpose of custom_id: correlacionar solicitud y resultado.',
          'BEST failure handling: procesar éxitos y reintentar solo fallos reintentables.',
          'LEAST safe assumption: que los resultados llegan en el mismo orden de envío.',
        ],
      },
    ],
    checklist: [
      '¿La aplicación necesita una respuesta inmediata?',
      '¿Las solicitudes del lote son independientes?',
      '¿Cada elemento tiene un custom_id estable?',
      '¿El estado del lote se persiste y consulta de forma asíncrona?',
      '¿Los resultados se procesan individualmente?',
      '¿Los reintentos son selectivos e idempotentes?',
      '¿La aplicación evita depender del orden de resultados?',
    ],
    summary: [
      'Messages API sirve para respuestas inmediatas; Message Batches para volumen diferido.',
      'Cada solicitud batch necesita un identificador estable.',
      'Los resultados pueden completarse o fallar individualmente.',
      'Los reintentos selectivos reducen costo y duplicación.',
      'Batch no es adecuado para dependencias interactivas paso a paso.',
    ],
  },

  structured: {
    topicId: 'structured',
    readingMinutes: 22,
    difficulty: 5,
    objectives: [
      'Comparar prosa libre, JSON solicitado por prompt y tool use con schema.',
      'Diseñar un contrato estructurado para sistemas downstream.',
      'Manejar validación, truncación y reintentos.',
      'Reconocer por qué una respuesta parseable no siempre es semánticamente correcta.',
    ],
    sections: [
      {
        title: '1. Parseable no significa confiable',
        paragraphs: [
          'Pedir “respond in JSON” puede mejorar el formato, pero no crea por sí solo un contrato fuerte. El modelo todavía puede omitir campos, cambiar nombres, usar tipos incorrectos o incluir texto adicional.',
          'Cuando un sistema depende de una estructura obligatoria, conviene usar un mecanismo con JSON Schema, como tool use, y validar igualmente el resultado antes de persistirlo o ejecutar acciones.',
        ],
      },
      {
        title: '2. Tool use como contrato de salida',
        paragraphs: [
          'Una herramienta puede representar una operación real o simplemente un contenedor estructurado. Su input_schema define los campos que la aplicación espera recibir.',
          'Cuando la tarea exige esa estructura, la configuración puede orientar o forzar la selección de la herramienta apropiada. Después, la aplicación extrae el bloque tool_use y procesa su input.',
        ],
        goodExample: 'Define a record_invoice tool with required invoice_id, total, currency, line_items, and review_required fields.',
        badExample: 'Ask for “valid JSON” and parse any text between the first and last brace with a regular expression.',
      },
      {
        title: '3. Diseño del schema',
        bullets: [
          'Usar nombres que expresen claramente el significado.',
          'Marcar como required solo lo verdaderamente obligatorio.',
          'Restringir valores controlados con enum.',
          'Representar colecciones con arrays y un schema para cada item.',
          'Separar objetos anidados por responsabilidad.',
          'Evitar strings genéricos cuando existe un tipo más preciso.',
          'Describir unidades, formatos y reglas de normalización.',
        ],
      },
      {
        title: '4. Validación en la aplicación',
        paragraphs: [
          'El schema mejora el cumplimiento estructural, pero la aplicación debe validar reglas de negocio. Un total puede ser numérico y aun así no coincidir con la suma de líneas; una fecha puede tener formato correcto y ser imposible para el dominio.',
          'La validación se divide en estructura, semántica y política. Solo después de superar las tres etapas debería ejecutarse una acción sensible.',
        ],
        diagram: ['Respuesta estructurada', '↓', 'Validación de schema', '↓', 'Validación de negocio', '↓', 'Reglas de riesgo/política', '↓', 'Persistir o ejecutar'],
      },
      {
        title: '5. Manejo de errores y reintentos',
        paragraphs: [
          'Cuando la salida no cumple un requisito, el reintento debe incluir el error exacto y conservar la entrada original. Pedir simplemente “try again” desperdicia información diagnóstica.',
          'Los reintentos deben estar limitados. Después de varios fallos, el sistema puede degradar a revisión humana, dividir la tarea o devolver un estado de error explícito.',
        ],
      },
      {
        title: '6. Truncación',
        paragraphs: [
          'Una estructura grande puede quedar incompleta si la generación alcanza el límite de salida. En ese caso, aumentar el límite indefinidamente no es una estrategia robusta.',
          'La solución habitual es dividir el trabajo en unidades pequeñas que produzcan estructuras válidas y luego fusionarlas de forma determinista.',
        ],
      },
      {
        title: '7. Separar datos de explicación',
        paragraphs: [
          'El consumidor automático puede necesitar campos estrictos, mientras una persona necesita una explicación legible. Ambas necesidades pueden coexistir en campos diferentes, sin mezclar prosa libre dentro de valores que después deben compararse o filtrar.',
        ],
      },
      {
        title: '8. Cómo aparece en el examen',
        bullets: [
          'MOST reliable method for mandatory structure: tool use con JSON Schema.',
          'BEST downstream practice: validar schema y reglas de negocio.',
          'BEST remediation for repeated truncation: dividir y fusionar resultados.',
          'LEAST reliable approach: regex sobre prosa para datos críticos.',
          'MOST useful retry feedback: error exacto de validación y formato esperado.',
        ],
      },
    ],
    checklist: [
      '¿La estructura es realmente obligatoria para el consumidor?',
      '¿El schema usa tipos, required y enums apropiadamente?',
      '¿La aplicación valida también reglas de negocio?',
      '¿Los reintentos incluyen el error exacto y tienen límite?',
      '¿Las respuestas grandes se dividen en unidades manejables?',
      '¿Los datos estrictos están separados de la explicación humana?',
      '¿Una acción sensible ocurre solo después de validación completa?',
    ],
    summary: [
      'Pedir JSON en texto es menos confiable que un contrato basado en schema.',
      'Tool use puede emplearse para devolver datos estructurados.',
      'La validación estructural no reemplaza las reglas de negocio.',
      'Los errores deben producir reintentos específicos y limitados.',
      'Las salidas grandes se dividen y fusionan para evitar truncación.',
    ],
  },

  schema: {
    topicId: 'schema',
    readingMinutes: 21,
    difficulty: 5,
    objectives: [
      'Diferenciar campos optional, nullable y required.',
      'Diseñar enums que representen estados conocidos y desconocidos.',
      'Modelar arrays, objetos anidados y ausencia de datos.',
      'Evitar defaults inventados y strings sin restricciones.',
    ],
    sections: [
      {
        title: '1. El schema debe representar la realidad',
        paragraphs: [
          'Un buen schema no obliga al modelo a inventar información que la fuente no contiene. Debe poder representar ausencia, ambigüedad y estados desconocidos explícitamente.',
          'La pregunta central no es “cómo hago que todos los campos estén llenos”, sino “qué estados válidos puede tener este dato en el dominio”.',
        ],
      },
      {
        title: '2. Required, optional y nullable',
        paragraphs: [
          'Required significa que la propiedad debe estar presente. Optional significa que puede omitirse. Nullable significa que la propiedad puede estar presente con valor null.',
          'Son decisiones distintas. Un campo puede ser requerido y nullable cuando el consumidor necesita siempre la clave, pero acepta que no exista un valor conocido.',
        ],
        goodExample: 'middle_name may be omitted when the document has no such field; termination_date may be present as null when the contract is active.',
        badExample: 'Require every field and fill missing values with an invented empty string or guessed default.',
      },
      {
        title: '3. Enums y estado unknown',
        paragraphs: [
          'Un enum restringe los valores a un conjunto controlado y evita variaciones de escritura. Cuando la fuente puede no permitir una clasificación, conviene incluir un estado como unknown o needs_review en lugar de forzar una categoría incorrecta.',
          'Unknown no debe usarse para ocultar cualquier error. Debe tener una definición clara y, si es importante, activar revisión o métricas específicas.',
        ],
      },
      {
        title: '4. Arrays y objetos anidados',
        paragraphs: [
          'Los arrays deben definir la estructura de cada elemento. Un arreglo de line_items necesita propiedades consistentes para descripción, cantidad, precio y moneda.',
          'Los objetos anidados agrupan campos que pertenecen a una misma entidad, como address o source_reference, y reducen nombres planos ambiguos.',
        ],
      },
      {
        title: '5. Limitar propiedades inesperadas',
        paragraphs: [
          'Cuando el consumidor requiere un contrato cerrado, las propiedades adicionales pueden rechazarse. Esto evita que campos inventados entren silenciosamente al sistema.',
          'Sin embargo, el contrato debe evolucionar de forma versionada para no romper consumidores cuando se agregan capacidades legítimas.',
        ],
      },
      {
        title: '6. Uniones y variantes',
        paragraphs: [
          'Algunos dominios tienen variantes reales: un pago puede usar cuenta bancaria o tarjeta, pero no ambas estructuras simultáneamente. Cuando el mecanismo admite uniones, pueden modelarse alternativas; en otros casos, un campo discriminador y propiedades condicionales simplifican el procesamiento.',
          'La clave es que cada variante sea inequívoca para el consumidor y no dependa de inferir el tipo a partir de campos vagos.',
        ],
      },
      {
        title: '7. Normalización',
        bullets: [
          'Fechas en un formato acordado.',
          'Monedas mediante códigos controlados.',
          'Números como números, no strings con símbolos.',
          'Booleanos como true/false, no “yes”, “no” o “maybe”.',
          'Identificadores preservados como string cuando los ceros iniciales importan.',
          'Unidades explícitas para cantidades físicas o duraciones.',
        ],
      },
      {
        title: '8. Cómo aparece en el examen',
        bullets: [
          'Optional: la propiedad puede omitirse.',
          'Nullable: null es un valor válido.',
          'BEST way to avoid invented categories: enum con unknown cuando corresponde.',
          'LEAST appropriate design: todo como string libre y defaults inventados.',
          'BEST representation for repeated structured items: array con item schema.',
        ],
      },
    ],
    checklist: [
      '¿Cada required es verdaderamente obligatorio?',
      '¿La ausencia se representa con omisión, null o unknown de forma intencional?',
      '¿Los valores controlados usan enum?',
      '¿Los arrays definen la estructura de sus elementos?',
      '¿Los objetos anidados representan entidades coherentes?',
      '¿Los identificadores y números usan tipos que preservan su significado?',
      '¿El contrato evita propiedades inesperadas o las maneja de forma versionada?',
    ],
    summary: [
      'Required, optional y nullable representan condiciones diferentes.',
      'El schema no debe obligar a inventar datos ausentes.',
      'Enums reducen variaciones y pueden incluir unknown cuando el dominio lo requiere.',
      'Arrays y objetos anidados deben tener contratos internos claros.',
      'La normalización convierte datos variados en valores consistentes para downstream.',
    ],
  },
}
