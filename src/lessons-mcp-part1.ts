import type { LessonContent } from './lessons'

export const mcpLessonsPart1: Record<string, LessonContent> = {
  'builtin-tools': {
    topicId: 'builtin-tools',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Elegir entre Glob, Grep, Read y Bash según la operación requerida.',
      'Reducir exploración innecesaria usando una secuencia incremental.',
      'Reconocer cuándo Bash es apropiado y cuándo añade riesgo o ruido.',
      'Evitar confundir búsqueda por ruta con búsqueda por contenido.',
    ],
    sections: [
      {
        title: '1. Cada herramienta responde una pregunta distinta',
        paragraphs: [
          'Glob responde “¿qué archivos coinciden con este patrón de nombre o ruta?”. Grep responde “¿en qué archivos aparece este texto o expresión?”. Read responde “¿qué contiene exactamente este archivo?”. Bash ejecuta comandos cuando una herramienta especializada no cubre la operación.',
          'La elección correcta reduce costo, latencia y contexto. Usar Bash para todo suele producir más salida, exige interpretar comandos y amplía innecesariamente los permisos.',
        ],
        diagram: ['Necesito localizar archivos → Glob', 'Necesito buscar texto → Grep', 'Necesito inspeccionar contenido → Read', 'Necesito ejecutar una operación no cubierta → Bash'],
      },
      {
        title: '2. La secuencia incremental recomendada',
        paragraphs: [
          'En exploración de repositorios conviene comenzar amplio pero barato. Primero localiza candidatos por ruta, luego busca ocurrencias relevantes y finalmente lee solo los archivos necesarios.',
          'Este patrón evita cargar directorios completos en contexto y mantiene trazabilidad sobre por qué se abrió cada archivo.',
        ],
        goodExample: 'Glob("**/*.yaml") → Grep("timeout", yamlFiles) → Read(candidates)',
        badExample: 'Bash("cat $(find . -type f)")',
      },
      {
        title: '3. Cuándo Bash sí aporta valor',
        bullets: [
          'Ejecutar una prueba, compilación o linter del proyecto.',
          'Invocar una herramienta de línea de comandos específica del repositorio.',
          'Realizar una transformación que no tiene herramienta incorporada equivalente.',
          'Obtener evidencia de comportamiento en ejecución.',
        ],
      },
      {
        title: '4. Trampas frecuentes del examen',
        bullets: [
          'Glob no busca texto dentro de archivos.',
          'Grep no sustituye a Read cuando necesitas interpretar contexto completo.',
          'Read no debe usarse para abrir todo el repositorio indiscriminadamente.',
          'Bash no es “más poderoso” si existe una herramienta más precisa y segura.',
        ],
      },
    ],
    checklist: [
      'Puedo distinguir búsqueda por ruta, por contenido y lectura directa.',
      'Puedo justificar una secuencia Glob → Grep → Read.',
      'Puedo explicar por qué Bash debe reservarse para operaciones necesarias.',
    ],
    summary: [
      'Glob localiza archivos; Grep localiza contenido; Read inspecciona; Bash ejecuta.',
      'La exploración incremental reduce contexto y ruido.',
      'La mejor herramienta es la más específica que resuelve la operación.',
    ],
  },

  'tool-distribution': {
    topicId: 'tool-distribution',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Aplicar mínimo privilegio a herramientas de agentes y subagentes.',
      'Separar capacidades de lectura, análisis y modificación.',
      'Reducir errores de selección al limitar el catálogo visible.',
      'Diseñar permisos coherentes con responsabilidad y riesgo.',
    ],
    sections: [
      {
        title: '1. Más herramientas no siempre significa más capacidad útil',
        paragraphs: [
          'Un agente con demasiadas herramientas debe decidir entre opciones irrelevantes o similares. Esto aumenta ambigüedad y puede provocar acciones fuera de su rol.',
          'La distribución correcta entrega solo las herramientas necesarias para alcanzar el objetivo. Un agente de síntesis puede recibir resultados estructurados sin acceso a escritura; un agente de despliegue necesita capacidades diferentes a un revisor.',
        ],
      },
      {
        title: '2. Diseñar por rol y por impacto',
        bullets: [
          'Investigador: lectura, búsqueda y consulta de fuentes.',
          'Revisor: lectura y validación, normalmente sin modificación.',
          'Implementador: edición limitada a rutas o recursos autorizados.',
          'Aprobador: inspección de cambios y decisión explícita.',
          'Ejecutor de producción: acciones estrictamente acotadas y auditables.',
        ],
        diagram: ['Objetivo del agente', '↓', 'Acciones necesarias', '↓', 'Herramientas mínimas', '↓', 'Restricciones por alcance', '↓', 'Auditoría y aprobación'],
      },
      {
        title: '3. Separar lectura y escritura',
        paragraphs: [
          'Una arquitectura segura evita entregar herramientas mutantes a agentes que solo deben analizar. Incluso si una herramienta de escritura no se usa normalmente, su mera disponibilidad amplía el impacto potencial de una decisión equivocada.',
          'Cuando una tarea requiere proponer y ejecutar, puede separarse en dos fases: un agente prepara el plan y otro, tras validación, realiza el cambio.',
        ],
      },
      {
        title: '4. Señales de una distribución deficiente',
        bullets: [
          'Todos los agentes reciben el mismo conjunto de herramientas.',
          'Un sintetizador puede borrar o modificar fuentes.',
          'Las credenciales de producción están disponibles durante exploración.',
          'No existe diferencia entre herramientas de lectura y acciones irreversibles.',
          'El alcance se define por comodidad y no por necesidad.',
        ],
      },
    ],
    checklist: [
      'Puedo mapear cada rol a sus acciones necesarias.',
      'Puedo justificar por qué una herramienta no debe estar disponible.',
      'Puedo separar propuesta, aprobación y ejecución.',
    ],
    summary: [
      'El mínimo privilegio mejora seguridad y calidad de decisión.',
      'Las herramientas deben distribuirse por rol, alcance e impacto.',
      'Lectura, modificación y ejecución irreversible deben tratarse por separado.',
    ],
  },

  'mcp-resources': {
    topicId: 'mcp-resources',
    readingMinutes: 19,
    difficulty: 4,
    objectives: [
      'Distinguir MCP resources de MCP tools.',
      'Elegir la representación según si el servidor expone contenido o una acción.',
      'Entender por qué una lectura pasiva no debe modelarse como operación mutante.',
      'Diseñar acceso recuperable sin cargar todo el contenido por adelantado.',
    ],
    sections: [
      {
        title: '1. Resources exponen información; tools realizan operaciones',
        paragraphs: [
          'Un resource representa contenido que el cliente puede descubrir y leer: documentación, catálogos, configuraciones, esquemas o archivos. Una tool representa una operación invocable con inputs definidos: consultar un sistema, crear un registro o ejecutar una acción.',
          'La diferencia no depende de si la información es importante, sino de la interacción esperada. Un manual grande sigue siendo resource si solo debe leerse. Una búsqueda dinámica con parámetros puede ser tool porque ejecuta una consulta.',
        ],
      },
      {
        title: '2. Pregunta de decisión',
        diagram: ['¿El cliente necesita leer contenido identificable?', '├─ Sí → Resource', '└─ No', '   ¿Debe invocar una operación con parámetros?', '   └─ Sí → Tool'],
        bullets: [
          'Resource: contenido direccionable y recuperable.',
          'Tool: operación con contrato de entrada y resultado.',
          'Una misma integración puede ofrecer ambos.',
        ],
      },
      {
        title: '3. Beneficios de usar resources correctamente',
        bullets: [
          'El contenido puede descubrirse y cargarse solo cuando sea relevante.',
          'Se evita disfrazar lectura como una acción potencialmente riesgosa.',
          'Los identificadores de recursos facilitan procedencia y recuperación.',
          'El agente no necesita recibir todo el corpus en el prompt inicial.',
        ],
      },
      {
        title: '4. Casos límite',
        paragraphs: [
          'Un catálogo estático puede ser resource. Una búsqueda del catálogo por filtros puede ser tool. Un archivo de política es resource, mientras que aprobar una excepción es tool.',
          'El examen suele presentar distractores donde cualquier acceso remoto se modela como tool. La respuesta correcta depende de contenido frente a acción, no de que exista un servidor MCP.',
        ],
      },
    ],
    checklist: [
      'Puedo explicar la diferencia entre contenido y operación.',
      'Puedo modelar un manual como resource y una mutación como tool.',
      'Puedo identificar integraciones que necesitan ambos mecanismos.',
    ],
    summary: [
      'Resources exponen contenido; tools ejecutan operaciones.',
      'La representación correcta mejora seguridad, descubrimiento y eficiencia.',
      'No todo lo remoto debe convertirse en tool.',
    ],
  },

  'mcp-integration': {
    topicId: 'mcp-integration',
    readingMinutes: 21,
    difficulty: 5,
    objectives: [
      'Configurar una integración MCP considerando alcance, autenticación y discovery.',
      'Evitar secretos embebidos y configuraciones demasiado globales.',
      'Verificar que el cliente realmente descubre las capacidades esperadas.',
      'Diagnosticar fallas diferenciando transporte, credenciales y permisos.',
    ],
    sections: [
      {
        title: '1. Una integración no está lista solo porque el servidor existe',
        paragraphs: [
          'Para que una integración MCP sea utilizable, el cliente debe conocer cómo conectarse, qué alcance tiene la configuración, cómo autenticarse y qué capacidades puede descubrir.',
          'Configurar una URL o comando sin verificar discovery deja una integración potencialmente invisible. Del mismo modo, que una herramienta aparezca no garantiza que tenga permisos para ejecutar una operación real.',
        ],
      },
      {
        title: '2. Orden recomendado de configuración',
        diagram: ['1. Elegir alcance', '2. Configurar transporte o comando', '3. Proveer credenciales de forma segura', '4. Verificar conexión', '5. Confirmar resources/tools descubiertos', '6. Ejecutar una prueba de mínimo riesgo'],
      },
      {
        title: '3. Alcance de la configuración',
        bullets: [
          'Usuario: disponible para varios proyectos cuando realmente corresponde.',
          'Proyecto: compartido por el repositorio y sus colaboradores.',
          'Local: específico de una máquina o entorno.',
          'Entorno de CI: credenciales y permisos propios de automatización.',
        ],
        paragraphs: [
          'Usar alcance global por comodidad puede exponer herramientas en repositorios que no las necesitan. El alcance debe ser tan estrecho como permita el caso de uso.',
        ],
      },
      {
        title: '4. Autenticación y secretos',
        bullets: [
          'No hardcodear tokens en archivos versionados.',
          'Usar variables de entorno o un gestor de secretos.',
          'Separar credenciales por ambiente.',
          'Limitar scopes y rotar secretos comprometidos.',
          'No registrar tokens en logs de diagnóstico.',
        ],
      },
      {
        title: '5. Diagnóstico por capas',
        bullets: [
          'El servidor no inicia: revisar comando, ruta y dependencias.',
          'El cliente no conecta: revisar transporte, puerto y red.',
          'Conecta pero no descubre: revisar protocolo, configuración y exposición.',
          'Descubre pero falla al invocar: revisar esquema, credenciales y permisos.',
          'Funciona localmente pero no en CI: revisar secretos y alcance del entorno.',
        ],
      },
    ],
    checklist: [
      'Puedo elegir alcance de usuario, proyecto, local o CI.',
      'Puedo explicar cómo proteger credenciales.',
      'Puedo verificar discovery y ejecutar una prueba controlada.',
      'Puedo diagnosticar la integración por capas.',
    ],
    summary: [
      'Una integración MCP requiere alcance, transporte, autenticación y verificación.',
      'Discovery debe comprobarse explícitamente.',
      'Los secretos y permisos deben ser mínimos y específicos por entorno.',
    ],
  },

  'mcp-descriptions': {
    topicId: 'mcp-descriptions',
    readingMinutes: 18,
    difficulty: 4,
    objectives: [
      'Escribir descripciones de tools que permitan elegir correctamente.',
      'Diferenciar herramientas similares mediante propósito y límites.',
      'Describir inputs, precondiciones y efectos relevantes.',
      'Reducir invocaciones incorrectas y argumentos inventados.',
    ],
    sections: [
      {
        title: '1. La descripción es parte del contrato operativo',
        paragraphs: [
          'El modelo usa nombre, descripción y esquema para decidir si una tool es adecuada. Una descripción vaga como “manage users” no indica si la herramienta busca, crea, actualiza o elimina usuarios.',
          'Una descripción útil explica cuándo usar la herramienta, qué resultado entrega, qué límites tiene y cómo se diferencia de opciones cercanas.',
        ],
      },
      {
        title: '2. Componentes de una buena descripción',
        bullets: [
          'Verbo y propósito concreto.',
          'Precondiciones o identificadores requeridos.',
          'Efectos secundarios, especialmente si modifica datos.',
          'Restricciones de alcance y límites de resultados.',
          'Diferencia frente a herramientas similares.',
          'Significado de los campos ambiguos.',
        ],
        goodExample: 'search_users: Search users by email, name, or organization. Returns up to 50 summaries. Use get_user when an exact user ID is already known. This tool does not modify accounts.',
        badExample: 'users: Useful for user stuff.',
      },
      {
        title: '3. El esquema también comunica intención',
        paragraphs: [
          'Nombres de campos precisos, enums y restricciones ayudan al modelo a construir inputs válidos. Un parámetro llamado value sin descripción obliga a inferir demasiado.',
          'La descripción y el JSON Schema deben ser coherentes. Si la descripción dice que un campo es opcional pero el esquema lo marca required, el contrato es contradictorio.',
        ],
      },
      {
        title: '4. Herramientas similares necesitan fronteras explícitas',
        bullets: [
          'search_user frente a get_user.',
          'preview_change frente a apply_change.',
          'list_transactions frente a export_transactions.',
          'create_draft frente a send_message.',
        ],
        paragraphs: [
          'Las fronteras claras reducen decisiones erróneas y permiten reservar herramientas de mayor impacto para cuando realmente se cumplen las precondiciones.',
        ],
      },
    ],
    checklist: [
      'Puedo describir cuándo usar y cuándo no usar una tool.',
      'Puedo diferenciar herramientas similares.',
      'Puedo documentar efectos secundarios y límites.',
    ],
    summary: [
      'La descripción guía la selección de herramientas.',
      'Debe incluir propósito, inputs, límites y diferencias.',
      'Descripción y esquema deben formar un contrato coherente.',
    ],
  },

  'tool-choice': {
    topicId: 'tool-choice',
    readingMinutes: 20,
    difficulty: 5,
    objectives: [
      'Entender cuándo forzar una tool y cuándo permitir elección automática.',
      'Ordenar llamadas según dependencias de datos.',
      'Distinguir paralelismo seguro de secuenciación obligatoria.',
      'Evitar forzar una herramienta incompatible con la tarea.',
    ],
    sections: [
      {
        title: '1. tool_choice controla una decisión, no corrige un mal diseño',
        paragraphs: [
          'Forzar una tool es apropiado cuando el contrato del sistema exige esa invocación, por ejemplo para producir un objeto estructurado o ejecutar una operación obligatoria. No debe usarse para ocultar descripciones ambiguas o un catálogo mal diseñado.',
          'Cuando varias herramientas podrían ser correctas según el contenido, permitir selección automática conserva flexibilidad. Forzar una opción incorrecta puede producir argumentos artificiales o una acción inadecuada.',
        ],
      },
      {
        title: '2. Regla de dependencia',
        paragraphs: [
          'Dos llamadas pueden ejecutarse en paralelo solo si ninguna necesita el resultado de la otra. Si la primera obtiene un identificador requerido por la segunda, la secuencia es obligatoria.',
        ],
        diagram: ['¿La llamada B necesita output de A?', '├─ Sí → A y luego B', '└─ No → pueden ejecutarse en paralelo'],
        goodExample: 'find_account(email) → get_transactions(account_id)',
        badExample: 'find_account(email) y get_transactions(account_id desconocido) en paralelo',
      },
      {
        title: '3. Casos donde forzar tiene sentido',
        bullets: [
          'El sistema requiere una salida estructurada específica.',
          'La política obliga a ejecutar una validación antes de continuar.',
          'El usuario solicitó explícitamente una acción concreta y autorizada.',
          'Existe una única operación válida para completar la fase actual.',
        ],
      },
      {
        title: '4. Casos donde no conviene forzar',
        bullets: [
          'El modelo debe decidir si necesita una herramienta.',
          'Varias tools son posibles dependiendo de evidencia aún no conocida.',
          'La invocación puede producir un efecto secundario innecesario.',
          'El problema real es una descripción o esquema ambiguo.',
        ],
      },
      {
        title: '5. Secuencias robustas',
        paragraphs: [
          'Cada resultado debe validarse antes de alimentar la siguiente llamada. Obtener un ID no significa que sea válido o que corresponda al objeto correcto. Las secuencias de alto impacto requieren validaciones y, cuando corresponda, aprobación humana antes de la acción final.',
        ],
      },
    ],
    checklist: [
      'Puedo justificar cuándo usar tool_choice obligatorio.',
      'Puedo detectar dependencias de datos entre llamadas.',
      'Puedo distinguir paralelismo de secuencia.',
      'Puedo añadir validaciones antes de acciones de alto impacto.',
    ],
    summary: [
      'Forzar una tool solo es correcto cuando la invocación es realmente obligatoria.',
      'Las dependencias de datos determinan la secuencia.',
      'Llamadas independientes pueden paralelizarse; llamadas dependientes no.',
    ],
  },
}
