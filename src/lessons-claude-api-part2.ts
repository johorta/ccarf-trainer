import type { LessonContent } from './lessons'

export const claudeApiLessonsPart2: Record<string, LessonContent> = {
  'specialized-review': {
    topicId: 'specialized-review',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Explicar por qué varias pasadas especializadas pueden superar a una revisión general.',
      'Diseñar revisores separados para seguridad, lógica, cumplimiento y diseño.',
      'Evitar duplicados y contradicciones durante la síntesis.',
      'Reconocer cuándo una pasada adicional agrega costo sin mejorar cobertura.',
    ],
    sections: [
      {
        title: '1. El problema de mezclar demasiados criterios',
        paragraphs: [
          'Un único prompt que intenta revisar seguridad, lógica, estilo, rendimiento, cumplimiento y experiencia de usuario obliga al modelo a repartir atención entre objetivos que compiten. Los problemas sutiles pueden quedar ocultos detrás de categorías más fáciles de detectar.',
          'Las pasadas especializadas separan preocupaciones. Cada revisor recibe un objetivo estrecho, criterios concretos y ejemplos relevantes, lo que mejora la profundidad y la consistencia dentro de esa dimensión.',
        ],
        diagram: ['Documento o cambio', '├─ Revisión de seguridad', '├─ Revisión lógica', '├─ Revisión de cumplimiento', '└─ Revisión de diseño', '↓', 'Síntesis y deduplicación'],
      },
      {
        title: '2. Qué debe cambiar entre revisores',
        bullets: [
          'Objetivo y definición de éxito.',
          'Criterios de inclusión y exclusión.',
          'Ejemplos positivos y negativos.',
          'Herramientas y fuentes autorizadas.',
          'Campos específicos del output.',
          'Umbral de severidad o confianza.',
        ],
        paragraphs: [
          'Crear cuatro revisores con el mismo prompt y cambiar solo el nombre no produce especialización real. Cada pasada debe tener una perspectiva y un contrato de salida claramente diferenciados.',
        ],
      },
      {
        title: '3. Ventajas y costos',
        paragraphs: [
          'La principal ventaja es reducir la competencia entre criterios y aumentar la probabilidad de detectar problemas específicos. También facilita asignar modelos, herramientas o presupuestos distintos según el riesgo.',
          'El costo aparece en más llamadas, mayor latencia y necesidad de síntesis. Por eso la arquitectura debe reservar pasadas especializadas para dimensiones importantes o difíciles de evaluar conjuntamente.',
        ],
      },
      {
        title: '4. Síntesis de resultados',
        paragraphs: [
          'Varios revisores pueden reportar el mismo problema con nombres distintos. La síntesis debe agrupar hallazgos equivalentes, conservar la evidencia más fuerte y registrar qué revisores coincidieron.',
          'Cuando las conclusiones se contradicen, la síntesis no debe escoger una arbitrariamente. Debe conservar el desacuerdo, su procedencia y el contexto necesario para resolverlo.',
        ],
        goodExample: 'Merge three reports about the same authorization bypass into one finding, preserving all relevant file references and the highest justified severity.',
        badExample: 'Publish every specialist response as a separate final finding without checking overlap or conflict.',
      },
      {
        title: '5. Cuándo no separar',
        paragraphs: [
          'Una tarea pequeña, reversible y con pocos criterios puede resolverse mejor con una sola revisión. Añadir cinco agentes para revisar una modificación trivial puede aumentar costo y contradicciones sin beneficio real.',
          'La decisión depende del riesgo, volumen, diversidad de criterios y dificultad de detectar cada clase de problema.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'BEST way to improve recall across competing concerns: pasadas especializadas y síntesis posterior.',
          'PRIMARY benefit: atención profunda por preocupación, no reducción garantizada de costo.',
          'MOST important synthesis behavior: deduplicar sin perder fuentes ni desacuerdos.',
          'LEAST appropriate use: múltiples revisores idénticos para una tarea trivial.',
        ],
      },
    ],
    checklist: [
      '¿Cada pasada tiene un objetivo realmente distinto?',
      '¿Los criterios y ejemplos están adaptados a esa preocupación?',
      '¿Las herramientas entregadas son necesarias para el rol?',
      '¿Existe un paso de deduplicación y síntesis?',
      '¿Los desacuerdos conservan procedencia?',
      '¿El beneficio justifica las llamadas adicionales?',
    ],
    summary: [
      'Las pasadas especializadas reducen competencia entre criterios.',
      'La especialización requiere prompts, ejemplos y outputs diferentes.',
      'La síntesis debe consolidar duplicados y preservar desacuerdos.',
      'Más revisores agregan costo y coordinación; no siempre son necesarios.',
    ],
  },

  'tool-schema': {
    topicId: 'tool-schema',
    readingMinutes: 22,
    difficulty: 5,
    objectives: [
      'Diseñar schemas de herramientas claros y validables.',
      'Explicar la función de required, types, descriptions y tool_choice.',
      'Distinguir validación estructural de validación de negocio.',
      'Evitar schemas ambiguos que trasladan incertidumbre al modelo.',
    ],
    sections: [
      {
        title: '1. El schema es el contrato de entrada',
        paragraphs: [
          'Una herramienta expone una operación y un contrato de argumentos. El JSON Schema define qué campos existen, cuáles son obligatorios y qué tipos o valores son válidos.',
          'Un buen schema reduce ambigüedad antes de ejecutar la acción. No debe depender de que el sistema posterior interprete cadenas libres para reconstruir datos críticos.',
        ],
      },
      {
        title: '2. Campos requeridos y opcionales',
        paragraphs: [
          'Un campo debe ser required cuando la operación no puede ejecutarse correctamente sin él. Marcar todo como opcional desplaza errores a tiempo de ejecución y obliga a inventar valores.',
          'Los campos opcionales deben tener un significado claro cuando se omiten. Si null es un valor permitido y diferente de ausencia, el schema debe representarlo explícitamente.',
        ],
        goodExample: 'create_payment requires amount, currency, merchant_id, and idempotency_key; metadata remains optional.',
        badExample: 'Define every argument as an optional free-form string and let the tool guess missing values.',
      },
      {
        title: '3. Tipos, enums y objetos anidados',
        bullets: [
          'number o integer para cantidades numéricas cuando corresponde.',
          'boolean para decisiones binarias, no strings como “yes” y “no”.',
          'enum para estados o categorías controladas.',
          'array con items definidos para colecciones homogéneas.',
          'object con properties para estructuras compuestas.',
          'additionalProperties restringido cuando no se aceptan campos arbitrarios.',
        ],
      },
      {
        title: '4. Descripciones que guían la selección',
        paragraphs: [
          'El nombre y la descripción deben explicar cuándo usar la herramienta, qué operación realiza y cómo se diferencia de alternativas similares. El schema describe forma; la descripción agrega propósito y límites.',
          'Una descripción de marketing como “powerful search tool” no ayuda a elegir entre search_users, get_user y list_accounts.',
        ],
      },
      {
        title: '5. tool_choice',
        paragraphs: [
          'tool_choice controla si una herramienta debe invocarse, si el modelo puede elegir libremente o si se fuerza una herramienta concreta. Forzar es útil cuando la salida estructurada es obligatoria o la operación requerida está conocida de antemano.',
          'No debe forzarse una herramienta incorrecta cuando el modelo necesita decidir entre varias alternativas según el contenido de la solicitud.',
        ],
        diagram: ['Solicitud', '├─ elección abierta → auto', '├─ debe usar alguna tool → required/any', '└─ debe usar una específica → force tool'],
      },
      {
        title: '6. Validación después de la generación',
        paragraphs: [
          'Que los argumentos cumplan el schema no garantiza que la acción sea válida para el negocio. Un amount numérico puede ser negativo; un account_id bien formado puede pertenecer a otra organización.',
          'El servidor debe validar permisos, existencia, reglas de negocio e idempotencia antes de ejecutar efectos externos.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'MOST reliable structured arguments: tool use con JSON Schema claro.',
          'BEST use of tool_choice: forzar cuando una llamada concreta es obligatoria.',
          'LEAST suitable schema: strings libres, campos ambiguos y required ausente.',
          'IMPORTANT limitation: validación de schema no reemplaza autorización ni reglas de negocio.',
        ],
      },
    ],
    checklist: [
      '¿Cada campo tiene el tipo correcto?',
      '¿Los campos indispensables están en required?',
      '¿Los enums representan valores controlados y estados desconocidos cuando corresponde?',
      '¿La descripción distingue esta herramienta de otras?',
      '¿tool_choice refleja si la invocación es obligatoria o seleccionable?',
      '¿El servidor valida autorización y reglas de negocio?',
    ],
    summary: [
      'El schema es un contrato de entrada, no una sugerencia.',
      'Required, tipos y enums reducen argumentos ambiguos.',
      'tool_choice controla cuándo y cuál herramienta debe invocarse.',
      'La validación estructural no sustituye validación de negocio ni permisos.',
    ],
  },

  truncation: {
    topicId: 'truncation',
    readingMinutes: 19,
    difficulty: 5,
    objectives: [
      'Detectar cuándo una salida estructurada fue truncada.',
      'Diseñar partición y fusión para resultados grandes.',
      'Preservar validez parcial y trazabilidad por lote.',
      'Evitar soluciones frágiles basadas solo en aumentar max_tokens.',
    ],
    sections: [
      {
        title: '1. Por qué la truncación es especialmente peligrosa',
        paragraphs: [
          'Una respuesta en prosa cortada puede ser obviamente incompleta. Una estructura JSON truncada puede además quedar sintácticamente inválida y romper el sistema posterior.',
          'Incluso cuando el JSON cierra correctamente, el resultado puede estar incompleto si la generación terminó por límite antes de procesar todos los elementos.',
        ],
      },
      {
        title: '2. Señales de truncación',
        bullets: [
          'stop_reason o metadato equivalente indica límite de tokens.',
          'JSON incompleto o error de parsing.',
          'Cantidad procesada menor que la esperada.',
          'Último elemento cortado o campos obligatorios ausentes.',
          'Ausencia de marcador de finalización esperado.',
        ],
      },
      {
        title: '3. Dividir el trabajo',
        paragraphs: [
          'La solución más robusta es dividir la entrada en unidades manejables: páginas, documentos, archivos o grupos de registros. Cada llamada produce una estructura pequeña y validable.',
          'El tamaño del lote debe dejar margen suficiente para razonamiento, salida y variación. Un lote que apenas cabe en el mejor caso seguirá siendo inestable.',
        ],
        diagram: ['Entrada grande', '↓ particionar', 'Lote 1 → JSON válido', 'Lote 2 → JSON válido', 'Lote 3 → JSON válido', '↓ fusionar', 'Resultado completo'],
      },
      {
        title: '4. Fusión determinista',
        paragraphs: [
          'La fusión debe definir cómo combinar arrays, resolver IDs duplicados, conservar fuentes y ordenar resultados. No conviene pedir a otra llamada que improvise la unión si una operación determinista puede hacerlo.',
          'Cada lote debería incluir un identificador de origen y estado de completitud para permitir reintentos selectivos.',
        ],
      },
      {
        title: '5. Reintentos',
        paragraphs: [
          'Cuando un lote falla, se reintenta ese lote y no toda la operación. Los reintentos deben estar limitados y registrar la causa.',
          'Si el mismo lote vuelve a truncarse, conviene reducir su tamaño o dividirlo nuevamente, no repetir indefinidamente con los mismos parámetros.',
        ],
      },
      {
        title: '6. Por qué aumentar max_tokens no siempre basta',
        paragraphs: [
          'Aumentar el límite puede resolver un caso pequeño, pero no escala cuando la entrada continúa creciendo. También incrementa costo y latencia y puede seguir dejando la salida cerca del límite.',
          'La partición convierte un problema de tamaño variable en unidades controlables y observables.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST remediation for repeated truncation: dividir llamadas y fusionar estructuras válidas.',
          'MOST important metadata: lote, fuente, completitud y stop reason.',
          'LEAST robust solution: aumentar max_tokens indefinidamente.',
          'BEST retry strategy: reintentar solo el lote fallido y reducirlo si vuelve a fallar.',
        ],
      },
    ],
    checklist: [
      '¿Compruebo stop reason y validez del JSON?',
      '¿Sé cuántos elementos debían procesarse?',
      '¿Los lotes dejan margen de salida?',
      '¿Cada resultado parcial conserva origen y completitud?',
      '¿La fusión es determinista y deduplica correctamente?',
      '¿Los reintentos son selectivos y limitados?',
    ],
    summary: [
      'La truncación puede producir JSON inválido o resultados silenciosamente incompletos.',
      'Dividir y fusionar es más robusto que aumentar límites sin control.',
      'Cada lote debe ser validable, trazable y reintentable.',
      'La fusión debe seguir reglas deterministas.',
    ],
  },

  extraction: {
    topicId: 'extraction',
    readingMinutes: 21,
    difficulty: 5,
    objectives: [
      'Diseñar extracción consistente para formatos de entrada variados.',
      'Aplicar normalización sin inventar datos ausentes.',
      'Usar ejemplos representativos para resolver ambigüedades.',
      'Separar texto original, valor normalizado y confianza.',
    ],
    sections: [
      {
        title: '1. Extraer no es resumir',
        paragraphs: [
          'La extracción convierte evidencia de entrada en campos definidos. El objetivo es fidelidad y consistencia, no producir una interpretación general del documento.',
          'Cada campo necesita una definición operacional: dónde buscarlo, cómo representarlo y qué hacer si está ausente o es ambiguo.',
        ],
      },
      {
        title: '2. Schema y campos ausentes',
        paragraphs: [
          'El schema debe permitir representar ausencia. Si un dato puede no aparecer, debe ser optional o nullable según el contrato. Obligar al modelo a completar todos los campos incentiva invenciones.',
          'Es útil distinguir entre “no aparece”, “aparece pero es ilegible” y “existen valores contradictorios”.',
        ],
      },
      {
        title: '3. Normalización',
        paragraphs: [
          'Normalizar significa convertir representaciones equivalentes a un formato común: fechas a ISO, monedas a códigos controlados o teléfonos a un formato acordado.',
          'La regla de normalización debe ser explícita y no debe borrar el valor original cuando la trazabilidad importa.',
        ],
        goodExample: 'raw_date: “4 Aug 2026”, normalized_date: “2026-08-04”, confidence: high.',
        badExample: 'Convert an unreadable date into a plausible ISO date without marking uncertainty.',
      },
      {
        title: '4. Few-shot examples representativos',
        paragraphs: [
          'Los ejemplos ayudan cuando existen formatos variados, límites sutiles o convenciones del dominio. Deben cubrir casos frecuentes, bordes y ausencia de datos.',
          'Muchos ejemplos redundantes consumen contexto. Es preferible una selección diversa que muestre decisiones difíciles.',
        ],
      },
      {
        title: '5. Evidencia y spans',
        paragraphs: [
          'Para campos importantes, la salida puede incluir texto de evidencia, página o posición. Esto permite auditar el resultado y facilita revisión humana.',
          'La evidencia también ayuda a detectar cuando un valor normalizado no corresponde al documento original.',
        ],
      },
      {
        title: '6. Validación y consistencia',
        bullets: [
          'Validar schema y tipos.',
          'Comprobar formatos normalizados.',
          'Verificar relaciones entre campos.',
          'Detectar valores imposibles o contradictorios.',
          'Enviar casos ambiguos a revisión humana.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST combination for accuracy: schema, normalización explícita, few-shot y campos ausentes representables.',
          'LEAST appropriate behavior: inventar defaults para completar required.',
          'PRIMARY purpose of evidence spans: trazabilidad y validación.',
          'BEST examples: diversos y representativos, no numerosos por sí mismos.',
        ],
      },
    ],
    checklist: [
      '¿Cada campo tiene una definición clara?',
      '¿El schema representa ausencia y ambigüedad?',
      '¿Las reglas de normalización son explícitas?',
      '¿Conservo el valor original cuando importa?',
      '¿Los ejemplos cubren casos normales y bordes?',
      '¿La salida incluye evidencia para campos críticos?',
      '¿Los casos dudosos se validan o enrutan a revisión?',
    ],
    summary: [
      'La extracción requiere contratos de campo precisos.',
      'La ausencia debe representarse sin inventar valores.',
      'Normalización y valor original pueden coexistir.',
      'Ejemplos diversos mejoran consistencia en formatos variables.',
      'Evidencia y validación hacen auditable el resultado.',
    ],
  },

  'false-positives': {
    topicId: 'false-positives',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Reducir falsos positivos sin ocultar problemas reales.',
      'Incorporar convenciones y excepciones aceptadas del proyecto.',
      'Usar evidencia mínima y criterios de severidad.',
      'Medir precisión y recall por separado.',
    ],
    sections: [
      {
        title: '1. Qué es un falso positivo',
        paragraphs: [
          'Un falso positivo ocurre cuando el sistema reporta un problema que no existe o que el proyecto considera aceptado bajo condiciones conocidas. Demasiados falsos positivos reducen confianza y hacen que las personas ignoren alertas reales.',
          'Reducirlos no significa pedir menos hallazgos de forma indiscriminada. Significa mejorar definición, contexto, evidencia y exclusiones.',
        ],
      },
      {
        title: '2. Convenciones del proyecto',
        paragraphs: [
          'Un revisor genérico puede desconocer wrappers de seguridad, validaciones centralizadas o patrones arquitectónicos aceptados. Las reglas persistentes deben explicar esas convenciones con ejemplos.',
          'Las excepciones deben ser específicas. Una exclusión demasiado amplia puede eliminar verdaderos positivos.',
        ],
      },
      {
        title: '3. Exigir evidencia',
        paragraphs: [
          'Un hallazgo debería indicar archivo, línea, condición y consecuencia. Requerir evidencia obliga al modelo a conectar la afirmación con el código o documento observado.',
          'Cuando la evidencia es insuficiente, el resultado puede presentarse como pregunta o baja confianza en vez de una acusación definitiva.',
        ],
        goodExample: 'Report SQL injection only when untrusted input reaches a query sink without the project sanitizer; include the exact data path.',
        badExample: 'Flag every string concatenation as SQL injection.',
      },
      {
        title: '4. Criterios de inclusión y exclusión',
        bullets: [
          'Incluir solo hallazgos que cumplan una definición verificable.',
          'Excluir patrones seguros documentados.',
          'Distinguir deuda técnica de vulnerabilidad.',
          'No reportar preferencias de estilo como errores críticos.',
          'Definir umbral de severidad por impacto y explotabilidad.',
        ],
      },
      {
        title: '5. Evaluar precisión y recall',
        paragraphs: [
          'Precisión mide cuántos hallazgos reportados son correctos. Recall mide cuántos problemas reales fueron detectados. Optimizar solo precisión puede hacer que el sistema reporte casi nada; optimizar solo recall puede inundar de ruido.',
          'La evaluación debe usar un conjunto etiquetado con verdaderos positivos, negativos y casos de borde.',
        ],
      },
      {
        title: '6. Refinamiento con errores reales',
        paragraphs: [
          'Los falsos positivos observados deben convertirse en ejemplos negativos o reglas concretas. El feedback “be less noisy” es menos útil que mostrar el hallazgo incorrecto y explicar la convención que lo invalida.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'MOST effective reduction: convenciones, exclusiones y evidencia específica.',
          'BEST evaluation: medir precisión y recall con casos etiquetados.',
          'LEAST safe shortcut: excluir una categoría completa para eliminar ruido.',
          'BEST feedback: ejemplos concretos de falsos positivos y la regla correcta.',
        ],
      },
    ],
    checklist: [
      '¿El hallazgo cumple una definición verificable?',
      '¿Conoce patrones seguros y excepciones específicas?',
      '¿Incluye evidencia y ruta causal?',
      '¿La severidad corresponde al impacto real?',
      '¿Las exclusiones son estrechas y documentadas?',
      '¿Se evalúan precisión y recall?',
    ],
    summary: [
      'Los falsos positivos erosionan confianza en la automatización.',
      'Convenciones y excepciones específicas reducen ruido.',
      'La evidencia conecta cada hallazgo con una causa observable.',
      'Precisión y recall deben equilibrarse y medirse por separado.',
    ],
  },

  boundaries: {
    topicId: 'boundaries',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Definir límites explícitos de inclusión y exclusión.',
      'Usar ejemplos de borde para resolver categorías cercanas.',
      'Evitar instrucciones abiertas que incentivan resultados irrelevantes.',
      'Distinguir alcance temático, documental y temporal.',
    ],
    sections: [
      {
        title: '1. Por qué los límites importan',
        paragraphs: [
          'Una instrucción como “find anything important” deja al modelo decidir qué significa importante y produce resultados difíciles de comparar. Los límites convierten una tarea abierta en un contrato evaluable.',
          'La inclusión define qué debe aparecer. La exclusión define contenido cercano que no pertenece al resultado.',
        ],
      },
      {
        title: '2. Tipos de límites',
        bullets: [
          'Temáticos: qué categorías se buscan.',
          'Documentales: qué archivos o secciones cuentan como fuente.',
          'Temporales: qué período debe considerarse.',
          'De entidad: qué usuarios, cuentas o productos se incluyen.',
          'De severidad: qué nivel mínimo debe reportarse.',
          'De evidencia: qué soporte mínimo exige un hallazgo.',
        ],
      },
      {
        title: '3. Ejemplos de borde',
        paragraphs: [
          'Las categorías cercanas requieren ejemplos. Si se extraen obligaciones contractuales pero no lenguaje promocional, conviene mostrar una frase que sí crea obligación, una que no y una ambigua.',
          'Los ejemplos de borde enseñan la frontera mejor que definiciones abstractas muy largas.',
        ],
        goodExample: 'Include “Supplier shall deliver within 10 days.” Exclude “We aim to provide fast delivery.” Route “Delivery is generally expected within 10 days” as ambiguous.',
        badExample: 'Extract all important statements.',
      },
      {
        title: '4. No confundir exclusión con ocultamiento',
        paragraphs: [
          'Una exclusión debe responder al objetivo. Excluir hallazgos de baja confianza puede ser incorrecto si esos casos deberían ir a revisión humana.',
          'A veces la salida necesita una categoría “out of scope” o “uncertain” para conservar trazabilidad sin mezclarla con resultados confirmados.',
        ],
      },
      {
        title: '5. Límites en pipelines',
        paragraphs: [
          'Los límites deben mantenerse entre extracción, clasificación y síntesis. Si una fase cambia silenciosamente la definición, el resultado final deja de corresponder al objetivo inicial.',
          'Conviene registrar versión de instrucciones y criterios para reproducir la ejecución.',
        ],
      },
      {
        title: '6. Evaluación',
        paragraphs: [
          'Un conjunto de prueba debe incluir elementos claramente incluidos, claramente excluidos y casos de frontera. Solo medir ejemplos fáciles da una impresión falsa de calidad.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST prompt: categorías permitidas, prohibidas y ejemplos de borde.',
          'MOST likely cause of noisy extraction: límites vagos o inexistentes.',
          'LEAST useful instruction: “find anything interesting”.',
          'BEST treatment of ambiguity: representarla o enrutarla, no inventar una clasificación definitiva.',
        ],
      },
    ],
    checklist: [
      '¿Definí qué debe incluirse?',
      '¿Definí contenido cercano que debe excluirse?',
      '¿El alcance documental y temporal está claro?',
      '¿Existen ejemplos positivos, negativos y ambiguos?',
      '¿Las fases posteriores preservan los mismos límites?',
      '¿Los casos de borde forman parte de la evaluación?',
    ],
    summary: [
      'Los límites explícitos hacen evaluable una tarea abierta.',
      'Inclusión y exclusión deben acompañarse de ejemplos de borde.',
      'La ambigüedad debe conservarse o escalarse, no ocultarse.',
      'Los límites deben permanecer consistentes en todo el pipeline.',
    ],
  },
}
