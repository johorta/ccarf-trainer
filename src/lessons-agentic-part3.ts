import type { LessonContent } from './lessons'

export const agenticLessonsPart3: Record<string, LessonContent> = {
  parallel: {
    topicId: 'parallel',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Distinguir tareas independientes de tareas con dependencia de datos.',
      'Explicar cuándo varias tool calls pueden emitirse en una misma iteración.',
      'Evaluar el beneficio de latencia frente al costo de coordinación.',
      'Reconocer trampas del examen que proponen paralelismo donde no corresponde.',
    ],
    sections: [
      {
        title: '1. La pregunta central: ¿una tarea necesita el resultado de otra?',
        paragraphs: [
          'Antes de decidir entre ejecución paralela o secuencial, identifica las dependencias. Dos tareas son independientes cuando ambas pueden comenzar usando únicamente el contexto ya disponible. Son dependientes cuando una necesita un dato producido por la otra.',
          'Esta distinción es más importante que la cantidad de herramientas, agentes o archivos involucrados. Cinco consultas independientes pueden ejecutarse juntas; dos consultas dependientes deben ejecutarse en orden.',
        ],
        diagram: ['Contexto disponible', '├─ Consulta A ─┐', '├─ Consulta B ─┼─ Síntesis', '└─ Consulta C ─┘', '', 'Cuenta → account_id → transacciones'],
      },
      {
        title: '2. Varias tool calls en una misma iteración',
        paragraphs: [
          'Un modelo puede solicitar varias herramientas en una sola respuesta cuando las llamadas no dependen entre sí. Los resultados se agregan al historial y el modelo los usa en la siguiente iteración para sintetizar o decidir nuevos pasos.',
          'El beneficio principal es reducir la latencia acumulada. Si cada consulta tarda dos segundos, ejecutarlas una por una puede sumar muchos segundos; ejecutarlas al mismo tiempo aproxima la espera al tiempo de la consulta más lenta.',
        ],
        goodExample: 'Retrieve weather, exchange rate, and public-holiday information in parallel, then combine the three results.',
        badExample: 'Call get_transactions before get_account has returned the required account_id.',
      },
      {
        title: '3. Paralelismo no significa ausencia de orden',
        paragraphs: [
          'Un workflow puede contener grupos paralelos dentro de una secuencia mayor. Primero se obtiene un identificador; después se ejecutan en paralelo varias consultas que utilizan ese identificador; finalmente se sintetizan los resultados.',
          'La arquitectura correcta suele parecerse a un grafo de dependencias, no a una elección global entre todo paralelo o todo secuencial.',
        ],
        diagram: ['Obtener customer_id', '↓', '├─ Consultar pagos', '├─ Consultar alertas', '└─ Consultar perfil', '↓', 'Evaluar riesgo'],
      },
      {
        title: '4. Cuándo el paralelismo puede ser perjudicial',
        bullets: [
          'Cuando una llamada necesita un campo que todavía no existe.',
          'Cuando varias acciones modifican el mismo recurso y pueden generar condiciones de carrera.',
          'Cuando existen límites estrictos de concurrencia, rate limits o costo.',
          'Cuando el volumen de resultados excede la capacidad de síntesis o contexto.',
          'Cuando una validación previa podría evitar llamadas costosas o irrelevantes.',
        ],
      },
      {
        title: '5. Independencia semántica versus independencia técnica',
        paragraphs: [
          'Dos APIs pueden aceptar llamadas simultáneas, pero eso no significa que el problema permita hacerlo. Por ejemplo, consultar inventario y reservar un producto son operaciones técnicamente separadas, aunque la reserva depende de haber validado disponibilidad y reglas de negocio.',
          'El examen suele evaluar la dependencia lógica del escenario, no solamente si la infraestructura soporta concurrencia.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'BEST way to minimize latency para consultas independientes: ejecutarlas en paralelo y sintetizar después.',
          'MUST be sequential: la segunda llamada requiere un ID o valor producido por la primera.',
          'LEAST appropriate use of parallel calls: acciones que modifican el mismo estado sin coordinación.',
          'PRIMARY benefit: reducir latencia total, no aumentar automáticamente la precisión.',
        ],
      },
    ],
    checklist: [
      '¿Cada tarea puede comenzar con el contexto actual?',
      '¿Alguna llamada produce el input requerido por otra?',
      '¿Las acciones escriben sobre el mismo recurso?',
      '¿Existen límites de concurrencia, costo o contexto?',
      '¿La síntesis ocurre después de recibir todos los resultados necesarios?',
      '¿El paralelismo realmente reduce latencia sin introducir riesgo?',
    ],
    summary: [
      'Las tareas independientes pueden emitirse como varias tool calls en una misma iteración.',
      'Una dependencia de datos obliga a ejecutar en secuencia.',
      'Un workflow puede combinar fases secuenciales y grupos paralelos.',
      'El principal beneficio del paralelismo es reducir latencia acumulada.',
      'Concurrencia sobre estado compartido requiere coordinación adicional.',
    ],
  },

  'session-resumption': {
    topicId: 'session-resumption',
    readingMinutes: 17,
    difficulty: 4,
    objectives: [
      'Explicar cómo reanudar una sesión reutilizando hallazgos y decisiones válidas.',
      'Distinguir estado persistido de contexto conversacional completo.',
      'Aplicar análisis incremental sobre archivos, datos o tareas modificadas.',
      'Identificar cuándo un cambio invalida resultados previos.',
    ],
    sections: [
      {
        title: '1. Reanudar no es empezar de nuevo',
        paragraphs: [
          'La reanudación de sesión busca continuar desde un estado conocido después de una interrupción, un límite de contexto o una pausa humana. El sistema carga decisiones, hallazgos, tareas completadas, pendientes y referencias necesarias.',
          'Volver a ejecutar todo desde cero desperdicia tiempo y puede introducir conclusiones distintas sin una razón válida. La estrategia correcta es reutilizar resultados que siguen vigentes y revisar únicamente lo que cambió o quedó incompleto.',
        ],
      },
      {
        title: '2. Qué estado debe sobrevivir',
        bullets: [
          'Objetivo y criterios de éxito vigentes.',
          'Tareas completadas, pendientes y bloqueadas.',
          'Hallazgos estructurados y sus fuentes.',
          'Decisiones tomadas y razones importantes.',
          'Versiones, hashes o timestamps de los artefactos analizados.',
          'Errores, reintentos, aprobaciones y próximos pasos.',
        ],
      },
      {
        title: '3. Análisis incremental',
        paragraphs: [
          'Si una revisión anterior cubrió cien archivos y solo cambiaron tres, la reanudación debe identificar esos tres archivos, reanalizarlos y actualizar los hallazgos relacionados. Los resultados de archivos sin cambios pueden conservarse.',
          'Para lograrlo, el estado necesita metadatos que permitan comprobar vigencia: commit SHA, hash del archivo, versión del documento o timestamp de actualización.',
        ],
        goodExample: 'Load prior findings from commit A, compare against commit B, reanalyze changed files, then update only affected conclusions.',
        badExample: 'Discard every prior finding and reread the entire repository after a one-line documentation change.',
      },
      {
        title: '4. Cuándo invalidar resultados anteriores',
        paragraphs: [
          'La reutilización no debe ser ciega. Un cambio en una dependencia central, un esquema, una política o una premisa puede invalidar conclusiones que parecen no relacionadas directamente.',
          'El sistema debe evaluar impacto: qué artefactos cambiaron, qué conclusiones dependían de ellos y qué tareas necesitan repetirse. Esta relación entre evidencia y conclusión es otra razón para conservar referencias de fuente.',
        ],
      },
      {
        title: '5. Contexto compacto para la nueva sesión',
        paragraphs: [
          'Reanudar no requiere copiar cada mensaje anterior. Una representación compacta puede contener estado estructurado, resumen de decisiones y enlaces a artefactos persistidos.',
          'El objetivo es reconstruir el contexto operativo, no reproducir literalmente toda la conversación. Esto reduce tokens y evita que detalles antiguos compitan con información actual.',
        ],
        diagram: ['Historial extenso', '↓ resumir y estructurar', 'Estado actual', '├─ decisiones', '├─ hallazgos + fuentes', '├─ pendientes', '└─ versiones', '↓', 'Nueva sesión'],
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'BEST resumption strategy: cargar estado previo y reanalizar solo cambios relevantes.',
          'MOST useful metadata: versiones, hashes o timestamps que permiten validar vigencia.',
          'LEAST efficient approach: descartar hallazgos y repetir todo sin comprobar cambios.',
          'PRIMARY purpose of persisted state: continuar de forma confiable, no conservar cada token.',
        ],
      },
    ],
    checklist: [
      '¿Sé qué tareas estaban completas y cuáles pendientes?',
      '¿Los hallazgos conservan referencias a sus fuentes?',
      '¿Puedo detectar qué artefactos cambiaron?',
      '¿Evalué si un cambio invalida conclusiones dependientes?',
      '¿La nueva sesión recibe un estado compacto y suficiente?',
      '¿Evito repetir trabajo que sigue siendo válido?',
    ],
    summary: [
      'Session resumption reutiliza estado válido y revisa cambios relevantes.',
      'El estado debe incluir progreso, hallazgos, decisiones, fuentes y versiones.',
      'Los metadatos permiten decidir qué resultados siguen vigentes.',
      'Una nueva sesión necesita contexto operativo compacto, no el historial completo.',
      'Cambios centrales pueden invalidar conclusiones indirectas y deben analizarse por impacto.',
    ],
  },

  'subagent-tools': {
    topicId: 'subagent-tools',
    readingMinutes: 17,
    difficulty: 4,
    objectives: [
      'Aplicar el principio de mínimo privilegio al diseño de subagentes.',
      'Diferenciar herramientas necesarias, convenientes e innecesarias.',
      'Relacionar permisos, contexto y system prompt con el rol delegado.',
      'Reconocer riesgos de entregar todas las herramientas a todos los agentes.',
    ],
    sections: [
      {
        title: '1. Cada subagente necesita un alcance propio',
        paragraphs: [
          'Un subagente especializado debe recibir únicamente el contexto y las herramientas requeridas para cumplir su función. Un revisor de seguridad necesita leer y buscar; no necesariamente necesita editar archivos, ejecutar despliegues o acceder a secretos.',
          'Restringir herramientas reduce la superficie de error, simplifica la selección de acciones y hace más claro qué resultados puede producir el agente.',
        ],
      },
      {
        title: '2. Principio de mínimo privilegio',
        paragraphs: [
          'El mínimo privilegio significa conceder el conjunto más pequeño de capacidades que permite completar la tarea. No significa impedir el trabajo ni eliminar herramientas útiles por defecto.',
          'La pregunta práctica es: si retiro esta herramienta, ¿el agente todavía puede satisfacer los criterios de éxito? Si la respuesta es sí, probablemente no necesita ese permiso.',
        ],
        goodExample: 'Code-review agent: Read, Glob, Grep. No Edit, no deployment tools, no production credentials.',
        badExample: 'Give every worker repository write access, shell execution, cloud administration, and production secrets for convenience.',
      },
      {
        title: '3. Herramientas, contexto y prompt deben coincidir',
        paragraphs: [
          'No basta con restringir herramientas si el prompt pide una acción imposible. Un agente definido como read-only no debe recibir el objetivo de corregir y publicar cambios. Del mismo modo, un agente que debe ejecutar tests necesita una herramienta apropiada y rutas autorizadas.',
          'El diseño correcto alinea objetivo, permisos, contexto, límites y formato de salida.',
        ],
        diagram: ['Rol', '↓', 'Objetivo', '↓', 'Contexto necesario', '↓', 'Herramientas mínimas', '↓', 'Salida permitida'],
      },
      {
        title: '4. Beneficios adicionales de restringir herramientas',
        bullets: [
          'Menos opciones irrelevantes durante la decisión del modelo.',
          'Menor riesgo de acciones fuera de rol.',
          'Auditoría más simple de lo que cada agente puede hacer.',
          'Separación clara entre análisis, aprobación y ejecución.',
          'Menor exposición de credenciales y recursos sensibles.',
        ],
      },
      {
        title: '5. Separación de funciones',
        paragraphs: [
          'En workflows de mayor riesgo, un agente puede preparar una recomendación, otro validarla y un componente separado ejecutar la acción después de una aprobación. Esta separación evita que el mismo agente detecte, apruebe y aplique su propia propuesta sin control.',
          'Las restricciones de herramientas son una forma técnica de imponer esa arquitectura.',
        ],
      },
      {
        title: '6. Cómo aparece en el examen',
        bullets: [
          'BEST tool set para un revisor: herramientas de lectura y búsqueda, no escritura innecesaria.',
          'PRIMARY benefit: reducir riesgo y complejidad de decisión.',
          'LEAST appropriate configuration: todos los agentes con todas las herramientas y credenciales.',
          'MOST important alignment: objetivo, herramientas autorizadas y salida esperada deben ser compatibles.',
        ],
      },
    ],
    checklist: [
      '¿Cada herramienta contribuye directamente al criterio de éxito?',
      '¿El agente puede modificar recursos que solo debería revisar?',
      '¿Las credenciales están limitadas al recurso y alcance necesarios?',
      '¿El prompt solicita acciones compatibles con los permisos?',
      '¿La salida del agente respeta su función dentro del workflow?',
      '¿Las acciones sensibles están separadas de la revisión y aprobación?',
    ],
    summary: [
      'Los subagentes deben recibir herramientas según su rol, no según las capacidades del coordinador.',
      'El mínimo privilegio reduce riesgo y opciones irrelevantes.',
      'Objetivo, contexto, permisos y salida deben estar alineados.',
      'La separación de funciones evita que un solo agente controle todo el proceso.',
      'Restringir herramientas también mejora auditoría y claridad operacional.',
    ],
  },

  'spawn-diagnostics': {
    topicId: 'spawn-diagnostics',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Diagnosticar por qué un subagente no se crea, no inicia o no puede actuar.',
      'Separar errores de definición, parámetros, permisos, contexto y wiring.',
      'Aplicar un orden de diagnóstico basado en evidencia.',
      'Evitar cambios irrelevantes de modelo o temperatura antes de revisar configuración.',
    ],
    sections: [
      {
        title: '1. Tipos de fallo al iniciar un subagente',
        paragraphs: [
          'Un problema de spawning puede ocurrir antes de crear el agente, durante su inicialización o cuando intenta ejecutar su primera acción. El síntoma orienta el diagnóstico.',
          'Si el agente no aparece, revisa definición y registro. Si aparece pero rechaza la tarea, revisa parámetros y prompt. Si entiende la tarea pero no puede usar una herramienta, revisa permisos y configuración de herramientas.',
        ],
      },
      {
        title: '2. Orden recomendado de diagnóstico',
        bullets: [
          'Confirmar que la definición del agente existe y está registrada con el identificador correcto.',
          'Validar parámetros obligatorios, tipos y nombres de campos.',
          'Comprobar que el coordinador referencia la definición esperada.',
          'Revisar herramientas autorizadas y credenciales necesarias.',
          'Inspeccionar contexto inicial, system prompt y límites.',
          'Consultar logs, eventos y errores de la primera acción.',
        ],
        diagram: ['No inicia', '↓', '¿Definición registrada?', '↓', '¿Parámetros válidos?', '↓', '¿Wiring correcto?', '↓', '¿Permisos suficientes?', '↓', '¿Primera acción falla?'],
      },
      {
        title: '3. Definition y wiring',
        paragraphs: [
          'La definición describe el rol, instrucciones, herramientas y configuración del subagente. El wiring conecta esa definición con el coordinador y con los recursos que necesita.',
          'Un nombre mal escrito, una referencia a una versión antigua o un registro omitido puede impedir la creación aunque el prompt sea correcto.',
        ],
        badExample: 'The coordinator requests security-reviewer-v2, but only security-reviewer is registered.',
      },
      {
        title: '4. Parámetros y contrato de entrada',
        paragraphs: [
          'El coordinador debe entregar los campos requeridos en el formato esperado. Un agente puede existir correctamente y aun así fallar porque falta repository, task, sourceIds o algún parámetro obligatorio.',
          'Los errores de contrato deben resolverse en el límite entre coordinador y subagente, no aumentando el contexto o cambiando la creatividad del modelo.',
        ],
      },
      {
        title: '5. Permisos y herramientas',
        paragraphs: [
          'Si el agente inicia pero no puede leer un archivo o invocar una herramienta, revisa autorización, scope, credenciales y disponibilidad de la tool. El hecho de que el coordinador tenga acceso no implica que el subagente herede ese acceso.',
          'El objetivo es distinguir una restricción deliberada de una configuración incompleta. Agregar todas las herramientas puede ocultar el problema y crear un riesgo mayor.',
        ],
        goodExample: 'The review agent starts, receives the task, then logs “Read tool not authorized”. Fix the agent tool allowlist rather than changing temperature.',
      },
      {
        title: '6. Por qué modelo y temperatura no son el primer diagnóstico',
        paragraphs: [
          'Modelo y temperatura pueden afectar calidad o variabilidad, pero normalmente no explican que una definición no exista, un parámetro falte o una herramienta esté bloqueada.',
          'El examen suele ofrecer estos cambios como distractores. Primero se revisan los componentes deterministas de configuración y conexión.',
        ],
      },
      {
        title: '7. Cómo aparece en el examen',
        bullets: [
          'Agent does not start: revisar definición, registro, parámetros y wiring.',
          'Agent starts but cannot call Read: revisar permisos y tool allowlist.',
          'LEAST useful first action: aumentar temperatura o cambiar de modelo sin inspeccionar configuración.',
          'BEST diagnostic evidence: logs y error exacto de la etapa donde falla.',
        ],
      },
    ],
    checklist: [
      '¿La definición existe y usa el identificador correcto?',
      '¿Todos los parámetros obligatorios están presentes y bien tipados?',
      '¿El coordinador está conectado a la versión correcta del agente?',
      '¿Las herramientas están registradas y autorizadas?',
      '¿Las credenciales y scopes corresponden al subagente?',
      '¿Los logs indican si el fallo ocurre al crear, inicializar o ejecutar?',
      '¿Evité cambiar variables irrelevantes antes de identificar la causa?',
    ],
    summary: [
      'El síntoma determina si debes revisar definición, entrada, wiring o permisos.',
      'Un subagente no necesariamente hereda las herramientas del coordinador.',
      'Los contratos de entrada deben validarse en el límite de delegación.',
      'Logs y errores de la primera acción son evidencia central.',
      'Cambiar temperatura o modelo rara vez corrige errores deterministas de configuración.',
    ],
  },
}
