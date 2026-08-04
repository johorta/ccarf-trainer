export type Priority = 'high' | 'medium' | 'low'

export interface Topic {
  id: string
  name: string
  reportScore: number
  priority: Priority
  lesson: string
}

export interface Question {
  id: string
  topicId: string
  prompt: string
  options: string[]
  answer: number
  explanationEs: string
  vocabulary: Record<string, string>
}

export const topics: Topic[] = [
  { id: 'parallel', name: 'Multiple Tool Calls', reportScore: 0, priority: 'high', lesson: 'Tareas independientes pueden ejecutarse en paralelo; las dependientes deben ser secuenciales.' },
  { id: 'subagent-prompts', name: 'Complete Subagent Prompts', reportScore: 0, priority: 'high', lesson: 'Incluye objetivo, hallazgos previos, datos estructurados, fuentes, restricciones y formato de salida.' },
  { id: 'delegation', name: 'Goal-oriented vs Procedural Delegation', reportScore: 0, priority: 'high', lesson: 'Usa objetivos cuando el agente necesita adaptarse y procedimientos cuando el proceso debe ser rígido.' },
  { id: 'state', name: 'State Persistence', reportScore: 0, priority: 'high', lesson: 'Guarda checkpoints, resultados, pendientes y referencias para poder reanudar sin repetir trabajo.' },
  { id: 'structured', name: 'Structured Outputs', reportScore: 0, priority: 'high', lesson: 'Cuando el esquema es crítico, usa tool use con JSON Schema y tool_choice.' },
  { id: 'batches', name: 'Messages API vs Message Batches', reportScore: 25, priority: 'high', lesson: 'Messages API para respuestas inmediatas; Batches para alto volumen asíncrono.' },
  { id: 'schema', name: 'Optional, Nullable and Enum Schemas', reportScore: 33, priority: 'high', lesson: 'Representa ausencia o ambigüedad con optional, nullable y enums apropiados; no inventes valores.' },
  { id: 'tools', name: 'Grep, Glob, Read and Bash', reportScore: 60, priority: 'medium', lesson: 'Glob encuentra rutas; Grep busca contenido; Read inspecciona archivos; Bash cubre operaciones de shell.' },
  { id: 'mcp', name: 'MCP Resources vs Tools', reportScore: 100, priority: 'low', lesson: 'Resources exponen contenido; tools realizan acciones o consultas.' },
  { id: 'context', name: 'Context Management', reportScore: 100, priority: 'low', lesson: 'Usa resúmenes, estado estructurado y retención selectiva para mantener sesiones largas.' },
]

export const questions: Question[] = [
  {
    id: 'q1', topicId: 'subagent-prompts',
    prompt: 'A coordinator has already extracted findings from several reports. Which prompt BEST enables a subagent to finish without returning for missing context?',
    options: ['Provide only the task title.', 'Provide findings, structured data, source metadata, constraints, and the required output.', 'Provide the raw reports but omit prior findings.', 'Ask the subagent to request anything it needs.'],
    answer: 1,
    explanationEs: 'La opción B entrega un prompt autocontenido y evita trabajo repetido o nuevas consultas al coordinador.',
    vocabulary: { best: 'mejor', findings: 'hallazgos', omit: 'omitir' },
  },
  {
    id: 'q2', topicId: 'parallel',
    prompt: 'Five independent lookups are required before a final summary. Which execution plan minimizes latency?',
    options: ['Run every lookup sequentially.', 'Run the lookups in parallel, then summarize.', 'Summarize before the lookups.', 'Increase max_tokens.'],
    answer: 1,
    explanationEs: 'Las búsquedas son independientes y pueden ejecutarse en paralelo; la síntesis depende de todas.',
    vocabulary: { lookups: 'consultas', before: 'antes de', minimizes: 'minimiza' },
  },
  {
    id: 'q3', topicId: 'delegation',
    prompt: 'A research subagent must adapt as new evidence appears while the coordinator retains visibility. Which style is MOST appropriate?',
    options: ['A rigid procedure with no deviation.', 'A goal-oriented instruction with success criteria and checkpoints.', 'No instructions beyond the topic.', 'A fixed file list that cannot change.'],
    answer: 1,
    explanationEs: 'La orientación a objetivos permite adaptación y los checkpoints mantienen control del coordinador.',
    vocabulary: { while: 'mientras', retains: 'mantiene', checkpoints: 'puntos de control' },
  },
  {
    id: 'q4', topicId: 'state',
    prompt: 'A long-running multi-agent workflow may be interrupted. What should be persisted for reliable resumption?',
    options: ['Only the original request.', 'Completed task IDs, outputs, checkpoints, pending work, and source references.', 'Only the final summary.', 'Only model settings.'],
    answer: 1,
    explanationEs: 'Para reanudar se necesita saber qué terminó, qué falta y qué evidencia ya existe.',
    vocabulary: { pending: 'pendiente', reliable: 'confiable', resumption: 'reanudación' },
  },
  {
    id: 'q5', topicId: 'structured',
    prompt: 'A downstream system fails unless every response strictly matches a JSON schema. Which method is MOST reliable?',
    options: ['Request JSON only in natural language.', 'Use tool use with a JSON schema and force the tool when needed.', 'Parse free-form prose with regular expressions.', 'Prefill an opening brace.'],
    answer: 1,
    explanationEs: 'Tool use con JSON Schema ofrece mayor cumplimiento estructural; tool_choice puede forzar la invocación.',
    vocabulary: { unless: 'a menos que', strictly: 'estrictamente', reliable: 'confiable' },
  },
  {
    id: 'q6', topicId: 'batches',
    prompt: 'A company must process 50,000 documents overnight and does not need immediate responses. Which API mode is MOST appropriate?',
    options: ['Synchronous Messages API.', 'Asynchronous Message Batches API.', 'One extremely large prompt.', 'Interactive Claude Code sessions.'],
    answer: 1,
    explanationEs: 'Message Batches es adecuado para alto volumen asíncrono cuando la respuesta inmediata no es necesaria.',
    vocabulary: { overnight: 'durante la noche', immediate: 'inmediato', appropriate: 'adecuado' },
  },
  {
    id: 'q7', topicId: 'schema',
    prompt: 'A document may omit a middle name or contain an ambiguous status. How should the schema represent this?',
    options: ['Require every field and invent defaults.', 'Use optional or nullable fields and a constrained enum with an unknown state when appropriate.', 'Store everything as unrestricted strings.', 'Reject the document.'],
    answer: 1,
    explanationEs: 'Optional, nullable y enums apropiados permiten representar ausencia o ambigüedad sin inventar datos.',
    vocabulary: { omit: 'omitir', ambiguous: 'ambiguo', constrained: 'restringido' },
  },
  {
    id: 'q8', topicId: 'tools',
    prompt: 'Which built-in tool should be used FIRST to locate all YAML files under a repository?',
    options: ['Grep', 'Glob', 'Read', 'Bash'],
    answer: 1,
    explanationEs: 'Glob localiza archivos por patrón de nombre o ruta.',
    vocabulary: { first: 'primero', locate: 'ubicar', under: 'dentro de' },
  },
  {
    id: 'q9', topicId: 'mcp',
    prompt: 'A server exposes a large reference manual that agents only need to read. How should it usually be exposed?',
    options: ['As an MCP resource.', 'As a destructive MCP tool.', 'As a shell command.', 'As a forced tool call.'],
    answer: 0,
    explanationEs: 'El contenido para lectura corresponde a un resource; las acciones corresponden a tools.',
    vocabulary: { exposes: 'expone', usually: 'normalmente', reference: 'referencia' },
  },
  {
    id: 'q10', topicId: 'context',
    prompt: 'A conversation is exceeding practical context limits. Which strategy is MOST appropriate?',
    options: ['Keep every token forever.', 'Use summaries, structured state, selective retention, and sliding windows.', 'Increase temperature.', 'Repeat the full conversation each turn.'],
    answer: 1,
    explanationEs: 'La optimización conserva el estado útil y elimina detalles no necesarios.',
    vocabulary: { exceeding: 'superando', retention: 'retención', sliding: 'deslizante' },
  },
]
