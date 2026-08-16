import type { Question } from './data'

const q = (
  id: string,
  topicId: string,
  prompt: string,
  options: string[],
  answer: number,
  explanationEs: string,
): Question => ({ id, topicId, prompt, options, answer, explanationEs, vocabulary: {} })

// Harder scenario questions modelled after the style of the user's recent mock exams:
// long scenarios, plausible distractors, root-cause wording, and close architectural trade-offs.
export const realisticQuestionBank: Question[] = [
  q('rx01','parallel','A coordinator receives a support request containing two independent concerns: an incorrect invoice total and a request to change the billing contact. The agent fixes the contact first and plans to investigate the invoice in a later turn. Which architectural change BEST prevents partial resolution?',[
    'Add a reminder to the system prompt telling the agent to answer every sentence in the user message.',
    'Decompose the request into tracked concerns, process independent concerns in parallel, then synthesize one unified response.',
    'Route the entire request to whichever specialist owns the higher-risk concern.',
    'Process concerns strictly sequentially so the coordinator never has more than one active subtask.'
  ],1,'Las solicitudes multi-concern deben descomponerse, seguir cada concern y sintetizar una respuesta única. Un recordatorio en prompt no garantiza que ningún concern se pierda.'),

  q('rx02','dynamic-decomposition','A team begins a legacy authorization refactor without knowing which services depend on the old permission model. New dependencies appear after each exploration step. Which decomposition strategy is MOST appropriate?',[
    'A fixed sequential pipeline whose steps are defined before exploration begins.',
    'A dynamic adaptive decomposition that creates or reprioritizes subtasks as findings emerge.',
    'A single unrestricted agent so all discoveries remain in one context window.',
    'A batch workflow that assigns every package to a worker before any dependency analysis occurs.'
  ],1,'Cuando las subtareas útiles aparecen a medida que llegan hallazgos, el plan debe adaptarse. Un pipeline fijo sirve cuando los pasos ya son conocidos.'),

  q('rx03','delegation','A coordinator has two pending changes: rename an authorization helper referenced by 70 files, and update one timeout constant in a known configuration file. What is the BEST delegation strategy?',[
    'Delegate both tasks because specialist subagents always improve accuracy.',
    'Keep both tasks in the coordinator to avoid communication overhead.',
    'Delegate the 70-file rename with scoped context and handle the one-line configuration change directly.',
    'Delegate only the one-line change so the coordinator preserves full awareness for the larger refactor.'
  ],2,'Delegar tiene overhead. Las tareas grandes y cross-cutting se benefician de contexto enfocado; una modificación pequeña y bien delimitada puede resolverla el coordinador.'),

  q('rx04','subagent-prompts','A research subagent returns precise findings with source metadata. The coordinator sends only a prose summary to the synthesis agent, whose report later contains unsupported claims. What is the MOST likely root cause?',[
    'The synthesis agent needs direct web access so it can independently verify every statement.',
    'The coordinator failed to pass the complete findings and structured provenance metadata into the synthesis handoff.',
    'The research agent should have used a higher-temperature model to expose more uncertainty.',
    'The synthesis agent should have been instructed to be conservative when writing conclusions.'
  ],1,'Los subagentes no comparten memoria. Si el handoff pierde datos y metadata, el synthesis agent rellena huecos. El problema es context passing, no un prompt más fuerte.'),

  q('rx05','state','A long-running migration workflow is interrupted after 8 of 20 services are completed. The team persisted the original request and the latest assistant message, but not task status. What state should have been persisted to resume safely?',[
    'Only the names of generated files, because missing files imply unfinished work.',
    'Completed and pending work, outputs, dependencies, checkpoints, and retry/error state.',
    'The full transcript only, without structured task status, so no detail is lost.',
    'Only the original plan, because execution state can be reconstructed by the model.'
  ],1,'El estado reanudable debe decir qué terminó, qué falta, dependencias y errores. Un transcript sin estructura no es un checkpoint operativo confiable.'),

  q('rx06','review-architecture','Claude Code is investigating a complex production incident with several plausible causes. After tracing logs and callbacks it identifies a one-line configuration fix with no remaining design decision. What workflow is BEST?',[
    'Use direct execution from the beginning because the eventual fix is only one line.',
    'Stay in plan mode for the entire session because switching modes loses investigation context.',
    'Investigate in plan mode, then switch to direct execution once the fix is understood and scoped.',
    'Start a new write-enabled session for the fix so the planning session remains read-only.'
  ],2,'La decisión depende de la ambigüedad actual. Investigar requiere plan; una vez que queda un fix pequeño y conocido, direct execution evita overhead.'),

  q('rx07','cicd','A CI job runs `claude -p` and asks it to verify that every exported endpoint has documentation. The job always reports complete coverage, while manual audits find missing endpoints. What should the team improve FIRST?',[
    'Remove `-p` because non-interactive mode prevents file access.',
    'Replace `--output-format json` with text so Claude can reason more deeply.',
    'Define explicit validation criteria for each endpoint and require structured evidence for gaps.',
    'Add a second identical review pass and accept the result only if both agree.'
  ],2,'`-p` no impide leer archivos. El problema es una validación vaga que permite un chequeo superficial. CI confiable necesita criterios y evidencia estructurada.'),

  q('rx08','iterative','Claude repeatedly implements a rate limiter that passes simple manual checks but regresses under burst traffic, clock skew, and concurrent requests. Which workflow change gives the iteration loop an objective target?',[
    'Describe each edge case in a longer prose prompt before every iteration.',
    'Write executable tests first and iterate using the failing test output as feedback.',
    'Switch to plan mode and keep the implementation unchanged until the plan is perfect.',
    'Ask Claude to self-rate its confidence after each implementation attempt.'
  ],1,'Tests convierten feedback ambiguo en una señal repetible PASS/FAIL. Es la opción objetiva frente a comentarios manuales que pueden dejar regresiones.'),

  q('rx09','configuration','Test files are co-located with source files across more than 80 packages. The team wants test-specific conventions loaded only when editing `*.test.ts` or `*.test.tsx`. What is the MOST maintainable configuration?',[
    'Put all test conventions in the root CLAUDE.md so they are always available.',
    'Create a CLAUDE.md in every package that contains tests.',
    'Create one `.claude/rules/` file with `paths` globs matching the test file patterns.',
    'Create an on-demand Skill and rely on developers to invoke it before every test edit.'
  ],2,'Las reglas path-specific cargan automáticamente por glob y evitan tanto duplicación como consumo de tokens en archivos que no son tests.'),

  q('rx10','exploration','A developer knows a table name appears somewhere in the repository and also needs to list all SQL migration files by directory convention. Which built-in tool sequence is BEST?',[
    'Glob for the table name, then Grep for `**/migrations/*.sql`.',
    'Grep for the table name in file contents, then Glob for the migration path pattern.',
    'Read every SQL file, then use Write to collect matching paths into a temporary file.',
    'Use Bash for both steps because shell commands can search contents and paths in one interface.'
  ],1,'Grep busca contenido; Glob busca rutas/nombres. La pregunta combina ambas necesidades y premia usar cada tool para su fortaleza.'),

  q('rx11','exploration','Claude Code must explain a pipeline spanning deep inheritance and callback chains across four packages. Its first pass reads three files and returns a shallow summary. What is the BEST next step?',[
    'List every class manually in a longer prompt so the model cannot stop early.',
    'Use an Explore subagent for verbose discovery and return a concise map to the main context.',
    'Open four separate sessions, one per package, and manually combine the summaries.',
    'Increase the context window and repeat the same shallow exploration strategy.'
  ],1,'Explore está orientado a discovery exhaustivo y aísla output verboso. Dividir por packages puede perder relaciones cross-package.'),

  q('rx12','long-context','After exploring many modules, Claude stops naming exact classes and starts saying things like “the repository follows standard patterns.” What is the primary problem and mitigation?',[
    'Token exhaustion; increase max_tokens for the next response.',
    'Context degradation; persist precise findings in scratchpads and isolate verbose exploration with subagents.',
    'Temperature drift; lower temperature to make references deterministic.',
    'Prompt injection from source files; sanitize all code before reading it.'
  ],1,'El síntoma es pérdida de especificidad por acumulación de output, no necesariamente overflow. Scratchpads y aislamiento reducen context degradation.'),

  q('rx13','context-optimization','A support conversation is summarized between turns. A precise `$247.83` refund for order `#8891` later becomes “your recent refund request.” What is the MOST reliable fix?',[
    'Increase the context window so summarization never occurs.',
    'Tell the summarizer to preserve every number verbatim.',
    'Maintain a persistent case-facts block outside the summarized history.',
    'Store the entire transcript in a database and inject it on every turn.'
  ],2,'La summarización es lossy. Los datos transaccionales críticos deben persistirse fuera del resumen y entrar en cada prompt.'),

  q('rx14','long-context','A multi-step analysis joins Snowflake billing data with PostgreSQL usage data and then applies currency normalization. Intermediate result tables rapidly consume context. Which strategy is BEST?',[
    'Delegate each sequential step to a fresh subagent and pass all raw intermediate data between them.',
    'Summarize every intermediate table into prose before the next calculation.',
    'Write intermediate results to a scratchpad and read back only the aggregates needed by the next step.',
    'Increase the context window so every raw row remains available in conversation.'
  ],2,'Scratchpads sacan datos intermedios del contexto sin perder exactitud. Resumir cifras puede destruir detalles necesarios para cálculos posteriores.'),

  q('rx15','human-review','A support policy explains own-site price adjustments but says nothing about matching a competitor price. The customer request is clear and the agent has all account access required. What should the agent do?',[
    'Apply the own-site rule by analogy because it is the closest available policy.',
    'Decline the request because the policy does not explicitly authorize it.',
    'Ask for proof of the competitor price before deciding whether policy allows the action.',
    'Escalate because policy silence on this specific request is a policy gap.'
  ],3,'Silencio no equivale a sí ni a no. Un policy gap es un trigger válido de escalamiento; pedir más evidencia no crea una política que no existe.'),

  q('rx16','human-review','A support agent escalates easy replacement cases but autonomously handles complex policy exceptions. What is the proportionate FIRST improvement?',[
    'Train a separate classifier on historical tickets.',
    'Route using the model’s self-reported confidence score.',
    'Add explicit escalation criteria with targeted few-shot examples for resolve-vs-escalate boundaries.',
    'Use sentiment analysis because frustrated customers are more likely to need humans.'
  ],2,'El problema es una frontera de decisión ambigua. Primero se corrige con criterios explícitos y ejemplos; classifier y sentiment son soluciones desproporcionadas.'),

  q('rx17','human-review','An extraction system reports 97% overall accuracy. Standard invoices are 99%, but a rare international format is only 58%. What production mistake does the 97% metric illustrate?',[
    'Model drift caused by repeated inference over several weeks.',
    'Aggregate metrics masking poor performance in a low-frequency segment.',
    'A confidence threshold that should simply be raised from 90% to 99%.',
    'Insufficient output token budget for international documents.'
  ],1,'Un promedio dominado por categorías fáciles puede ocultar segmentos con alto error. Hay que medir por tipo de documento/campo.'),

  q('rx18','human-review','Confidence was calibrated on known invoice layouts. A new two-column legal format appears and receives 93% confidence. What safeguard is MOST appropriate?',[
    'Trust 93% because it exceeds the already calibrated threshold.',
    'Raise the global threshold for every document type.',
    'Maintain stratified sampling of high-confidence auto-approved items across document types.',
    'Disable automation permanently for all extraction tasks.'
  ],2,'La calibración puede no transferirse a formatos nuevos. Muestrear también high-confidence por estrato permite detectar fallos novedosos.'),

  q('rx19','human-review','Party-name extraction is 99% accurate while indemnification-clause extraction is 71%, but the model reports similarly high confidence for both. What should happen BEFORE broad automation?',[
    'Use one global confidence threshold because confidence values are already normalized.',
    'Calibrate thresholds per field against labelled validation data and monitor segments with stratified sampling.',
    'Train a second model whose only job is to predict whether the first model is correct.',
    'Exclude indemnification forever and automate every other field without further calibration.'
  ],1,'La confianza cruda no equivale a accuracy. La solución directa es calibrar por field/type con ground truth y luego monitorear.'),

  q('rx20','batches','A Message Batches job reviews 8,000 pull requests. Results may arrive out of submission order. How should each result be matched to its original request?',[
    'Submit each pull request as a separate batch so the batch ID becomes the correlation key.',
    'Parse filenames from the generated review text.',
    'Store the pull request identifier in `custom_id` for each batch item and correlate by that field.',
    'Assume output order matches input order because all requests are independent.'
  ],2,'`custom_id` existe para correlacionar request/response en batches; no se debe confiar en el orden de entrega.'),

  q('rx21','batches','A 4,000-token review instruction block and few-shot examples are reused unchanged for every request, while only the code under review changes. What optimization reduces cost without removing guidance?',[
    'Remove most examples and compensate by setting temperature to zero.',
    'Use prompt caching with the reusable static prefix before the dynamic code.',
    'Move all reviews to Message Batches even though developers block on results.',
    'Compress the instructions differently for every request so each prompt is shorter.'
  ],1,'Un prefijo estático grande y repetido es ideal para prompt caching. Lo dinámico debe ir después para preservar el cache hit.'),

  q('rx22','structured','A downstream service requires schema-valid output on every call. Which configuration provides the strongest guarantee?',[
    'Ask for JSON in the system prompt and retry whenever parsing fails.',
    'Use tool use with a JSON Schema and force the specific tool when that operation is mandatory.',
    'Set temperature to zero and parse fields from natural language.',
    'Prefill an opening brace and rely on the model to close the object correctly.'
  ],1,'Tool use + schema controla la forma; tool_choice específico puede garantizar la llamada obligatoria.'),

  q('rx23','schema','A document may omit `secondary_phone`, while `cancellation_reason` must be present but may legitimately be null. Which schema is BEST?',[
    'Require both strings and use empty strings for missing values.',
    'Make both fields optional because null and absence mean the same thing.',
    'Make `secondary_phone` optional and allow `cancellation_reason` to be nullable.',
    'Make `secondary_phone` nullable and omit `cancellation_reason` when unknown.'
  ],2,'Optional representa campo ausente; nullable representa campo presente cuyo valor puede ser null. Son estados distintos.'),

  q('rx24','tool-schema','A workflow must extract metadata before any enrichment can occur. The model sometimes skips extraction when `tool_choice` is `auto`. What is the correct control?',[
    'Use `any` so the model must call some tool and rely on descriptions to make it choose extraction.',
    'Force the specific metadata extraction tool for the first turn, then return to `auto` afterward.',
    'Remove all enrichment tools permanently so extraction is the only option in every turn.',
    'Keep `auto` and add a stronger “must extract first” system prompt.'
  ],1,'`any` obliga alguna tool, no una tool exacta. Forced specific tool garantiza el paso mandatory y luego se vuelve a auto.'),

  q('rx25','truncation','A structured review of 120 files repeatedly hits the output token limit before closing the JSON structure. What should change FIRST?',[
    'Remove the schema so natural language can be shorter.',
    'Keep the same request and retry until one run happens to fit.',
    'Split the workload into smaller calls that each return valid structures, then merge results deterministically.',
    'Increase temperature so the model compresses findings more creatively.'
  ],2,'Dividir preserva estructuras válidas y elimina dependencia de una sola salida enorme. Quitar schema sacrifica garantías.'),

  q('rx26','extraction','Detailed written rules fail to make async error-handling style consistent across generated endpoints. What is the BEST next intervention?',[
    'Add 2–4 varied few-shot examples with reasoning that demonstrate the desired pattern across normal, async, and failure scenarios.',
    'Add another paragraph explaining why the preferred style is important.',
    'Set temperature to zero because inconsistency is always sampling noise.',
    'Add a post-generation rewrite pass as the first remedy.'
  ],0,'Cuando instrucciones detalladas siguen produciendo interpretaciones inconsistentes, few-shot targeted y variado enseña el patrón mejor que más prosa.'),

  q('rx27','extraction','An invoice extractor mislabels ambiguous fields even though the prompt contains long field definitions. Which few-shot construction is BEST?',[
    'Add one example for every production document ever seen.',
    'Use 2–4 targeted examples focused on the ambiguous cases, include varied structures, and explain why each mapping is correct.',
    'Replace examples with an even longer glossary of field definitions.',
    'Use only one perfect canonical invoice so the model has a single pattern to imitate.'
  ],1,'Pocos ejemplos bien elegidos + reasoning generalizan mejor que cobertura exhaustiva o más definiciones.'),

  q('rx28','false-positives','A code review prompt defines “critical” as “dangerous code” and “minor” as “slightly suboptimal.” Identical patterns receive different severities across runs. What should be changed FIRST?',[
    'Lower temperature to zero.',
    'Add a confidence threshold and hide findings below 90%.',
    'Replace vague prose severity definitions with concrete code examples as calibration anchors.',
    'Run three severity classifications and use majority vote.'
  ],2,'El problema raíz son categorías vagas. Ejemplos concretos calibran fronteras; temperature o voting no arreglan definiciones ambiguas.'),

  q('rx29','output-schema','A moderation result contains `category: "spam"` and `detected_patterns: ["repeated slur targeting ethnicity"]`. Validation retries with targeted feedback. What is the PRIMARY benefit of `detected_patterns`?',[
    'It lets deterministic code override the model category automatically.',
    'It externalizes evidence so validation can detect reasoning inconsistencies and give targeted self-correction feedback.',
    'It guarantees the initial classification is correct before validation runs.',
    'It exists primarily to create a human-readable audit log.'
  ],1,'Auditabilidad es secundaria. En este workflow el beneficio central es validar consistencia entre evidencia estructurada y conclusión para retry dirigido.'),

  q('rx30','structured','A retry fixes empty `reasoning` fields for ordinary posts but repeatedly fails on a language the model cannot analyze. What is the correct retry boundary?',[
    'Increase retry attempts because format errors and capability gaps are equivalent.',
    'Add the unsupported language to the system prompt so the model tries harder.',
    'Retry fixable format/validation errors, but route genuine capability gaps to a fallback or human review.',
    'Remove the reasoning requirement only for unsupported languages.'
  ],2,'Retry puede corregir un output que el modelo sabe producir; no crea conocimiento/capacidad inexistente.'),

  q('rx31','mcp-descriptions','An MCP CRM tool is available but described only as “CRM tool.” Claude repeatedly uses Grep over local logs for customer data. What should the team do FIRST?',[
    'Remove Grep from allowed tools.',
    'Move the MCP configuration from project scope to user scope.',
    'Expand the MCP tool description to state authoritative customer data, outputs, use cases, and advantages over local logs.',
    'Force the CRM tool with tool_choice for every future turn.'
  ],2,'Si la tool está disponible pero se ignora, la description es la primera señal a mejorar. Remover otras tools o forzar siempre es demasiado agresivo.'),

  q('rx32','mcp-descriptions','Two tools both mention “cancellation”: one executes account cancellations and the other searches help content. Claude routes “how does cancellation work?” to the action tool. What description change BEST resolves this?',[
    'Remove the word cancellation from both descriptions.',
    'Add explicit boundary descriptions: execute requests use the action tool; informational questions use the knowledge tool.',
    'Merge both tools into one tool that decides internally whether to search or mutate.',
    'Add twenty few-shot routing examples to the system prompt.'
  ],1,'Cuando las tools representan intenciones distintas, hay que expresar el boundary de uso y no-uso, no esconder keywords ni sobrecargar con ejemplos.'),

  q('rx33','mcp-integration','A Snowflake MCP tool is visible in the tool list but Claude prefers Bash/CLI even though the MCP result is structured and paginated. What is the MOST likely cause?',[
    'The MCP server is disconnected; visible tools can remain after disconnection.',
    'The tool description is too sparse to communicate why it is preferable for database queries.',
    'Bash always has higher tool-selection priority than MCP tools.',
    'Project-scoped MCP tools cannot be selected when user-scoped tools exist.'
  ],1,'Visible pero ignorada sugiere selection/description, no discovery/connectivity. Descripciones ricas ayudan a preferir la tool adecuada.'),

  q('rx34','tool-distribution','An agent exposes 22 tools, including 19 transformations that all take input data and differ mainly by transformation type. Tool selection is slow and error-prone. What redesign is BEST?',[
    'Split the 22 tools across multiple MCP servers.',
    'Add longer descriptions to all 22 and keep every tool separate.',
    'Consolidate the 19 transformations into a parameterized `transform_data` tool while keeping genuinely distinct query tools separate.',
    'Use `tool_choice: any` so the agent cannot waste turns reasoning.'
  ],2,'MCP server boundaries son invisibles para selección. Near-duplicate operations con la misma shape son buenas candidatas para consolidación parametrizada.'),

  q('rx35','tool-distribution','A synthesis agent sends 85% of simple fact checks back through the coordinator, adding several round trips. What is the MOST effective change?',[
    'Increase coordinator parallelism.',
    'Give the synthesis agent a narrowly scoped `verify_fact` tool and escalate only complex checks.',
    'Cache only repeated verifications at coordinator level.',
    'Remove verification from the workflow.'
  ],1,'El problema principal es el round-trip innecesario. Una scoped cross-role tool resuelve directamente el caso simple frecuente.'),

  q('rx36','builtin-tools','Claude Code `Edit` fails with a non-unique match because `return result;` appears in several functions. What is the correct FIRST recovery?',[
    'Read the full file and Write the entire modified file.',
    'Switch to Bash/sed with line numbers.',
    'Expand `old_string` with surrounding context until the match is unique, or use `replace_all` only if every occurrence should change.',
    'Split the source file so each occurrence becomes unique.'
  ],2,'Edit es intencionalmente quirúrgico. Primero amplía contexto; replace_all solo si realmente quieres todas las coincidencias.'),

  q('rx37','mcp-integration','A shared `.mcp.json` defines production PostgreSQL while a developer’s `~/.claude.json` defines staging. Both tools are visible, and “check user count” accidentally goes to production. What is the BEST resolution?',[
    'Delete production from the shared `.mcp.json` during testing.',
    'Force staging with tool_choice for every turn in the session.',
    'Give staging a distinct tool name and environment-specific description, plus a session routing rule that staging takes precedence for the current testing task.',
    'Move staging into the team `.mcp.json` and let connection strings distinguish environments.'
  ],2,'Los dos scopes cargan juntos. La intención del usuario no menciona environment, así que names/descriptions y una routing rule de sesión reducen ambigüedad sin bloquear otros usos.'),

  q('rx38','output-schema','Three subagents return attributed claims, but a final synthesis report loses attribution after rewriting and merging prose. What structural fix addresses the root cause?',[
    'Add a bibliography containing every URL at the end.',
    'Keep URLs inline inside prose and tell synthesis not to remove them.',
    'Require structured claim-source mappings from subagents and explicitly preserve/merge those mappings through synthesis.',
    'Store raw outputs in a database and refer to database row IDs in the final report.'
  ],2,'Provenance robusta requiere claim→source como datos estructurados. Links inline y bibliografía se pueden desacoplar de claims durante reescritura.'),

  q('rx39','synthesis','Two authoritative sources report different values for the same metric but use different publication dates and methodologies. What should synthesis do?',[
    'Choose the most recent value because recency always determines correctness.',
    'Average the values to avoid appearing uncertain.',
    'Preserve both values with attribution, dates, methodological context, and possible explanations for the difference.',
    'Drop both values because disagreement means neither source is trustworthy.'
  ],2,'Conflictos deben preservarse con contexto y atribución. Fecha/metodología pueden explicar diferencias legítimas; no se elige arbitrariamente.'),

  q('rx40','output-schema','A developer asks how a specific architectural claim in generated docs can be re-verified six months later after a refactor. Which provenance record is MOST useful?',[
    'The Git commit that last changed the generated Markdown file.',
    'A bibliography of all repositories and ADRs consulted during generation.',
    'A structured mapping from the claim to source file, relevant line/excerpt, and retrieval/publication date.',
    'An untouched archive of every source file with no claim-level index.'
  ],2,'La pregunta pide traceability claim-level. Git y archivos archivados no dicen qué fuente concreta informó esa afirmación.'),

  q('rx41','cicd','The same Claude session generates code and then immediately performs an “independent” review. Reviews agree with the original implementation almost every time, including known bugs. What is the root cause and fix?',[
    'Temperature is too low; increase it during review.',
    'The reviewer is anchored by the generation reasoning in the same context; use a fresh independent session/instance.',
    'The checklist is too short; add more review instructions in the same session.',
    'Enable more thinking tokens so self-review becomes independent.'
  ],1,'Independencia requiere contexto independiente. El mismo historial contiene justificaciones previas y sesga la revisión hacia confirmar.'),

  q('rx42','review-config','A 16-file PR gets detailed findings on early files, shallow comments later, and inconsistent treatment of identical patterns. What review structure BEST addresses this?',[
    'Run three full-PR reviews and report only findings appearing in two of three.',
    'Use a larger context window so all files fit more comfortably.',
    'Review each file in a focused local pass, then run a separate cross-file integration pass.',
    'Ask developers to split every PR into exactly four-file chunks.'
  ],2,'El síntoma es attention dilution. Per-file passes restauran profundidad; cross-file pass conserva análisis de integración.'),

  q('rx43','cicd','Three Claude Code instances must edit different parts of the same repository in parallel and commit independently. Which setup provides filesystem isolation with shared history?',[
    'Use `fork_session` three times inside one working directory.',
    'Run all instances in one directory but check out different branches.',
    'Create separate `git worktree` directories on separate branches, one Claude Code instance per worktree.',
    'Clone the repository three unrelated times and manually reconcile histories.'
  ],2,'fork_session aísla contexto, no filesystem. Worktree entrega directorios independientes compartiendo el mismo repo/history.'),

  q('rx44','cicd','Two parallel worktrees both need to modify the shared `OrderService.java`. What coordination minimizes merge risk?',[
    'Let both modify independently and resolve the conflict at the final merge.',
    'Have one branch complete and merge first, then rebase the second branch on updated main before it edits the shared file.',
    'Use Git file locking for ordinary Java source files.',
    'Create a third agent that owns all shared files, regardless of domain context.'
  ],1,'Worktrees no eliminan conflictos lógicos en un mismo archivo. Secuenciar el punto compartido con merge→rebase es más seguro.'),

  q('rx45','cicd','A generated Java file must be formatted automatically according to Checkstyle after Claude writes it. Which hook placement is appropriate?',[
    'PreToolUse on Read, validating style before the file enters context.',
    'PreToolUse on Write, formatting the file on disk before it exists.',
    'PostToolUse on the write operation, running the formatter against the file that was just written.',
    'A stronger CLAUDE.md instruction to remember formatting.'
  ],2,'El formatter necesita el archivo escrito. PostToolUse actúa después de Write y puede normalizar output de manera determinista.'),

  q('rx46','cicd','Every service must contain a Dockerfile by the time it can merge, but Dockerfiles may be added several steps after service creation. Where should deterministic enforcement occur?',[
    'PreToolUse on `create_service`.',
    'PostToolUse immediately after `create_service`.',
    'At the merge/deploy gate where the service is considered complete.',
    'On every file write, continuously polling until a Dockerfile appears.'
  ],2,'El punto correcto no es solo PRE vs POST: es el workflow boundary donde el invariant debe ser verdadero. Aquí, antes de merge/deploy.'),

  q('rx47','cicd','A team wants every SQL migration filename to match `YYYYMMDD_HHMMSS_description.sql` and every file to contain rollback instructions. They need deterministic enforcement of the actual generated output. What is BEST?',[
    'Document the rule in CLAUDE.md with examples.',
    'Use a path-specific rule telling Claude never to omit rollback.',
    'Run programmatic validation in a PostToolUse/CI check against the written filename and file contents.',
    'Ask a second Claude instance to verify each migration.'
  ],2,'Guidance sigue siendo probabilística. Validar el artefacto real con código da una garantía determinista.'),

  q('rx48','cicd','Claude Code runs `/compact`. The team wants the complete transcript archived immediately before details are summarized away. Which hook is designed for this?',[
    'PostToolUse on Write.',
    'PreToolUse matching a fictional `Compact` tool.',
    'PreCompact.',
    'SubagentStop.'
  ],2,'`/compact` es un lifecycle event con PreCompact dedicado; no es una tool normal interceptable como Compact.'),

  q('rx49','cicd','A dangerous shell command must never execute outside the project directory. Which control belongs closest to the execution boundary?',[
    'A system prompt with examples of forbidden commands.',
    'A PreToolUse hook validating command patterns and file paths before execution.',
    'A PostToolUse hook that rolls back filesystem changes after execution.',
    'A second model that approves shell commands asynchronously.'
  ],1,'Para prevenir una acción destructiva hay que interceptar antes de que ocurra. PostToolUse llega demasiado tarde.'),

  q('rx50','cicd','A backend tool may return full credit-card numbers. The model must never see those numbers. What is the correct guardrail?',[
    'A PreToolUse hook that rejects tool parameters containing card numbers.',
    'A PostToolUse hook that redacts card-number patterns from tool results before they reach the model.',
    'A prompt telling Claude to replace card numbers with asterisks in its final answer.',
    'Remove every payment tool from the agent.'
  ],1,'El dato sensible aparece en el resultado, así que se normaliza/redacta en PostToolUse antes de que el modelo lo vea.'),

  q('rx51','cicd','A non-critical convention says developers should create a backup before overwriting a version-controlled file. Prompt compliance is 88%. A separate rule prevents writes outside the project directory. Should both become hooks?',[
    'Yes. Any rule below 100% compliance must become a hook.',
    'No. Keep the safety-critical directory boundary deterministic; the recoverable backup best practice may remain prompt guidance.',
    'No. Both should be prompts because hooks add complexity.',
    'Convert only the backup rule because backups are more important than path safety.'
  ],1,'La severidad del fallo determina el mecanismo. Un backup omitido en Git es recuperable; escritura fuera del proyecto puede causar daño real.'),

  q('rx52','long-context','A documentation workflow summarizes each processed module and discards raw source. Module 12 renamed a class from module 3, but its summary says only “various refactoring changes.” Later output uses the old class name. What caused the failure?',[
    'The context window overflowed despite the explicit summarization strategy.',
    'Progressive summarization lost a critical rename fact that should have been preserved separately.',
    'Claude cached stale file contents and refused to reread disk.',
    'Temperature caused the model to randomly choose the older name.'
  ],1,'La summarización redujo contexto pero perdió un hecho exacto. Renames y facts críticos deben persistirse fuera de summaries.'),

  q('rx53','mcp-integration','A tool call times out after 30 seconds. What error response gives the agent the clearest recovery semantics?',[
    'Return `success` with an empty list so the agent can continue.',
    'Return an unhandled exception and let the framework decide.',
    'Return structured error metadata marking a transient error and `isRetryable: true`, with a useful description.',
    'Return a business error with `isRetryable: false` because the operation did not complete.'
  ],2,'Timeout es transient: debe distinguirse de empty success y de business/permission errors con metadata explícita.'),

  q('rx54','mcp-integration','`query_postgres` returns 500 for overload and a permanent missing-table failure for an invalid table. The agent retries both identically. What error-design change fixes the root cause?',[
    'Increase the retry budget so both eventually succeed.',
    'Put HTTP codes into free-text messages and ask the model to infer retry behavior.',
    'Add structured error categories and retryability so transient failures retry but permanent failures do not.',
    'Disable retries and escalate every tool error immediately.'
  ],2,'El problema es categorization, no número de reintentos. Recovery logic debe consumir categorías estructuradas.'),

  q('rx55','mcp-integration','An academic-search subagent gets `403 Forbidden`, catches it, and returns `{status: "success", results: []}`. What is the critical failure?',[
    'It should retry the 403 with exponential backoff because permission errors are usually transient.',
    'It silently suppresses an access failure, making it indistinguishable from a successful search with zero matches.',
    'The coordinator should reject every empty result even when the query truly matched nothing.',
    'The entire multi-agent workflow should terminate as soon as any subagent fails.'
  ],1,'Failure→success[] destruye semántica y evita recovery/coverage annotation. 403 requiere propagar error de acceso, no ocultarlo.'),

  q('rx56','mcp-integration','A web-search subagent times out after retrieving three of five useful sources. Which response BEST enables intelligent coordinator recovery?',[
    'Return a generic `search unavailable` status after local retries finish.',
    'Terminate the entire workflow and discard partial results.',
    'Return structured failure type, attempted query/target, partial results, and possible alternative approaches.',
    'Return success with the three partial results but omit the timeout so synthesis remains simple.'
  ],2,'El coordinator necesita contexto suficiente para decidir retry, fallback o proceed-with-partial. Generic status y silent success eliminan esa capacidad.'),

  q('rx57','output-schema','A research synthesis report must retain the source of every claim through multiple rewriting passes. Which representation is MOST robust?',[
    'URLs inserted as prose footnotes only.',
    'A bibliography that lists all sources once at the end.',
    'Structured claim-source metadata preserved and merged separately from prose rendering.',
    'Git history of the final report.'
  ],2,'Atribución claim-level debe sobrevivir reescritura. Metadata estructurada es más robusta que prosa, footnotes o bibliography.'),

  q('rx58','review-config','A tool named `check_security` exists, while the system prompt says “check the security of each function.” Claude sometimes writes a textual security analysis instead of calling the tool. What is the MOST likely cause?',[
    'Tool calls are unavailable in CI environments.',
    'Keyword overlap between prompt wording and the tool name creates ambiguous routing behavior.',
    'The context window is too small to include tool definitions.',
    'Temperature is too high for deterministic tool invocation.'
  ],1,'El cambio se explica por interacción prompt↔tool naming. Keyword-sensitive overlap puede competir con descriptions y producir routing ambiguo.'),

  q('rx59','review-config','A team requires integration tests with real database connections and API-contract assertions, but Claude often generates unit tests with mocks. What is the BEST first correction?',[
    'Ban mocks from every test file using a global rule.',
    'Add a review subagent that rewrites all tests containing mocks.',
    'Make the persistent test standard explicit about what qualifies as an integration test: real DB, contract assertions, fixtures, and rollback behavior.',
    'Delete the unit tests so Claude has fewer examples to imitate.'
  ],2,'El problema es una definición insuficiente de integration test. Mocks pueden seguir siendo válidos en unit tests; no hay que prohibirlos globalmente.'),

  q('rx60','review-config','A team skill generates hundreds of lines of API documentation and must be shared with everyone who clones the repository without polluting the main conversation. Where and how should it be configured?',[
    'In `~/.claude/skills/` with no frontmatter.',
    'In the root CLAUDE.md so it is always loaded.',
    'In `.claude/skills/<name>/SKILL.md` with `context: fork`.',
    'In `.claude/rules/` with a `paths` glob so it runs automatically.'
  ],2,'Team skill va en `.claude/skills/` versionado. `context: fork` aísla output verboso. CLAUDE.md es para standards siempre cargados.'),
]
