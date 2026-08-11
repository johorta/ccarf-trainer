import type { Question } from './data'

const q = (
  id: string,
  topicId: string,
  prompt: string,
  options: string[],
  answer: number,
  explanationEs: string,
): Question => ({ id, topicId, prompt, options, answer, explanationEs, vocabulary: {} })

export const challengingQuestionBank: Question[] = [
  q('hq1','parallel','An agent needs three independent API lookups before drafting a recommendation. Which execution plan is BEST?',[
    'Start all three lookups together, wait for their results, then produce the recommendation.',
    'Run the first lookup, summarize it, then decide whether the other two are still necessary.',
    'Ask one subagent to perform the three lookups sequentially so ordering remains deterministic.',
    'Draft the recommendation from existing context, then use the lookups only to confirm it.'
  ],0,'Las consultas son independientes, por lo que conviene paralelizarlas. La síntesis sí depende de que terminen todas.'),

  q('hq2','parallel','A second tool call requires an identifier produced by the first call. What should the orchestrator do?',[
    'Launch both calls together and let the second call retry until the identifier becomes available.',
    'Run the first call, pass its identifier into the second call, and then continue the workflow.',
    'Ask the model to predict the identifier so both calls can remain parallel.',
    'Replace both calls with one broader prompt even though the tools expose separate operations.'
  ],1,'Hay una dependencia de datos explícita. La segunda llamada debe esperar el identificador de la primera.'),

  q('hq3','subagent-prompts','A coordinator delegates an investigation after collecting logs, hypotheses, and constraints. Which prompt is MOST effective?',[
    'Restate only the incident title and let the subagent rediscover the supporting evidence independently.',
    'Provide the raw logs but omit previous hypotheses so the subagent is not influenced by earlier work.',
    'Provide the goal, evidence, prior findings, constraints, success criteria, and required output structure.',
    'Describe the goal and ask the subagent to return whenever additional context would improve confidence.'
  ],2,'Un subagente debe recibir el contexto suficiente para completar la tarea sin volver por información que el coordinador ya posee.'),

  q('hq4','delegation','A research task is open-ended, but the coordinator needs control over scope and progress. Which delegation style is BEST?',[
    'Give a fixed list of steps and prohibit changes even when later evidence invalidates an early assumption.',
    'Give the topic alone and allow the worker to choose any objective, scope, tools, and output format.',
    'Give exact commands to run but omit success criteria because the commands themselves define success.',
    'Give a goal, constraints, success criteria, and checkpoints while allowing the worker to adapt its approach.'
  ],3,'La delegación orientada a objetivos mantiene flexibilidad, mientras restricciones y checkpoints preservan control.'),

  q('hq5','state','A long-running workflow must resume safely after interruption. Which persisted state is MOST useful?',[
    'Completed work, pending work, outputs, dependencies, checkpoints, and retry or error information.',
    'The original request plus the most recent assistant message, without structured task status.',
    'A transcript of every intermediate message, without identifying which tasks are already complete.',
    'Only the final artifact paths, assuming the orchestrator can infer unfinished work from missing files.'
  ],0,'El estado debe permitir reconstruir qué terminó, qué falta y qué dependencias o errores siguen activos.'),

  q('hq6','review-architecture','A production permissions change is reversible but high impact and requires explicit approval. Which workflow is MOST appropriate?',[
    'Apply the change directly, then request human review only if monitoring later reports a problem.',
    'Separate analysis, proposed changes, human approval, execution, and post-change validation into clear phases.',
    'Run analysis and deployment concurrently so the reviewer can observe the change while it is happening.',
    'Use a single unrestricted agent because reversibility removes the need for staged controls.'
  ],1,'El impacto y la aprobación requerida justifican un flujo por fases, aunque técnicamente el cambio sea reversible.'),

  q('hq7','cicd','Claude Code runs in CI and may propose file changes. Which configuration BEST contains automation risk?',[
    'Allow broad repository writes but require the model to explain every modification before the job ends.',
    'Keep interactive mode enabled so the runner can pause whenever the model requests clarification.',
    'Use non-interactive execution with scoped permissions, timeouts, turn limits, and cost controls.',
    'Allow unlimited retries but restrict the final output format to a structured JSON response.'
  ],2,'Los límites de permisos, tiempo, turnos y costo controlan el comportamiento, no solo la forma de la salida.'),

  q('hq8','review-config','A code reviewer produces many valid observations that the project explicitly accepts by convention. What should be changed FIRST?',[
    'Increase the severity threshold so accepted patterns are still reported but appear less important.',
    'Increase temperature so the reviewer is less likely to repeat the same accepted observations.',
    'Remove repository-specific guidance so the reviewer focuses only on broadly applicable coding practices.',
    'Add the project conventions and accepted exceptions to persistent reviewer instructions and exclusion rules.'
  ],3,'Los falsos positivos se reducen enseñando al revisor las convenciones y excepciones reales del proyecto.'),

  q('hq9','test-generation','A generated test suite has high coverage but weak assertions. Which additional context is MOST useful?',[
    'Existing test conventions, expected behavior, important failure modes, fixtures, and meaningful edge cases.',
    'A target for more test methods, because a larger suite will naturally improve behavioral coverage.',
    'Permission to modify production code whenever an assertion is difficult to satisfy in the current design.',
    'A request to avoid existing tests so the generator is not constrained by previous testing approaches.'
  ],0,'La calidad depende de comportamientos y aserciones significativas, no solo de cantidad o cobertura superficial.'),

  q('hq10','configuration','A rule should apply only to files under src/payments/**/*.java, while general guidance applies everywhere. Which setup is BEST?',[
    'Put both instructions in CLAUDE.md and rely on the model to infer when the payment rule applies.',
    'Keep general guidance in CLAUDE.md and place the payment-specific rule in .claude/rules/ with a path glob.',
    'Put both instructions into a reusable Skill because Skills are the only persistent configuration mechanism.',
    'Store the payment-specific rule in an MCP resource and force the resource to load before every edit.'
  ],1,'Las reglas por ruta pertenecen a .claude/rules/; CLAUDE.md cubre orientación general persistente.'),

  q('hq11','exploration','You need to locate a configuration key in an unfamiliar repository with minimal unnecessary reading. Which sequence is BEST?',[
    'Read likely root files first, then use shell commands if the key is not found in those initial guesses.',
    'Run a repository-wide Bash script that prints every file before narrowing the search to likely locations.',
    'Use Glob to identify candidate files, Grep for the key, then Read only the relevant matching files.',
    'Use Read on the entire repository because content inspection is more reliable than search-based narrowing.'
  ],2,'La secuencia Glob → Grep → Read acota primero rutas, luego contenido y finalmente abre solo lo relevante.'),

  q('hq12','output-schema','Several subagents return findings that a coordinator must merge automatically. Which output design is MOST suitable?',[
    'Free-form prose with a concise conclusion, because the coordinator can infer fields from natural language.',
    'A Markdown table without stable identifiers, because tables are easier for humans to scan than JSON.',
    'Only a severity score and summary, because additional metadata increases context consumption unnecessarily.',
    'Structured findings with stable fields, source references, confidence or uncertainty, and summary metadata.'
  ],3,'La automatización downstream necesita estructura estable, referencias y metadatos suficientes para fusionar hallazgos.'),

  q('hq13','human-review','Human reviewers can inspect only 5% of extracted records. Which routing strategy BEST uses that capacity?',[
    'Prioritize low-confidence, ambiguous, unusual, conflicting, or high-risk records for human inspection.',
    'Review a uniform random sample so every record has exactly the same probability of being inspected.',
    'Review the longest records because length is the strongest general predictor of extraction difficulty.',
    'Review the records with the highest model confidence to verify that strong predictions remain consistent.'
  ],0,'La revisión humana debe concentrarse donde el riesgo y la incertidumbre son mayores, no distribuirse uniformemente.'),

  q('hq14','batches','A nightly job processes 100,000 independent records and nobody waits for an immediate response. Which API approach is BEST?',[
    'Send synchronous requests one at a time so each record can be validated before the next starts.',
    'Use Message Batches for deferred high-volume processing and collect results when the batch completes.',
    'Combine all records into one very large message so the model can reason across the whole nightly workload.',
    'Use an interactive Claude Code session so the operator can observe each classification as it finishes.'
  ],1,'Message Batches está diseñado para volumen asíncrono cuando la latencia interactiva no es necesaria.'),

  q('hq15','structured','A downstream service rejects any response that fails a required schema. Which method is MOST reliable?',[
    'Ask the model to return JSON and retry whenever the parser detects text outside the expected object.',
    'Prefill the first JSON delimiter and depend on the model to preserve the requested structure afterward.',
    'Use tool use with a JSON Schema and require the tool when that structured operation is mandatory.',
    'Generate natural-language output first and recover fields afterward with regular expressions and defaults.'
  ],2,'Tool use con JSON Schema es más confiable para estructura obligatoria; tool_choice puede exigir la llamada.'),

  q('hq16','schema','A source may omit secondary_phone, while cancellation_reason must exist but may be null. Which schema design is BEST?',[
    'Require both fields and use empty strings whenever the source does not provide a value.',
    'Make both fields optional because null and absence have equivalent meaning in structured extraction.',
    'Make secondary_phone nullable and cancellation_reason optional because both cases represent missing data.',
    'Make secondary_phone optional and allow cancellation_reason to explicitly accept null as a valid value.'
  ],3,'Optional y nullable representan estados distintos: campo ausente versus campo presente cuyo valor válido es null.'),

  q('hq17','truncation','A structured analysis repeatedly reaches the output token limit before completing. What should be changed FIRST?',[
    'Split the workload into smaller calls that each return valid structures, then merge the partial results deterministically.',
    'Remove the output schema so the model can compress the same information more freely in natural language.',
    'Increase the requested output length without changing input size, batching strategy, or result aggregation.',
    'Keep the same request and retry until one run happens to finish within the available output budget.'
  ],0,'Dividir y fusionar resultados parciales evita depender de una única salida demasiado grande.'),

  q('hq18','extraction','Documents contain multiple date formats and sometimes lack optional fields. Which prompt design BEST improves consistency?',[
    'Use a short extraction instruction and rely on the model to infer normalization from each individual document.',
    'Provide representative examples, explicit normalization rules, typed fields, and handling for missing values.',
    'Increase temperature so the model can adapt more creatively to the different date and field representations.',
    'Require every field and populate missing values with plausible defaults so the output always has the same shape.'
  ],1,'Ejemplos, normalización y representación explícita de ausencias reducen variabilidad sin inventar datos.'),

  q('hq19','false-positives','A reviewer repeatedly flags a pattern that is intentionally allowed in this repository. Which change is MOST effective?',[
    'Lower the maximum number of findings so repeated false positives are less likely to appear in the final response.',
    'Ask the reviewer to justify every finding in more detail while leaving project rules and exceptions unchanged.',
    'Document the accepted pattern and exclusion criteria in persistent project guidance used by the reviewer.',
    'Run the same review twice and keep only findings that appear in both independent executions.'
  ],2,'El problema es falta de contexto normativo del proyecto; documentar la excepción corrige la causa.'),

  q('hq20','boundaries','An extractor should return contractual obligations but not promotional claims. Which instruction is BEST?',[
    'Ask for all legally interesting content and let downstream logic remove anything that later appears promotional.',
    'Ask for obligations first and then request a second pass that removes items whose wording sounds promotional.',
    'Ask for important contract information without categories so the model can choose the most relevant material.',
    'Define included obligations, excluded promotional content, and representative boundary examples for ambiguous cases.'
  ],3,'Los límites explícitos de inclusión y exclusión reducen ruido y mejoran decisiones en casos fronterizos.'),

  q('hq21','builtin-tools','You know the exact path of a file and need to inspect a specific section. Which tool choice is MOST appropriate?',[
    'Use Read on the known file and request the relevant range rather than rediscovering its location.',
    'Use Glob first because every file operation should begin by locating the path again from a pattern.',
    'Use Grep across the repository because searching all files provides more context than reading the known file.',
    'Use Bash to print the repository tree and then open the file through a shell command for consistency.'
  ],0,'Con una ruta conocida, Read es la operación directa. Las búsquedas adicionales no agregan valor.'),

  q('hq22','tool-distribution','A synthesis worker only reads specialist findings and creates a final report. Which tool policy is BEST?',[
    'Give the worker the same write and deployment tools as specialists so it can correct issues it notices.',
    'Give only the read and reporting capabilities required for synthesis, withholding unrelated mutation tools.',
    'Give unrestricted shell access instead of several narrow tools because one general tool simplifies selection.',
    'Give no access to specialist outputs and ask the worker to reconstruct their findings from the original task.'
  ],1,'El mínimo privilegio reduce decisiones innecesarias y limita acciones fuera del rol.'),

  q('hq23','mcp-resources','An MCP server exposes a reference handbook and an operation that updates a customer record. How should they be modeled?',[
    'Expose both as resources because resources can represent both reference data and state-changing operations.',
    'Expose both as tools because tools provide the most consistent interface regardless of whether data changes.',
    'Expose the handbook as a resource and the customer update as a tool with clearly defined inputs.',
    'Expose the handbook as a tool and the customer update as a resource so writes cannot be invoked accidentally.'
  ],2,'Resources son apropiados para contenido de lectura; las acciones o mutaciones corresponden a tools.'),

  q('hq24','mcp-integration','An MCP server is configured but its tools are absent from the client. What should be verified FIRST?',[
    'Increase model context so the client has enough capacity to list all tools exposed by the server.',
    'Rewrite tool descriptions before checking connectivity because vague descriptions can prevent discovery entirely.',
    'Expose each resource as a tool so the discovery endpoint returns a larger and therefore easier-to-detect inventory.',
    'Verify scope, authentication, server configuration, connectivity, and tool discovery before changing tool design.'
  ],3,'Primero se valida la integración y el discovery; las descripciones no explican que las tools ni siquiera aparezcan.'),

  q('hq25','mcp-descriptions','Two MCP tools are frequently confused because their names are similar. Which description change is MOST helpful?',[
    'Describe when each tool should be used, required inputs, returned data, limits, and how it differs from the other tool.',
    'Shorten both descriptions to the same generic sentence so the model focuses mainly on the tool names.',
    'Remove descriptions of edge cases because additional detail can make tool selection less deterministic.',
    'Force both tools whenever either one might be useful and let downstream code discard the unnecessary result.'
  ],0,'Descripciones discriminativas reducen ambigüedad entre herramientas similares.'),

  q('hq26','tool-choice','A workflow must call a validation tool before it may accept extracted data. Which control is BEST?',[
    'Leave validation optional and ask the model to call it only when the extracted values appear suspicious.',
    'Require the validation tool at that stage with tool_choice after all required validation inputs are available.',
    'Force the validation tool at the start of the workflow even though the extracted values do not exist yet.',
    'Replace the validation call with a natural-language self-check so the workflow uses fewer external operations.'
  ],1,'tool_choice sirve para llamadas obligatorias, pero debe respetar la disponibilidad de inputs y el orden correcto.'),

  q('hq27','context-optimization','A long conversation is being compacted. Which information should receive HIGHEST retention priority?',[
    'Detailed transcripts of successful exploratory branches that no longer affect any remaining work.',
    'Repeated descriptions of already completed steps because they demonstrate how the final state was reached.',
    'Current goals, decisions, constraints, unresolved questions, pending work, and references needed to continue.',
    'Every tool response in full because later tasks may unexpectedly depend on any detail from the entire session.'
  ],2,'La compactación conserva el estado operativo necesario para continuar y elimina detalle histórico que ya no afecta pendientes.'),

  q('hq28','long-context','A week-long session contains many exploratory results but only a subset remains relevant. Which strategy is BEST?',[
    'Keep the complete transcript active because automatic attention will identify the small subset that still matters.',
    'Start a new session whenever context becomes large, discarding stored decisions to avoid carrying stale assumptions.',
    'Repeat a full repository summary each turn so older discoveries remain visible even when they are no longer relevant.',
    'Persist structured state externally and reload only relevant findings, decisions, and references when needed.'
  ],3,'Estado estructurado externo y recuperación selectiva controlan el crecimiento del contexto sin perder continuidad.'),

  q('hq29','synthesis','Two credible sources disagree about a key metric. Which final synthesis is MOST appropriate?',[
    'Report both values with source attribution, explain the disagreement, and state what remains uncertain.',
    'Average the two values because combining credible sources usually gives the most neutral estimate.',
    'Choose the newer source automatically because recency is always a stronger signal than methodological differences.',
    'Select the value that best supports the broader conclusion so the final report remains internally consistent.'
  ],0,'La síntesis debe preservar desacuerdos y atribución, no ocultarlos mediante promedio o selección arbitraria.'),

  q('hq30','specialized-review','One broad code-review pass consistently misses issues because it evaluates many unrelated concerns at once. Which redesign is BEST?',[
    'Add more examples to the same broad prompt while keeping all concerns competing within one evaluation pass.',
    'Run specialized passes for distinct concerns and combine their structured findings in a later synthesis step.',
    'Run the broad prompt several times and keep only findings that occur in a majority of the repeated responses.',
    'Remove project-specific context so each concern receives a simpler and more general set of review instructions.'
  ],1,'Las pasadas especializadas reducen competencia entre criterios y permiten una síntesis posterior.'),

  q('hq31','tool-schema','A tool cannot run without account_id but date_range is optional. Which input schema is BEST?',[
    'Make every field optional so the model can decide whether the tool truly requires each value in a given situation.',
    'Accept one free-form input string because the tool implementation can parse required and optional values itself.',
    'Require a typed account_id, define typed optional date fields, and document formats and relevant constraints.',
    'Require every possible field because stricter schemas always improve tool reliability even when values are unnecessary.'
  ],2,'El esquema debe reflejar requisitos reales y distinguir campos indispensables de opcionales.'),

  q('hq32','orchestration','Four independent specialists analyze different concerns and a coordinator combines their findings. Which pattern BEST describes this design?',[
    'A sequential dependency chain where each specialist must consume the previous specialist’s result before starting.',
    'A direct single-agent workflow where the coordinator itself performs each specialist analysis without delegation.',
    'A procedural subagent pattern where one worker repeats the same analysis four times using different prompts.',
    'Parallel specialist workers followed by a coordinator synthesis step that integrates their independent results.'
  ],3,'Las tareas independientes se paralelizan y luego se sintetizan en el coordinador.'),
]
