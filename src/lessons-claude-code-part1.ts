import type { LessonContent } from './lessons'

export const claudeCodeLessonsPart1: Record<string, LessonContent> = {
  cicd: {
    topicId: 'cicd',
    readingMinutes: 21,
    difficulty: 5,
    objectives: [
      'Diseñar una ejecución no interactiva segura para CI/CD.',
      'Explicar por qué deben existir límites de turnos, costo, tiempo y permisos.',
      'Distinguir entre análisis automatizado y modificación automatizada.',
      'Reconocer configuraciones que pueden producir automatización fuera de control.',
    ],
    sections: [
      {
        title: '1. Qué cambia cuando Claude Code se ejecuta en CI/CD',
        paragraphs: [
          'En una sesión local existe una persona observando la ejecución, respondiendo preguntas y deteniendo acciones inesperadas. En CI/CD, el proceso debe poder comenzar, trabajar y terminar sin interacción humana inmediata.',
          'Por eso la confiabilidad no depende solo de un buen prompt. También depende de límites operativos, permisos mínimos, entradas reproducibles, salida estructurada y condiciones claras de éxito o fallo.',
        ],
        diagram: ['Commit o pull request', '↓', 'Job no interactivo', '├─ contexto controlado', '├─ permisos mínimos', '├─ límites de ejecución', '└─ salida estructurada', '↓', 'Resultado del pipeline'],
      },
      {
        title: '2. Ejecución no interactiva',
        paragraphs: [
          'Una ejecución no interactiva no debe quedarse esperando una aclaración. El job necesita recibir objetivo, alcance, restricciones y formato de salida suficientemente completos para terminar de forma determinista.',
          'Si falta información crítica, el comportamiento esperado debe estar definido: fallar con un mensaje estructurado, producir un resultado parcial marcado como incompleto o detenerse antes de una acción sensible.',
        ],
        goodExample: 'Analyze changed files only. Return JSON findings with severity, file, line, evidence, and recommendation. Do not modify the repository.',
        badExample: 'Review the project and do whatever is necessary. Ask me questions if something is unclear.',
      },
      {
        title: '3. Límites contra ejecuciones fuera de control',
        paragraphs: [
          'Un agente puede entrar en ciclos de exploración, reintentos o correcciones sucesivas. En una estación local, una persona puede detenerlo. En CI/CD, el workflow debe imponer límites antes de iniciar.',
          'Los límites habituales controlan cantidad de iteraciones, duración, costo, volumen de archivos, número de reintentos y alcance de herramientas. El objetivo no es reducir calidad arbitrariamente, sino garantizar que el job tenga un consumo predecible.',
        ],
        bullets: [
          'Límite de turnos o iteraciones.',
          'Timeout total del job.',
          'Presupuesto o límite de consumo.',
          'Cantidad máxima de archivos o hallazgos.',
          'Reintentos acotados y con causa registrada.',
          'Condición explícita para detenerse al cumplir el objetivo.',
        ],
      },
      {
        title: '4. Permisos y alcance',
        paragraphs: [
          'Un job de revisión no necesita los mismos permisos que un job de corrección. El primero puede limitarse a lectura y búsqueda. El segundo puede necesitar escritura en una rama temporal, pero no acceso directo a producción.',
          'La configuración segura separa lectura, propuesta, aprobación y ejecución. Incluso cuando se permite modificar archivos, el alcance debe restringirse a rutas y operaciones concretas.',
        ],
        goodExample: 'Read the repository and write only under src/generated-tests/. Never push, deploy, or access production credentials.',
        badExample: 'Grant repository administration and cloud production permissions to every CI review job.',
      },
      {
        title: '5. Salida estructurada para sistemas posteriores',
        paragraphs: [
          'La salida de CI suele ser consumida por otro sistema: una anotación de pull request, una política de aprobación, un dashboard o un paso posterior. La prosa libre dificulta esa integración.',
          'Un esquema estable permite validar el resultado, distinguir éxito de ejecución de ausencia de hallazgos y procesar errores sin interpretar texto ambiguo.',
        ],
        bullets: [
          'status: success, partial o failed.',
          'findings: colección estructurada.',
          'summary: descripción breve para humanos.',
          'errors: fallos de herramientas o datos faltantes.',
          'usage o execution metadata cuando sea necesario para auditoría.',
        ],
      },
      {
        title: '6. Reproducibilidad y contexto',
        paragraphs: [
          'El job debe indicar qué commit, diff, reglas y configuración analizó. Sin esos metadatos, dos ejecuciones aparentemente iguales pueden producir resultados difíciles de comparar.',
          'Conviene entregar solo el contexto relevante: cambios del pull request, estándares aplicables y archivos de soporte necesarios. Cargar todo el repositorio sin estrategia aumenta tiempo, costo y ruido.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST CI setup: ejecución no interactiva, límites de costo/turnos y permisos mínimos.',
          'MOST important protection against runaway automation: límites operativos y condición de término.',
          'LEAST appropriate configuration: permisos irrestrictos, reintentos infinitos y ausencia de timeout.',
          'BEST output for downstream automation: estructura validable, no prosa libre únicamente.',
        ],
      },
    ],
    checklist: [
      '¿El job puede terminar sin preguntas interactivas?',
      '¿El objetivo y el alcance están definidos?',
      '¿Existen límites de turnos, tiempo, costo y reintentos?',
      '¿Las herramientas y rutas autorizadas son mínimas?',
      '¿La salida diferencia éxito, resultado parcial y fallo?',
      '¿Se registra qué commit, diff y reglas fueron analizados?',
      '¿Las acciones sensibles requieren una fase o aprobación separada?',
    ],
    summary: [
      'CI/CD requiere ejecución no interactiva y predecible.',
      'Los límites operativos evitan ciclos y consumo fuera de control.',
      'Los permisos deben corresponder exactamente al trabajo del job.',
      'La salida estructurada permite integración y validación downstream.',
      'La reproducibilidad exige registrar versión, alcance y configuración analizada.',
    ],
  },

  'review-config': {
    topicId: 'review-config',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Configurar revisiones que utilicen estándares reales del proyecto.',
      'Diseñar herramientas y permisos apropiados para un revisor automático.',
      'Construir una salida consumible por desarrolladores y automatizaciones.',
      'Reducir falsos positivos causados por prompts genéricos.',
    ],
    sections: [
      {
        title: '1. Una revisión útil necesita contexto del proyecto',
        paragraphs: [
          'Un revisor genérico puede detectar patrones comunes, pero también marcar decisiones aceptadas por la arquitectura o ignorar convenciones locales. La configuración debe cargar las reglas que realmente gobiernan el repositorio.',
          'Esas reglas pueden incluir estilo, seguridad, límites entre módulos, patrones de errores, convenciones de tests, archivos excluidos y criterios de severidad.',
        ],
      },
      {
        title: '2. Diferenciar reglas persistentes de instrucciones de una revisión',
        paragraphs: [
          'Las reglas estables del proyecto deben vivir en mecanismos persistentes de configuración. El prompt de una revisión concreta describe el cambio, el objetivo y cualquier criterio temporal.',
          'Mezclar todo en un prompt enorme vuelve difícil mantener estándares y puede provocar contradicciones entre revisiones.',
        ],
        diagram: ['Configuración persistente', '├─ estándares', '├─ convenciones', '└─ exclusiones', '+', 'Contexto de la revisión', '├─ diff', '├─ objetivo', '└─ riesgos específicos'],
      },
      {
        title: '3. Herramientas de un revisor',
        paragraphs: [
          'Un revisor necesita localizar archivos, buscar referencias y leer implementaciones relacionadas. Normalmente no necesita modificar el código para identificar un hallazgo.',
          'Entregar herramientas de escritura a un agente cuya única función es revisar aumenta riesgo y confunde la separación entre detectar y corregir.',
        ],
        goodExample: 'Reviewer tools: Glob, Grep, Read. Return findings only. Do not edit or execute deployment commands.',
        badExample: 'Reviewer may change any file, push directly, and deploy fixes before reporting findings.',
      },
      {
        title: '4. Alcance de revisión',
        paragraphs: [
          'Revisar únicamente las líneas modificadas puede omitir efectos en consumidores, interfaces o tests. Revisar todo el repositorio en cada cambio puede ser demasiado costoso. El alcance debe incluir el diff y el contexto relacionado necesario.',
          'Una estrategia común comienza por archivos modificados y expande la lectura hacia definiciones, usos, tests y reglas relevantes cuando aparecen dependencias.',
        ],
      },
      {
        title: '5. Formato de hallazgos',
        paragraphs: [
          'Cada hallazgo debe ser verificable y accionable. Una observación vaga como “this may be unsafe” no explica la evidencia ni el impacto.',
          'Una estructura consistente ayuda a ordenar por severidad, deduplicar y publicar anotaciones en líneas específicas.',
        ],
        bullets: [
          'severity: nivel según criterios definidos.',
          'title: descripción breve del problema.',
          'file y line: ubicación verificable.',
          'evidence: comportamiento observado.',
          'impact: consecuencia probable.',
          'recommendation: corrección propuesta.',
          'confidence: incertidumbre cuando corresponde.',
        ],
      },
      {
        title: '6. Falsos positivos y exclusiones',
        paragraphs: [
          'Las revisiones mejoran cuando conocen patrones aceptados y casos que no deben reportarse. Las exclusiones deben ser específicas y justificadas; no deben ocultar categorías completas de riesgo.',
          'Los ejemplos de hallazgos válidos e inválidos ayudan a calibrar el criterio del revisor mejor que una instrucción genérica para “ser menos estricto”.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'BEST configuration: estándares reales, herramientas mínimas y salida estructurada.',
          'MOST likely cause of repeated false positives: ausencia de convenciones y exclusiones del proyecto.',
          'LEAST appropriate output: prosa libre sin archivo, línea ni evidencia.',
          'BEST review scope: diff más contexto relacionado, no necesariamente todo el repositorio.',
        ],
      },
    ],
    checklist: [
      '¿La revisión carga estándares y convenciones reales?',
      '¿Las reglas persistentes están separadas del prompt temporal?',
      '¿El agente tiene herramientas de lectura y no permisos innecesarios?',
      '¿El alcance incluye dependencias relevantes del cambio?',
      '¿Cada hallazgo tiene ubicación, evidencia, impacto y recomendación?',
      '¿Las exclusiones están justificadas y son específicas?',
      '¿La salida puede ser procesada por el sistema posterior?',
    ],
    summary: [
      'La calidad de revisión depende del contexto real del repositorio.',
      'Las reglas persistentes no deben repetirse manualmente en cada prompt.',
      'Un revisor suele necesitar lectura y búsqueda, no escritura.',
      'Los hallazgos deben ser estructurados, verificables y accionables.',
      'Convenciones y ejemplos reducen falsos positivos.',
    ],
  },

  'test-generation': {
    topicId: 'test-generation',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Entregar el contexto necesario para generar tests útiles.',
      'Distinguir cobertura conductual de cantidad superficial de tests.',
      'Usar fixtures y convenciones existentes para mantener consistencia.',
      'Detectar aserciones triviales y tests acoplados a implementación.',
    ],
    sections: [
      {
        title: '1. Generar tests no es generar líneas de código',
        paragraphs: [
          'El objetivo de un test es detectar una regresión significativa. Una gran cantidad de tests con aserciones triviales puede aumentar métricas sin proteger comportamiento real.',
          'La generación automática debe comenzar por comprender contratos, casos límite, invariantes y errores esperados.',
        ],
      },
      {
        title: '2. Contexto que mejora la generación',
        bullets: [
          'Código bajo prueba y sus dependencias relevantes.',
          'Tests existentes que muestran estilo y convenciones.',
          'Fixtures, builders, mocks y utilidades permitidas.',
          'Comportamientos esperados y casos límite.',
          'Reglas sobre nombres, estructura y aislamiento.',
          'Comandos de test y criterios de aceptación.',
        ],
        goodExample: 'Use the existing PaymentFixture builder, follow the naming style in PaymentServiceTest, and cover duplicate requests, timeout handling, and successful persistence.',
        badExample: 'Generate as many tests as possible for this class.',
      },
      {
        title: '3. Cobertura conductual',
        paragraphs: [
          'La cobertura conductual verifica resultados visibles: valores devueltos, efectos persistidos, errores, llamadas necesarias y ausencia de efectos indebidos. No busca probar cada línea interna de forma aislada.',
          'Los tests demasiado acoplados a métodos privados o secuencias internas se rompen durante refactors aunque el comportamiento siga correcto.',
        ],
      },
      {
        title: '4. Casos límite y clases de equivalencia',
        paragraphs: [
          'En vez de enumerar entradas arbitrarias, conviene identificar categorías: vacío, límite mínimo, límite máximo, duplicado, dato inválido, dependencia fallida y resultado exitoso.',
          'Los ejemplos del proyecto muestran qué categorías son relevantes para el dominio. Un sistema de pagos, por ejemplo, suele requerir idempotencia, moneda, precisión y estados transitorios.',
        ],
      },
      {
        title: '5. Aserciones de calidad',
        paragraphs: [
          'Una aserción debe demostrar el comportamiento importante. Verificar solamente que el resultado “no sea null” suele ser insuficiente cuando existe un contrato más específico.',
          'También deben evitarse tests que no pueden fallar, que duplican exactamente la implementación o que validan mocks en lugar del resultado del sistema.',
        ],
        goodExample: 'Assert the payment remains in PENDING state after a retryable timeout and that no duplicate external request is sent.',
        badExample: 'Assert that the service object is not null.',
      },
      {
        title: '6. Ejecución y refinamiento',
        paragraphs: [
          'Los tests generados deben compilar y ejecutarse. Los errores reales del runner sirven como feedback específico para una segunda iteración.',
          'El refinamiento debe corregir causas concretas: fixture incorrecto, aserción equivocada, mock innecesario o convención violada. Pedir simplemente “improve the tests” ofrece poca señal.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'MOST useful context: tests existentes, fixtures, comportamiento esperado y casos límite.',
          'LEAST useful instruction: maximizar la cantidad de tests.',
          'BEST criterion: proteger contratos y regresiones, no solo elevar cobertura.',
          'MOST likely problem with trivial assertions: no validan el comportamiento relevante.',
        ],
      },
    ],
    checklist: [
      '¿Definí los comportamientos que deben protegerse?',
      '¿Incluí tests y fixtures existentes como referencia?',
      '¿Identifiqué casos límite y errores esperados?',
      '¿Las aserciones demuestran resultados concretos?',
      '¿Los tests evitan depender de detalles privados innecesarios?',
      '¿Compilan y se ejecutan con el comando real del proyecto?',
      '¿El refinamiento utiliza errores específicos en lugar de feedback vago?',
    ],
    summary: [
      'La calidad de tests depende del contexto y de los contratos del sistema.',
      'Fixtures y tests existentes enseñan convenciones reales.',
      'Cobertura útil protege comportamiento, no cantidad de líneas.',
      'Las aserciones triviales ofrecen poca protección contra regresiones.',
      'Ejecutar y refinar con feedback concreto es parte esencial del proceso.',
    ],
  },

  exploration: {
    topicId: 'exploration',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Explorar un repositorio de forma incremental y dirigida.',
      'Elegir correctamente entre Glob, Grep y Read.',
      'Reducir consumo de contexto evitando lecturas masivas prematuras.',
      'Construir un mapa del código antes de proponer cambios.',
    ],
    sections: [
      {
        title: '1. Explorar de amplio a específico',
        paragraphs: [
          'Una exploración eficiente comienza localizando candidatos, continúa buscando símbolos o texto relevante y termina leyendo los archivos que realmente contienen información útil.',
          'Abrir grandes cantidades de archivos al inicio consume contexto y dificulta reconocer relaciones importantes.',
        ],
        diagram: ['Pregunta', '↓', 'Glob: ¿dónde están los archivos?', '↓', 'Grep: ¿dónde aparece el concepto?', '↓', 'Read: ¿cómo funciona el código relevante?', '↓', 'Mapa y conclusión'],
      },
      {
        title: '2. Glob para nombres y rutas',
        paragraphs: [
          'Glob localiza archivos mediante patrones de nombre o ruta. Es apropiado para encontrar configuraciones, tests, controladores o archivos con una extensión concreta.',
          'No inspecciona el contenido semántico. Encontrar todos los archivos YAML no revela cuáles contienen una clave específica.',
        ],
        goodExample: 'Use Glob to locate **/*.yaml and **/*Payment*Test.java.',
        badExample: 'Use Glob to find every occurrence of the text timeout inside files.',
      },
      {
        title: '3. Grep para contenido',
        paragraphs: [
          'Grep busca apariciones de texto, símbolos o patrones dentro de archivos. Permite localizar definiciones, usos, claves de configuración y mensajes de error.',
          'Los resultados sirven para reducir el conjunto antes de abrir archivos completos.',
        ],
        goodExample: 'Use Grep to find occurrences of payment.timeout or calls to createPayment.',
      },
      {
        title: '4. Read para inspección detallada',
        paragraphs: [
          'Read se utiliza cuando ya existe una razón para abrir un archivo. Conviene leer rangos relevantes o archivos completos cuando su tamaño es manejable y el contexto lo requiere.',
          'Después de leer una definición, puede ser necesario volver a Grep para localizar consumidores, implementaciones o tests relacionados. La exploración es iterativa, no una secuencia rígida de una sola pasada.',
        ],
      },
      {
        title: '5. Cuándo usar Bash',
        paragraphs: [
          'Bash es útil para comandos del proyecto, ejecución de tests o transformaciones que no tienen una herramienta incorporada más precisa. No debe sustituir automáticamente a herramientas especializadas de búsqueda y lectura.',
          'Las herramientas incorporadas suelen ofrecer resultados más estructurados, mejor control de permisos y menor riesgo que comandos generales.',
        ],
      },
      {
        title: '6. Construir un mapa del cambio',
        bullets: [
          'Archivo o símbolo principal.',
          'Entradas y salidas públicas.',
          'Consumidores y dependencias.',
          'Configuración relacionada.',
          'Tests existentes.',
          'Convenciones o reglas aplicables.',
          'Riesgos de modificación y validaciones necesarias.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'FIRST tool para localizar archivos por patrón: Glob.',
          'BEST tool para buscar texto o símbolos: Grep.',
          'NEXT step después de reducir candidatos: Read.',
          'LEAST efficient approach: leer todo el repositorio antes de formular una hipótesis.',
          'BEST use of Bash: comando necesario sin una herramienta incorporada más apropiada.',
        ],
      },
    ],
    checklist: [
      '¿Comencé con una pregunta o hipótesis concreta?',
      '¿Usé Glob para rutas y Grep para contenido?',
      '¿Abrí solamente los archivos con señal relevante?',
      '¿Busqué consumidores, tests y configuración relacionados?',
      '¿Reservé Bash para operaciones que realmente lo requieren?',
      '¿Construí un mapa antes de modificar código?',
      '¿Puedo explicar por qué cada archivo leído era necesario?',
    ],
    summary: [
      'La exploración eficiente va de amplio a específico.',
      'Glob localiza rutas; Grep busca contenido; Read inspecciona archivos.',
      'Leer todo prematuramente consume contexto y añade ruido.',
      'La exploración puede alternar búsqueda y lectura según nuevos hallazgos.',
      'Un mapa de dependencias y tests debe preceder a cambios importantes.',
    ],
  },
}
