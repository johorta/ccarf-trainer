import type { Question } from './data'

const q = (
  id: string,
  topicId: string,
  prompt: string,
  options: string[],
  answer: number,
  explanationEs: string,
): Question => ({ id, topicId, prompt, options, answer, explanationEs, vocabulary: {} })

export const applicationQuestionBank: Question[] = [
  q('aq1','builtin-tools','You need a list of every file matching **/*.test.ts before inspecting any file contents. What would you use FIRST?',[
    'Grep, because the goal is to search for the text .test.ts inside source files.',
    'Read, because opening likely directories is the fastest way to discover matching filenames.',
    'Bash, because filename discovery should normally be delegated to shell commands.',
    'Glob, because the task is to locate files by a pathname pattern before reading content.'
  ],3,'Usarías Glob porque buscas nombres/rutas por patrón. Grep es para contenido y Read para archivos cuya ruta ya conoces.'),

  q('aq2','builtin-tools','You know the exact path config/retries.yaml and need to inspect lines around retry_limit. What would you use?',[
    'Read the known file and focus on the relevant range.',
    'Glob the repository again to rediscover the same known path.',
    'Run a recursive Grep over every file regardless of the known location.',
    'Use a general Bash crawler to enumerate directories before opening the file.'
  ],0,'Con una ruta exacta, usarías Read. No necesitas volver a descubrir el archivo.'),

  q('aq3','configuration','A team wants one instruction to apply only when Claude Code edits database migration files. What would you use?',[
    'A general CLAUDE.md instruction with no path condition.',
    'A .claude/rules/ rule scoped with a matching path glob.',
    'A reusable Skill that must be invoked manually for every migration.',
    'An MCP resource containing the same instruction as reference text.'
  ],1,'Usarías .claude/rules/ con un glob porque la regla depende de la ruta del archivo.'),

  q('aq4','configuration','A team repeatedly performs the same specialized release-audit procedure on demand. What would you use?',[
    'A path-specific rule that activates for every source file automatically.',
    'A global settings permission entry describing the release procedure in prose.',
    'A reusable Skill containing the procedure and expected output for invocation when needed.',
    'A static MCP resource that cannot represent a reusable task capability.'
  ],2,'Usarías una Skill para una capacidad reutilizable que se invoca cuando corresponde.'),

  q('aq5','configuration','A repository needs persistent project-wide coding guidance that should be available across sessions. What would you use?',[
    'A temporary user message repeated at the beginning of every session.',
    'A hook that runs after every tool call even though no automation is needed.',
    'A path-specific rule limited to one directory despite applying everywhere.',
    'CLAUDE.md containing the persistent repository guidance.'
  ],3,'Usarías CLAUDE.md para orientación persistente y general del repositorio.'),

  q('aq6','context-fork','You want a long dependency audit without filling the main coding context with intermediate exploration. What would you use?',[
    'An isolated context fork that returns only the relevant audit findings.',
    'The main session for every intermediate step so nothing is ever omitted.',
    'A larger output schema, because schemas automatically isolate context.',
    'A path glob, because restricting filenames also isolates conversational context.'
  ],0,'Usarías context: fork para aislar la tarea extensa y devolver solo lo relevante.'),

  q('aq7','parallel','You need weather, exchange-rate, and independent service-health data before making a decision. What execution strategy would you use?',[
    'Call each source sequentially so the model can reason after every individual result.',
    'Call the independent sources in parallel and synthesize once all results are available.',
    'Generate the decision first and call only the source that appears most likely to confirm it.',
    'Force all requests through one tool even when the operations expose separate interfaces.'
  ],1,'Usarías llamadas paralelas porque ninguna depende del resultado de otra.'),

  q('aq8','tool-choice','You must obtain account_id before a transaction tool can run. What execution strategy would you use?',[
    'Run both calls concurrently and allow the transaction request to retry until account_id exists.',
    'Force the transaction tool first so the model knows which account identifier it should search for.',
    'Run the account lookup first, then pass its returned account_id into the transaction tool.',
    'Ask the model to infer account_id from context so the two calls remain independent.'
  ],2,'Usarías ejecución secuencial porque la segunda tool necesita un dato producido por la primera.'),

  q('aq9','state','A workflow can be interrupted after processing thousands of records. What would you persist to support resume?',[
    'Only the user’s original request because the model can reconstruct processing state from the goal.',
    'Only completed output files because missing files are enough to infer all pending dependencies and retries.',
    'The complete chat transcript without explicit completed or pending task identifiers.',
    'Completed and pending items, outputs, dependencies, checkpoints, errors, and retry state.'
  ],3,'Persistirías estado estructurado suficiente para saber qué terminó y qué falta sin rehacer todo.'),

  q('aq10','review-architecture','You need to change production authorization rules and a human must approve the proposal before execution. What workflow would you use?',[
    'A multi-phase workflow separating analysis, proposal, human approval, execution, and validation.',
    'A direct write workflow followed by human review after the change has already reached production.',
    'A parallel workflow where approval and deployment happen at the same time to minimize latency.',
    'A single unrestricted worker because authorization changes are easier to revert than application code.'
  ],0,'Usarías un flujo por fases para asegurar que la aprobación ocurra antes de ejecutar.'),

  q('aq11','human-review','You can afford human review for only a small fraction of extracted documents. What routing would you use?',[
    'A uniform random sample so every document has the same chance of review regardless of risk.',
    'Risk-based routing that prioritizes low confidence, ambiguity, unusual inputs, and conflicting fields.',
    'Length-based routing because longer documents should always receive human review before shorter ones.',
    'Confidence-based routing that sends the highest-confidence records first to verify model consistency.'
  ],1,'Usarías revisión basada en riesgo e incertidumbre para aprovechar mejor la capacidad humana limitada.'),

  q('aq12','batches','You must classify 150,000 independent records overnight and nobody needs an immediate response. What would you use?',[
    'Individual synchronous Messages API requests issued one at a time from an interactive process.',
    'One very large message containing all records so the model can process the entire dataset at once.',
    'Message Batches for asynchronous high-volume work whose results can be collected later.',
    'An interactive Claude Code session that remains open until every record has been classified.'
  ],2,'Usarías Message Batches por volumen alto y ausencia de requisito de respuesta inmediata.'),

  q('aq13','structured','Another service will reject the result unless it exactly matches a required schema. What would you use?',[
    'Natural-language instructions asking for JSON, followed by regex cleanup when extra prose appears.',
    'A prefixed opening brace plus a larger max_tokens value so the model is encouraged to finish valid JSON.',
    'Free-form text that a downstream language model converts into the required schema afterward.',
    'Tool use with JSON Schema, requiring the tool when the structured operation is mandatory.'
  ],3,'Usarías tool use con JSON Schema y tool_choice si la llamada estructurada es obligatoria.'),

  q('aq14','truncation','A 500-file structured review repeatedly gets cut off before the JSON is complete. What would you do?',[
    'Split the files into smaller groups, validate each partial structure, and merge results deterministically.',
    'Remove the schema so a single response can express the same findings with fewer structural constraints.',
    'Retry the identical request until random variation produces a response that happens to fit the output limit.',
    'Add more files per call so the model can detect duplicate findings and reduce the total amount of output.'
  ],0,'Dividirías el trabajo en lotes y fusionarías resultados parciales válidos.'),

  q('aq15','schema','A middle_name may be absent, while cancellation_reason is always present but may explicitly be null. What schema would you use?',[
    'Make both required strings and replace missing information with an empty value.',
    'Make middle_name optional and allow cancellation_reason to be nullable.',
    'Make both nullable because absence and null are equivalent in structured schemas.',
    'Make middle_name nullable and cancellation_reason optional because both represent incomplete data.'
  ],1,'Usarías optional para posible ausencia y nullable para un campo presente cuyo valor puede ser null.'),

  q('aq16','mcp-resources','An MCP server must expose a large static policy handbook for agents to consult. What would you use?',[
    'A mutation tool, because all MCP capabilities should be invoked through executable operations.',
    'A forced tool call, because reference information must always be loaded before an agent can continue.',
    'An MCP resource, because the handbook is reference content that agents primarily need to read.',
    'A deployment hook, because static reference material should be refreshed whenever the client starts.'
  ],2,'Usarías un MCP resource porque es contenido de referencia para lectura.'),

  q('aq17','mcp-resources','An MCP server must submit a refund that changes external state. What would you expose?',[
    'A read-only resource that contains the refund parameters and lets the client infer the mutation.',
    'A prompt template only, because changing external state should not be represented as an MCP capability.',
    'A static resource plus documentation telling the model to simulate the state change in its response.',
    'A tool with explicit refund inputs, clear behavior, and appropriate authorization boundaries.'
  ],3,'Usarías una tool porque la operación realiza una acción y modifica estado externo.'),

  q('aq18','mcp-descriptions','The model confuses search_customer and get_customer. What would you change?',[
    'Clarify each tool’s use case, inputs, outputs, limits, and distinction from the other tool.',
    'Give both tools the same short description so the model relies mainly on their names.',
    'Remove input documentation because fewer details make the model’s selection more deterministic.',
    'Force both tools on every customer request and let the application ignore whichever result is unnecessary.'
  ],0,'Mejorarías las descripciones para que las tools sean claramente distinguibles.'),

  q('aq19','mcp-integration','You configured an MCP server but no tools appear in the client. What would you check FIRST?',[
    'Rewrite the tool prompts because poor wording is the most common reason tools are absent from discovery.',
    'Check scope, authentication, connection/configuration, and tool discovery before changing tool behavior.',
    'Convert all resources to tools so the client receives a larger capability list during discovery.',
    'Increase the model context window because clients may omit tools when the available context is too small.'
  ],1,'Primero revisarías integración, autenticación, scope y discovery, no la lógica de una tool aún invisible.'),

  q('aq20','false-positives','A reviewer flags a pattern that the repository explicitly allows. What would you change?',[
    'Lower the finding limit so the allowed pattern is less likely to fit into the final response.',
    'Run the review multiple times and keep only findings repeated by a majority of executions.',
    'Add the accepted pattern and exclusion criteria to persistent project guidance used by the reviewer.',
    'Remove project context so the reviewer follows only generic best practices that apply across repositories.'
  ],2,'Agregarías convenciones y exclusiones del proyecto para corregir la causa del falso positivo.'),

  q('aq21','specialized-review','One broad review pass keeps missing security issues while also checking style, logic, performance, and docs. What would you do?',[
    'Keep the broad pass and ask for more findings so security issues have more chances to appear in the output.',
    'Repeat the same broad review several times and merge every distinct observation from all executions.',
    'Remove project examples so the reviewer has more context budget for the five categories it already evaluates.',
    'Use specialized review passes for separate concerns and synthesize their structured findings afterward.'
  ],3,'Usarías pasadas especializadas para reducir competencia entre criterios y luego sintetizarías.'),

  q('aq22','context-optimization','A long session is approaching practical context limits but must continue accurately. What would you retain?',[
    'Goals, decisions, constraints, unresolved questions, pending work, and references needed for continuation.',
    'Every intermediate hypothesis and discarded exploration because any historical detail may become useful later.',
    'Only the most recent assistant response because newer text always contains the most relevant session state.',
    'Only tool outputs and no decisions, because structured state can always be inferred again from raw evidence.'
  ],0,'Retendrías el estado operativo que afecta el trabajo pendiente y resumirías o descartarías detalle irrelevante.'),

  q('aq23','synthesis','Two credible sources disagree and neither can yet be verified. What would you return?',[
    'The average of both values because averaging avoids appearing biased toward either credible source.',
    'Both values with source attribution, the disagreement, and an explicit statement of remaining uncertainty.',
    'The newer value only because recency should take precedence when two otherwise credible sources disagree.',
    'Whichever value supports the rest of the report so the final synthesis remains internally consistent.'
  ],1,'Conservarías ambos valores, atribución e incertidumbre en vez de ocultar el conflicto.'),

  q('aq24','tool-distribution','A synthesis subagent only reads finished findings and writes a final report. What tool access would you give it?',[
    'Every specialist tool, including mutation and deployment capabilities, so it can correct issues it discovers.',
    'A general shell tool instead of narrower tools because fewer tool names simplify the selection problem.',
    'Only the read and reporting capabilities needed for synthesis, withholding unrelated mutation tools.',
    'No access to worker outputs, because independent reconstruction reduces the risk of inheriting their mistakes.'
  ],2,'Darías solo las herramientas necesarias para su rol siguiendo mínimo privilegio.'),
]
