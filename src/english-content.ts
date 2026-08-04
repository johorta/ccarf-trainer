export type EnglishLesson = {
  summary: string
  principles: string[]
  examTips: string[]
  example: string
}

export const englishLessons: Record<string, EnglishLesson> = {
  parallel: {
    summary: 'Independent tool calls can run in parallel; calls with data dependencies must run sequentially.',
    principles: ['Parallel calls reduce total latency.', 'A dependency exists when one result supplies another call\'s input.', 'A workflow can combine sequential stages with parallel groups.'],
    examTips: ['Do not parallelize calls that mutate the same state without coordination.', 'Parallelism improves latency, not guaranteed accuracy.'],
    example: 'Retrieve weather, exchange rate, and holiday data in parallel, then synthesize the results.'
  },
  'session-resumption': {
    summary: 'Resume from persisted state and reanalyze only changed or invalidated work.',
    principles: ['Persist completed work, pending tasks, findings, sources, and versions.', 'Use hashes or commit IDs to detect changes.', 'Reconstruct compact operational context instead of replaying the full conversation.'],
    examTips: ['Starting over is usually wasteful.', 'A central source change may invalidate dependent conclusions.'],
    example: 'Reuse findings from the previous commit and recheck only modified files and affected conclusions.'
  },
  'subagent-prompts': {
    summary: 'A subagent prompt should be self-contained enough to finish the task without asking for basic missing context.',
    principles: ['Include the goal, success criteria, prior findings, constraints, sources, and output format.', 'Structured context reduces ambiguity.', 'Relevant context is better than copying the whole conversation.'],
    examTips: ['A vague prompt is not efficient merely because it is short.', 'Source metadata preserves traceability.'],
    example: 'Provide repository, branch, relevant files, known findings, allowed tools, and a required response schema.'
  },
  delegation: {
    summary: 'Goal-oriented delegation allows adaptation; procedural delegation maximizes repeatability and control.',
    principles: ['Use goal-oriented instructions for exploration and unknown paths.', 'Use procedures for regulated, repeatable, or high-risk operations.', 'Checkpoints preserve coordinator visibility.'],
    examTips: ['Goal-oriented does not mean unconstrained.', 'Procedural is not always better for uncertain investigations.'],
    example: 'Investigate the root cause with milestones, but require a fixed approved sequence for production deployment.'
  },
  'subagent-tools': {
    summary: 'Give each subagent only the tools and permissions required for its role.',
    principles: ['Apply least privilege.', 'Align role, prompt, tools, context, and expected output.', 'Separate review, approval, and execution in high-risk workflows.'],
    examTips: ['Do not give every agent every tool for convenience.', 'A read-only reviewer should not have deployment access.'],
    example: 'A code reviewer receives Read, Glob, and Grep, but no write or production administration tools.'
  },
  'spawn-diagnostics': {
    summary: 'Diagnose subagent failures by checking definition, registration, parameters, wiring, permissions, and first-action logs.',
    principles: ['The symptom indicates which layer failed.', 'Input contracts must match the agent definition.', 'Tool access is not automatically inherited from the coordinator.'],
    examTips: ['Changing temperature rarely fixes deterministic configuration failures.', 'Inspect exact errors before changing the model.'],
    example: 'If the agent starts but Read is unauthorized, fix the tool allowlist rather than the prompt temperature.'
  },
  'dynamic-decomposition': {
    summary: 'Task decomposition should adapt when new evidence changes the best plan.',
    principles: ['Create, split, merge, cancel, or reprioritize subtasks.', 'Keep goals and boundaries even while adapting.', 'Intermediate results should influence the next action.'],
    examTips: ['Dynamic does not mean planless improvisation.', 'Do not complete obsolete subtasks merely because they were in the original plan.'],
    example: 'A new regulatory constraint creates a compliance subtask and reprioritizes the investigation.'
  },
  'review-architecture': {
    summary: 'Choose direct execution, plan mode, or multi-phase architecture according to risk, reversibility, and review needs.',
    principles: ['Direct execution fits simple reversible work.', 'Plan mode supports review before action.', 'Multi-phase workflows separate extraction, review, approval, and execution.'],
    examTips: ['High-risk production changes usually need approval gates.', 'Do not add many phases to trivial work without benefit.'],
    example: 'A production permission change is planned, reviewed, approved, and only then executed.'
  },
  state: {
    summary: 'Persist checkpoints so long-running workflows can resume safely and avoid duplicate effects.',
    principles: ['Store completed and pending tasks, outputs, sources, errors, and approvals.', 'Use idempotency for retried external actions.', 'Keep large artifacts outside the checkpoint with references and hashes.'],
    examTips: ['Saving only the original prompt is insufficient.', 'Conversation context is not durable operational state.'],
    example: 'After a crash, reload the checkpoint and continue only pending tasks with idempotent actions.'
  },
  orchestration: {
    summary: 'Use coordinator-worker, parallel, or sequential patterns according to specialization and dependencies.',
    principles: ['Coordinators delegate and synthesize.', 'Parallel workers fit independent tasks.', 'Sequential execution is required for dependent outputs.'],
    examTips: ['More agents do not automatically improve quality.', 'Synthesis should preserve sources and disagreements.'],
    example: 'Several specialist searches run in parallel and a synthesis agent combines their evidence.'
  },

  cicd: {
    summary: 'Claude Code in CI/CD should run non-interactively with strict cost, turn, permission, and output controls.',
    principles: ['Use non-interactive execution.', 'Limit turns, retries, cost, and writable paths.', 'Return structured results for downstream systems.'],
    examTips: ['Unlimited retries and broad write access increase runaway risk.', 'A larger context window is not a safety control.'],
    example: 'A CI job allows edits only under a test directory and stops after a fixed turn and cost budget.'
  },
  iterative: {
    summary: 'Iterative refinement works best with specific feedback, concrete failures, and expected outcomes.',
    principles: ['Show missed cases.', 'Provide the exact violated criteria.', 'Change one related dimension at a time when diagnosing.'],
    examTips: ['“Do better” is weak feedback.', 'Do not change many variables without identifying the failure.'],
    example: 'Provide three missed bugs, the expected findings, and the project rules each one violates.'
  },
  'review-config': {
    summary: 'Automated code review should load project standards, use minimal tools, and return structured findings.',
    principles: ['Ground review in repository-specific rules.', 'Include severity, evidence, file, and line.', 'Design output for its downstream consumer.'],
    examTips: ['Generic review prompts create false positives.', 'Free-form prose is weaker when automation consumes the result.'],
    example: 'The reviewer loads Java conventions and returns structured findings with evidence and severity.'
  },
  'context-fork': {
    summary: 'A forked context isolates specialized work from the main conversation and returns only relevant results.',
    principles: ['Isolation prevents context pollution.', 'Use it for long or specialized tasks.', 'Return a compact result to the parent session.'],
    examTips: ['Do not fork when every intermediate detail must remain shared.', 'Forking changes context isolation, not tool correctness.'],
    example: 'Run an extensive audit in a fork and return only prioritized findings to the main session.'
  },
  'test-generation': {
    summary: 'High-quality generated tests require existing patterns, fixtures, expected behavior, and meaningful coverage criteria.',
    principles: ['Show existing tests and naming conventions.', 'Define edge cases and behavior.', 'Reject trivial assertions that only exercise code superficially.'],
    examTips: ['Maximizing test count does not maximize quality.', 'The source file alone is often insufficient context.'],
    example: 'Provide fixtures, expected behavior, edge cases, and examples of accepted assertion style.'
  },
  configuration: {
    summary: 'Claude Code configuration mechanisms have different scopes and purposes.',
    principles: ['CLAUDE.md provides persistent project guidance.', '.claude/rules can apply rules by file glob.', 'Skills, hooks, and settings handle reusable capabilities, automation, and permissions.'],
    examTips: ['Do not put every rule in one global file.', 'Choose the mechanism that matches the intended scope.'],
    example: 'A rule only for src/payments/**/*.java belongs in a scoped rules file.'
  },
  exploration: {
    summary: 'Explore a codebase incrementally: locate files, search content, then read the most relevant candidates.',
    principles: ['Glob finds paths.', 'Grep finds text occurrences.', 'Read inspects selected files.'],
    examTips: ['Do not read the entire repository first.', 'Prefer built-in tools over shell commands when they directly fit the task.'],
    example: 'Glob for YAML files, Grep for a timeout key, then Read only the matching files.'
  },
  'output-schema': {
    summary: 'Design a subagent output schema around the needs of the next consumer.',
    principles: ['Use structured fields for automation.', 'Include summaries for human review when useful.', 'Preserve source metadata for traceability.'],
    examTips: ['Do not choose format only for aesthetics.', 'Downstream requirements determine structure.'],
    example: 'Return findings as structured records plus a short summary and source references.'
  },
  synthesis: {
    summary: 'Synthesis should combine evidence without erasing uncertainty, disagreement, or source identity.',
    principles: ['Attribute each claim to its source.', 'Do not average incompatible facts without explanation.', 'Express confidence and unresolved conflicts.'],
    examTips: ['Do not arbitrarily choose one source.', 'Uncertainty is information, not noise to hide.'],
    example: 'Report both conflicting values and explain which source produced each one.'
  },
  'long-context': {
    summary: 'Long sessions require selective context, isolated work, and persistent scratchpads or artifacts.',
    principles: ['Store durable findings outside the active prompt.', 'Use isolated subagents for specialized work.', 'Reinject only what is relevant to the next decision.'],
    examTips: ['Keeping every token forever is not a context strategy.', 'Large raw history can distract from current state.'],
    example: 'Store findings in a scratchpad and load only the sections needed for the current task.'
  },
  'context-optimization': {
    summary: 'Use summaries, sliding windows, and structured state to keep the context window focused.',
    principles: ['Summarize older history.', 'Retain decisions, constraints, and pending work.', 'Drop irrelevant detail while preserving traceability.'],
    examTips: ['Repeating the full conversation wastes context.', 'Higher temperature does not solve context growth.'],
    example: 'Maintain a compact state object and a rolling summary instead of resending the entire transcript.'
  },

  'human-review': {
    summary: 'Route work to humans according to risk, ambiguity, confidence, and unusual inputs.',
    principles: ['Prioritize low-confidence outputs.', 'Escalate out-of-distribution documents.', 'Route field-level ambiguity when the decision matters.'],
    examTips: ['Random sampling alone misses targeted high-risk cases.', 'Review effort should be risk-based.'],
    example: 'Send unusual documents and ambiguous high-impact fields to human reviewers.'
  },
  batches: {
    summary: 'Use the synchronous Messages API for immediate interaction and Message Batches for high-volume asynchronous processing.',
    principles: ['Messages supports low-latency responses.', 'Batches fits large deferred workloads.', 'Latency requirements drive the choice.'],
    examTips: ['Do not use synchronous calls for huge overnight jobs by default.', 'Do not use batches when the user needs an immediate answer.'],
    example: 'Process 50,000 documents overnight with Message Batches.'
  },
  'specialized-review': {
    summary: 'Separate review passes by concern to improve focus and coverage.',
    principles: ['Use different prompts for security, logic, and design.', 'Give each pass relevant examples and criteria.', 'Synthesize findings afterward.'],
    examTips: ['One giant checklist can make concerns compete.', 'Specialization helps when criteria are meaningfully different.'],
    example: 'Run security, correctness, and maintainability reviewers, then deduplicate their findings.'
  },
  structured: {
    summary: 'When schema compliance is mandatory, tool use with JSON Schema is more reliable than requesting JSON in prose.',
    principles: ['Define explicit types and required fields.', 'Use tool_choice when invocation must occur.', 'Validate output downstream.'],
    examTips: ['“Respond in JSON” alone is weaker.', 'Regex over free-form prose is risky for critical data.'],
    example: 'Force a tool whose input schema matches the required extraction format.'
  },
  schema: {
    summary: 'Use optional, nullable, and enum fields to represent absence and ambiguity without inventing data.',
    principles: ['Optional means a field may be omitted.', 'Nullable means null is an accepted value.', 'Enums constrain valid states and may include unknown.'],
    examTips: ['Do not invent defaults for missing evidence.', 'Unrestricted strings weaken validation.'],
    example: 'middle_name is optional; status is an enum that includes unknown.'
  },
  'tool-schema': {
    summary: 'A tool schema defines valid inputs, while tool_choice controls whether a tool must be invoked.',
    principles: ['Describe the tool clearly.', 'Use correct types and required fields.', 'Force invocation only when the workflow requires it.'],
    examTips: ['A vague schema produces ambiguous calls.', 'Do not force the wrong tool.'],
    example: 'A critical extraction uses a required tool call with a strict input schema.'
  },
  truncation: {
    summary: 'When structured output is too large, split the work into smaller valid calls and merge the results deterministically.',
    principles: ['Use smaller batches.', 'Keep each partial result schema-valid.', 'Deduplicate and merge with stable logic.'],
    examTips: ['Increasing max_tokens indefinitely is not robust.', 'Removing the schema sacrifices reliability.'],
    example: 'Review twenty files per call and merge all structured findings afterward.'
  },
  extraction: {
    summary: 'Reliable extraction combines schemas, normalization rules, optional fields, and representative examples.',
    principles: ['Normalize dates, units, and controlled values.', 'Represent missing data explicitly.', 'Use examples that cover real variation.'],
    examTips: ['High temperature does not improve consistency.', 'Do not collapse all fields into one free-form string.'],
    example: 'Normalize dates to ISO format and preserve missing fields as null or omitted according to the schema.'
  },
  'false-positives': {
    summary: 'Project-specific conventions and explicit exclusions reduce false-positive review findings.',
    principles: ['Load accepted patterns.', 'Persist repository rules.', 'Define exceptions and exclusion criteria.'],
    examTips: ['Generic standards alone may misclassify intentional design.', 'More findings are not necessarily better findings.'],
    example: 'Teach the reviewer that a specific exception is accepted by the project architecture.'
  },
  boundaries: {
    summary: 'Explicit inclusion and exclusion boundaries reduce noise and keep extraction focused.',
    principles: ['Define allowed categories.', 'Define prohibited categories.', 'Provide edge-case examples.'],
    examTips: ['“Find anything interesting” is too broad.', 'Adding more output without boundaries increases noise.'],
    example: 'Include contractual obligations and exclude promotional language.'
  },

  'builtin-tools': {
    summary: 'Choose Glob for paths, Grep for content, Read for file inspection, and Bash only when no built-in tool fits.',
    principles: ['Match the tool to the operation.', 'Use the narrowest precise tool.', 'Avoid unnecessary shell complexity.'],
    examTips: ['Glob does not search file content.', 'Bash should not be the default for every task.'],
    example: 'Use Glob to find *.yaml, Grep to locate timeout, and Read to inspect matching files.'
  },
  'tool-distribution': {
    summary: 'Distribute tools according to each agent\'s responsibilities and boundaries.',
    principles: ['Reduce irrelevant choices.', 'Prevent out-of-role actions.', 'Limit credentials and side effects.'],
    examTips: ['All agents do not need identical tools.', 'A synthesis agent may need no write access.'],
    example: 'Search agents receive retrieval tools; the synthesis agent receives only the collected results.'
  },
  'mcp-resources': {
    summary: 'MCP resources expose readable content; MCP tools perform actions or queries.',
    principles: ['Use resources for manuals, catalogs, and reference data.', 'Use tools for operations and dynamic queries.', 'Choose the interface that matches the behavior.'],
    examTips: ['Do not model passive content as a destructive action.', 'Resources can reduce unnecessary exploration.'],
    example: 'Expose a static product catalog as a resource and inventory updates as tools.'
  },
  'mcp-integration': {
    summary: 'A reliable MCP integration requires the correct scope, authentication, and discovery verification.',
    principles: ['Select user, project, or global scope deliberately.', 'Store credentials outside source code.', 'Verify that expected tools and resources are discovered.'],
    examTips: ['Do not hard-code secrets.', 'Configuration success should be verified, not assumed.'],
    example: 'Configure authentication, start the server, and confirm the client can discover the expected tools.'
  },
  'mcp-descriptions': {
    summary: 'Tool descriptions should state purpose, inputs, limits, and how the tool differs from similar tools.',
    principles: ['Explain when to use the tool.', 'Describe required input shape.', 'Clarify boundaries and side effects.'],
    examTips: ['A vague name is not enough.', 'Marketing language does not guide tool selection.'],
    example: 'search_users explains filters and pagination, while get_user requires one exact user ID.'
  },
  'tool-choice': {
    summary: 'Use tool_choice when invocation is mandatory, and sequence calls according to their data dependencies.',
    principles: ['Force a required tool only when appropriate.', 'Allow model choice when several valid tools exist.', 'Call dependent tools in order.'],
    examTips: ['Do not parallelize calls when one produces the next input.', 'Forcing the wrong tool reduces flexibility and correctness.'],
    example: 'Retrieve account_id first, then use it to fetch transactions.'
  }
}
