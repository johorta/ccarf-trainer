import type { Question } from './data'

export type BlueprintDomainId =
  | 'agentic-architecture'
  | 'claude-code'
  | 'prompt-engineering'
  | 'tool-design-mcp'
  | 'context-reliability'

export type BlueprintDomainScore = {
  id: BlueprintDomainId
  title: string
  weight: number
  correct: number
  total: number
  accuracy: number
  weightedContribution: number
}

export type WeightedExamScore = {
  rawCorrect: number
  total: number
  rawPercentage: number
  weightedPercentage: number
  estimatedPoints: number
  passed: boolean
  domains: BlueprintDomainScore[]
}

const blueprintDomains: Array<{
  id: BlueprintDomainId
  title: string
  weight: number
  topicIds: string[]
}> = [
  {
    id: 'agentic-architecture',
    title: 'Agentic Architecture & Orchestration',
    weight: 27,
    topicIds: [
      'parallel',
      'delegation',
      'subagent-tools',
      'spawn-diagnostics',
      'dynamic-decomposition',
      'review-architecture',
      'orchestration',
      'human-review',
      'specialized-review',
    ],
  },
  {
    id: 'claude-code',
    title: 'Claude Code Configuration & Workflows',
    weight: 20,
    topicIds: [
      'cicd',
      'review-config',
      'context-fork',
      'test-generation',
      'configuration',
      'exploration',
      'builtin-tools',
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering & Structured Output',
    weight: 20,
    topicIds: [
      'subagent-prompts',
      'iterative',
      'output-schema',
      'structured',
      'schema',
      'truncation',
      'extraction',
      'false-positives',
      'boundaries',
    ],
  },
  {
    id: 'tool-design-mcp',
    title: 'Tool Design & MCP Integration',
    weight: 18,
    topicIds: [
      'tool-schema',
      'tool-distribution',
      'mcp-resources',
      'mcp-integration',
      'mcp-descriptions',
      'tool-choice',
    ],
  },
  {
    id: 'context-reliability',
    title: 'Context Management & Reliability',
    weight: 15,
    topicIds: [
      'session-resumption',
      'state',
      'synthesis',
      'long-context',
      'context-optimization',
      'batches',
    ],
  },
]

const round = (value: number, decimals = 2) => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function calculateWeightedExamScore(
  questions: Question[],
  answers: Record<string, number>,
): WeightedExamScore {
  const domains = blueprintDomains.map((domain): BlueprintDomainScore => {
    const domainQuestions = questions.filter((question) => domain.topicIds.includes(question.topicId))
    const correct = domainQuestions.filter((question) => answers[question.id] === question.answer).length
    const accuracy = domainQuestions.length ? (correct / domainQuestions.length) * 100 : 0
    const weightedContribution = (accuracy * domain.weight) / 100

    return {
      id: domain.id,
      title: domain.title,
      weight: domain.weight,
      correct,
      total: domainQuestions.length,
      accuracy: round(accuracy),
      weightedContribution: round(weightedContribution),
    }
  })

  const rawCorrect = questions.filter((question) => answers[question.id] === question.answer).length
  const rawPercentage = questions.length ? (rawCorrect / questions.length) * 100 : 0
  const weightedPercentage = domains.reduce((total, domain) => total + domain.weightedContribution, 0)
  const estimatedPoints = Math.round(weightedPercentage * 10)

  return {
    rawCorrect,
    total: questions.length,
    rawPercentage: round(rawPercentage),
    weightedPercentage: round(weightedPercentage),
    estimatedPoints,
    passed: estimatedPoints >= 720,
    domains,
  }
}
