import type { LessonContent } from './lessons'

export const agenticLessonsPart2: Record<string, LessonContent> = {
  'dynamic-decomposition': {
    topicId: 'dynamic-decomposition',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Explicar por qué una descomposición fija puede fallar en tareas abiertas.',
      'Distinguir entre planificación inicial y adaptación durante la ejecución.',
      'Reconocer cuándo crear, dividir, fusionar o cancelar subtareas.',
      'Identificar distractores del examen que confunden dinamismo con improvisación.',
    ],
    sections: [
      {
        title: '1. Qué significa descomposición dinámica',
        paragraphs: [
          'La descomposición de tareas consiste en convertir un objetivo grande en subtareas manejables. Es dinámica cuando esas subtareas pueden cambiar a medida que aparecen resultados, dependencias o riesgos que no eran visibles al comienzo.',
          'No significa ejecutar sin plan. El agente comienza con una hipótesis de trabajo, pero trata ese plan como una estructura revisable, no como una secuencia inmutable.',
        ],
        diagram: ['Objetivo', '↓', 'Plan inicial', '↓', 'Ejecutar subtarea', '↓', 'Evaluar evidencia', '├─ continuar', '├─ crear nueva subtarea', '├─ fusionar tareas', '└─ cancelar trabajo irrelevante'],
      },
      {
        title: '2. Por qué un plan fijo puede ser insuficiente',
        paragraphs: [
          'En una investigación técnica, la primera hipótesis puede apuntar a la base de datos. Si la evidencia muestra latencia de red, seguir ejecutando todas las subtareas de base de datos desperdicia tiempo y contexto.',
          'El valor del agente aparece cuando puede usar resultados intermedios para decidir el siguiente paso. Un workflow que ignora resultados y ejecuta siempre la misma lista se parece más a un script que a un sistema agentic.',
        ],
        badExample: '1. Review database indexes.\n2. Review slow queries.\n3. Tune the database.\n4. Stop.\n\nNever change the plan, even if the evidence points to network latency.',
      },
      {
        title: '3. Operaciones sobre subtareas',
        bullets: [
          'Crear una subtarea cuando aparece una línea de investigación nueva.',
          'Dividir una subtarea demasiado amplia en unidades con criterios de éxito propios.',
          'Fusionar subtareas cuando dos líneas de trabajo producen información redundante.',
          'Cancelar trabajo que dejó de ser relevante después de un hallazgo concluyente.',
          'Repriorizar tareas según riesgo, valor informativo y dependencias.',
        ],
      },
      {
        title: '4. Adaptación con control',
        paragraphs: [
          'La adaptación debe conservar límites. El coordinador puede definir presupuesto, herramientas permitidas, profundidad máxima y checkpoints obligatorios.',
          'Un agente bien diseñado no crea subtareas indefinidamente. Revisa si cada nueva tarea acerca al criterio de éxito y evita explorar ramas sin evidencia suficiente.',
        ],
        goodExample: 'Goal: identify the root cause.\nConstraints: read-only, maximum 6 subtasks, report after each major finding, stop when one hypothesis is supported by two independent pieces of evidence.',
      },
      {
        title: '5. Relación con dependencias',
        paragraphs: [
          'La descomposición también debe capturar dependencias. Una tarea que necesita un identificador producido por otra no puede ejecutarse antes. En cambio, investigaciones independientes sí pueden ejecutarse en paralelo.',
          'Una buena representación del plan distingue entre tareas listas, bloqueadas, completadas y descartadas.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        paragraphs: [
          'Las preguntas suelen mostrar nueva evidencia a mitad de una investigación. La respuesta correcta normalmente permite revisar el plan y crear o repriorizar subtareas.',
          'Un distractor frecuente propone reiniciar todo el trabajo. Otro obliga a terminar el plan original antes de considerar el hallazgo. Ambos desaprovechan el estado ya obtenido.',
        ],
        bullets: [
          'MOST appropriate: revisar subtareas según la evidencia.',
          'LEAST efficient: repetir trabajo completado después de cambiar el plan.',
          'PRIMARY benefit: adaptar el esfuerzo a información nueva.',
          'No confundir dinamismo con ausencia de restricciones.',
        ],
      },
    ],
    checklist: [
      '¿El plan permite incorporar evidencia nueva?',
      '¿Cada subtarea tiene un criterio de éxito?',
      '¿Las dependencias están explícitas?',
      '¿Se evita repetir trabajo ya completado?',
      '¿Existe un límite para crear nuevas subtareas?',
      '¿El coordinador conserva visibilidad mediante checkpoints?',
    ],
    summary: [
      'La descomposición dinámica revisa el plan usando resultados intermedios.',
      'Adaptar no significa improvisar sin límites.',
      'Las subtareas pueden crearse, dividirse, fusionarse, cancelarse o repriorizarse.',
      'Las dependencias determinan qué puede ejecutarse en paralelo.',
    ],
  },

  'review-architecture': {
    topicId: 'review-architecture',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Seleccionar entre ejecución directa, plan mode y workflows multifase.',
      'Relacionar riesgo, reversibilidad y aprobación humana con la arquitectura.',
      'Evitar tanto la ejecución prematura como la sobrearquitectura.',
      'Reconocer preguntas del examen sobre gates y separación de responsabilidades.',
    ],
    sections: [
      {
        title: '1. Tres niveles de control',
        paragraphs: [
          'La ejecución directa permite que el agente actúe inmediatamente. Plan mode separa análisis y propuesta de la ejecución. Un workflow multifase divide el proceso en etapas especializadas, por ejemplo extracción, revisión, aprobación y aplicación.',
          'La elección correcta depende de las consecuencias de un error, no de cuán sofisticada se vea la arquitectura.',
        ],
      },
      {
        title: '2. Cuándo usar ejecución directa',
        paragraphs: [
          'Es apropiada para tareas simples, de bajo riesgo, fáciles de validar y reversibles. Por ejemplo, resumir un archivo o generar un borrador que todavía no será publicado.',
          'No es apropiada cuando la acción modifica producción, elimina datos o produce una decisión difícil de revertir.',
        ],
        goodExample: 'Read a local configuration file and summarize the enabled features.',
        badExample: 'Change production permissions immediately without showing the plan or requesting approval.',
      },
      {
        title: '3. Cuándo usar plan mode',
        paragraphs: [
          'Plan mode es útil cuando conviene inspeccionar la estrategia antes de actuar. El agente puede explorar, identificar archivos afectados, proponer cambios y explicar riesgos sin modificar todavía el sistema.',
          'La aprobación del plan reduce errores de alcance y permite que una persona confirme supuestos antes de la ejecución.',
        ],
        diagram: ['Solicitud', '↓', 'Analizar', '↓', 'Proponer plan', '↓', 'Revisión humana', '↓', 'Ejecutar'],
      },
      {
        title: '4. Cuándo usar un workflow multifase',
        paragraphs: [
          'Los workflows multifase son apropiados cuando distintas etapas requieren prompts, herramientas o criterios diferentes. También permiten insertar gates humanos en puntos concretos.',
          'Un ejemplo es procesar contratos: una fase extrae cláusulas, otra revisa inconsistencias, otra enruta ambigüedades a una persona y una última publica el resultado aprobado.',
        ],
        bullets: [
          'Separar extracción de interpretación.',
          'Separar propuesta de ejecución.',
          'Separar revisiones especializadas por seguridad, negocio o API.',
          'Persistir el estado entre fases para poder reanudar.',
        ],
      },
      {
        title: '5. Riesgo, reversibilidad y costo',
        paragraphs: [
          'A mayor riesgo y menor reversibilidad, mayor necesidad de planificación, validación y aprobación. Una operación de lectura tolera más automatización que una transferencia financiera o un cambio de permisos.',
          'Sin embargo, agregar fases a una tarea trivial aumenta latencia y complejidad sin mejorar la seguridad. La arquitectura debe ser proporcional.',
        ],
      },
      {
        title: '6. Trampas del examen',
        bullets: [
          'Elegir direct execution solo porque es más rápido, ignorando el riesgo.',
          'Elegir multi-phase para cualquier tarea, aunque sea trivial.',
          'Confundir plan mode con un plan que se ejecuta automáticamente sin aprobación.',
          'Omitir persistencia cuando el workflow puede interrumpirse entre fases.',
        ],
      },
    ],
    checklist: [
      '¿La acción es reversible?',
      '¿Un error puede afectar producción o datos sensibles?',
      '¿Conviene revisar el alcance antes de ejecutar?',
      '¿Las fases requieren herramientas o prompts distintos?',
      '¿Debe existir una aprobación humana explícita?',
      '¿La complejidad añadida es proporcional al riesgo?',
    ],
    summary: [
      'Direct execution sirve para tareas simples y reversibles.',
      'Plan mode permite revisar la estrategia antes de actuar.',
      'Multi-phase separa responsabilidades y permite gates específicos.',
      'Más riesgo y menos reversibilidad requieren más control.',
    ],
  },

  state: {
    topicId: 'state',
    readingMinutes: 21,
    difficulty: 5,
    objectives: [
      'Definir qué estado debe persistirse en un pipeline de agentes.',
      'Distinguir estado conversacional de estado operativo durable.',
      'Diseñar checkpoints que permitan reanudar sin repetir trabajo.',
      'Reconocer problemas de idempotencia, duplicación y versiones.',
    ],
    sections: [
      {
        title: '1. Por qué el contexto no es suficiente',
        paragraphs: [
          'El historial de conversación puede ayudar al modelo a razonar, pero no debe ser la única fuente de estado de un workflow largo. El contexto puede compactarse, truncarse o perderse después de una interrupción.',
          'El estado operativo debe almacenarse de forma durable y explícita para que el sistema sepa qué ocurrió incluso si cambia la sesión o el proceso se reinicia.',
        ],
      },
      {
        title: '2. Qué debe guardar un checkpoint',
        bullets: [
          'Identificador del workflow y versión de la definición.',
          'Subtareas completadas, bloqueadas, fallidas y pendientes.',
          'Outputs estructurados y referencias a artefactos grandes.',
          'Fuentes y evidencia utilizadas para producir cada resultado.',
          'Errores, cantidad de reintentos y próxima acción permitida.',
          'Aprobaciones humanas y decisiones irreversibles ya ejecutadas.',
        ],
      },
      {
        title: '3. Reanudación correcta',
        paragraphs: [
          'Al reanudar, el sistema carga el último checkpoint válido, verifica qué recursos cambiaron y continúa desde las tareas pendientes. No debería repetir indiscriminadamente todas las fases.',
          'Si una fase externa puede ejecutarse más de una vez, debe diseñarse para ser idempotente o usar claves de deduplicación.',
        ],
        diagram: ['Inicio', '↓', 'Fase A completada', '↓ checkpoint', 'Fase B completada', '↓ checkpoint', 'Interrupción', '↓', 'Cargar checkpoint', '↓', 'Continuar con Fase C'],
      },
      {
        title: '4. Estado pequeño y artefactos grandes',
        paragraphs: [
          'No todo debe almacenarse dentro del checkpoint. Archivos grandes, reportes o datasets pueden guardarse como artefactos externos y el estado conserva una referencia, hash y metadatos.',
          'Esto mantiene el checkpoint compacto y permite verificar que el artefacto recuperado corresponde a la versión esperada.',
        ],
      },
      {
        title: '5. Idempotencia y efectos secundarios',
        paragraphs: [
          'Una reanudación puede volver a entrar en una fase después de que el efecto externo ocurrió pero antes de guardar el checkpoint. Sin protección, el sistema podría enviar dos correos, crear dos pagos o duplicar un cambio.',
          'Las soluciones incluyen claves idempotentes, registros transaccionales, estados intermedios y verificación del efecto antes de reintentarlo.',
        ],
        goodExample: 'Before creating a payment, check the workflow operation key. If it already exists, reuse the recorded result instead of creating another payment.',
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'BEST persistence strategy: guardar tareas, outputs, pendientes y referencias.',
          'LEAST reliable: depender solo del historial conversacional.',
          'MOST important for safe retries: idempotencia o deduplicación.',
          'Al cambiar pocos archivos, reanalizar solo los cambios y reutilizar el estado previo.',
        ],
      },
    ],
    checklist: [
      '¿Sé qué fases ya terminaron?',
      '¿Los outputs tienen referencias y versiones?',
      '¿Las aprobaciones humanas quedan registradas?',
      '¿Los reintentos son idempotentes?',
      '¿El sistema puede verificar artefactos externos?',
      '¿La reanudación evita repetir trabajo válido?',
    ],
    summary: [
      'El estado durable es distinto del contexto del modelo.',
      'Los checkpoints registran progreso, outputs, evidencia, errores y pendientes.',
      'La reanudación debe continuar desde el último estado válido.',
      'Idempotencia y deduplicación evitan efectos secundarios repetidos.',
    ],
  },

  orchestration: {
    topicId: 'orchestration',
    readingMinutes: 19,
    difficulty: 4,
    objectives: [
      'Comparar patrones coordinator-worker, paralelo y secuencial.',
      'Elegir un patrón según dependencias, latencia y necesidad de síntesis.',
      'Entender el rol del coordinador y del agente de síntesis.',
      'Detectar sobreparalelización y cuellos de botella.',
    ],
    sections: [
      {
        title: '1. Qué es orquestar agentes',
        paragraphs: [
          'La orquestación define cómo se distribuyen tareas, herramientas, contexto y resultados entre agentes. No consiste simplemente en crear muchos subagentes.',
          'El patrón debe reflejar la estructura real del problema: qué puede hacerse en paralelo, qué depende de otro resultado y quién combina la evidencia.',
        ],
      },
      {
        title: '2. Coordinator-worker',
        paragraphs: [
          'Un coordinador descompone el objetivo, asigna trabajo a agentes especializados y sintetiza los resultados. Es útil cuando se necesita una visión global y roles claramente delimitados.',
          'El coordinador no debería hacer todo el trabajo especializado ni reenviar contexto irrelevante a cada worker.',
        ],
        diagram: ['Coordinator', '├─ Security worker', '├─ Performance worker', '├─ API worker', '└─ Test worker', '↓', 'Synthesis'],
      },
      {
        title: '3. Paralelo',
        paragraphs: [
          'El paralelismo reduce latencia cuando las tareas son independientes. Buscar en cuatro fuentes distintas o revisar módulos no relacionados puede ejecutarse al mismo tiempo.',
          'No debe usarse cuando una tarea necesita el output de otra. Enviar simultáneamente una consulta que requiere un account_id y la búsqueda que produce ese account_id genera fallos o contexto incompleto.',
        ],
      },
      {
        title: '4. Secuencial',
        paragraphs: [
          'Un pipeline secuencial es apropiado cuando cada etapa transforma o valida el resultado anterior. Por ejemplo: extraer datos, normalizarlos, validarlos y finalmente publicarlos.',
          'La secuencia facilita el control de dependencias, pero puede aumentar la latencia. Conviene paralelizar dentro de una fase cuando sea seguro.',
        ],
      },
      {
        title: '5. Agente de síntesis',
        paragraphs: [
          'Cuando varios agentes producen hallazgos, la síntesis debe deduplicar, conservar fuentes, señalar desacuerdos y construir una respuesta coherente.',
          'La síntesis no debería borrar incertidumbre ni presentar como consenso resultados incompatibles.',
        ],
        bullets: ['Preservar la fuente de cada hallazgo.', 'Resolver duplicados sin perder evidencia.', 'Separar hechos de inferencias.', 'Mantener desacuerdos explícitos.'],
      },
      {
        title: '6. Cómo elegir el patrón',
        bullets: [
          'Tareas independientes y urgentes → paralelo.',
          'Dependencia de datos → secuencial.',
          'Muchos especialistas con una respuesta final → coordinator-worker + síntesis.',
          'Acciones de alto riesgo → añadir checkpoints o aprobación humana.',
        ],
      },
      {
        title: '7. Trampas del examen',
        paragraphs: [
          'Más agentes no implica mejor solución. Cada agente añade coordinación, contexto, costo y posibles inconsistencias.',
          'La respuesta correcta suele ser el patrón más simple que respeta las dependencias y entrega suficiente cobertura.',
        ],
      },
    ],
    checklist: [
      '¿Las tareas son realmente independientes?',
      '¿Existe una dependencia de datos entre llamadas?',
      '¿Cada worker tiene un rol específico?',
      '¿Hay un responsable de sintetizar?',
      '¿La síntesis conserva fuentes e incertidumbre?',
      '¿El número de agentes está justificado por el problema?',
    ],
    summary: [
      'La estructura del problema determina la orquestación.',
      'Paralelo reduce latencia solo para tareas independientes.',
      'Secuencial respeta dependencias.',
      'Coordinator-worker permite especialización y una síntesis controlada.',
    ],
  },
}
