import { questions as sharedPracticeQuestions, type Question } from './data'
import { applicationQuestionBank } from './applicationQuestionBank'
import { challengingQuestionBank } from './challengingQuestionBank'
import { expandedQuestionBank } from './expandedQuestionBank'
import { extraExamQuestions } from './extraExamQuestions'
import { finalExamQuestions } from './finalExamQuestions'
import { realisticQuestionBank } from './realisticQuestionBank'

export type ExamConfig = {
  id: string
  title: string
  description: string
  questionCount: number
  durationMinutes: number
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Final' | 'Realistic'
}

export const examConfigs: ExamConfig[] = [
  { id: 'foundation', title: 'Mock Exam 1 — Foundation', description: 'Repaso completo con énfasis en conceptos fundamentales.', questionCount: 60, durationMinutes: 90, difficulty: 'Foundation' },
  { id: 'intermediate', title: 'Mock Exam 2 — Intermediate', description: 'Escenarios mixtos con distractores más cercanos al examen.', questionCount: 60, durationMinutes: 90, difficulty: 'Intermediate' },
  { id: 'advanced', title: 'Mock Exam 3 — Advanced', description: 'Preguntas de aplicación, arquitectura y selección de la mejor alternativa.', questionCount: 60, durationMinutes: 90, difficulty: 'Advanced' },
  { id: 'final', title: 'Mock Exam 4 — Final Readiness', description: 'Simulador final con todos los dominios y prioridad en temas débiles.', questionCount: 60, durationMinutes: 90, difficulty: 'Final' },
  { id: 'realistic', title: 'Mock Exam 5 — Realistic / Hard', description: '60 escenarios largos con distractores plausibles, causas raíz y trade-offs similares a los mocks más difíciles.', questionCount: 60, durationMinutes: 120, difficulty: 'Realistic' },
]

function stableHash(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export function randomizeQuestionOptions(question: Question): Question {
  const optionIndexes = shuffle(question.options.map((_, index) => index))
  return {
    ...question,
    options: optionIndexes.map((index) => question.options[index]),
    answer: optionIndexes.indexOf(question.answer),
  }
}

function buildQuestionBank(questionSources: Question[][]): Question[] {
  const uniqueByPrompt = new Map<string, Question>()

  questionSources.flat().forEach((question) => {
    const signature = `${question.topicId}\u0000${question.prompt.trim()}`
    if (uniqueByPrompt.has(signature)) return
    uniqueByPrompt.set(signature, {
      ...question,
      id: `bank-${stableHash(signature)}`,
    })
  })

  return [...uniqueByPrompt.values()]
}

function fullQuestionBank(questions: Question[]): Question[] {
  return buildQuestionBank([
    realisticQuestionBank,
    challengingQuestionBank,
    applicationQuestionBank,
    questions,
    extraExamQuestions,
    finalExamQuestions,
    expandedQuestionBank,
  ])
}

function balancedRandomOrder(questions: Question[]): Question[] {
  const byTopic = new Map<string, Question[]>()
  questions.forEach((question) => {
    const list = byTopic.get(question.topicId) ?? []
    list.push(question)
    byTopic.set(question.topicId, list)
  })

  const topicLists = shuffle([...byTopic.values()].map((list) => shuffle(list)))
  const ordered: Question[] = []
  let index = 0

  while (ordered.length < questions.length) {
    topicLists.forEach((list) => {
      if (list[index]) ordered.push(list[index])
    })
    index += 1
  }

  return ordered
}

export function getExamQuestionPool(questions: Question[]): Question[] {
  return fullQuestionBank(questions)
}

export function getExamQuestionPoolSize(questions: Question[]): number {
  return getExamQuestionPool(questions).length
}

export function buildExam(
  config: ExamConfig,
  questions: Question[],
  excludedQuestionIds: string[] = [],
): Question[] {
  const questionBank = config.id === 'realistic'
    ? buildQuestionBank([realisticQuestionBank])
    : getExamQuestionPool(questions)
  const excluded = new Set(excludedQuestionIds)
  const unseenQuestions = questionBank.filter((question) => !excluded.has(question.id))
  const previouslySeenQuestions = questionBank.filter((question) => excluded.has(question.id))

  const ordered = [
    ...balancedRandomOrder(unseenQuestions),
    ...balancedRandomOrder(previouslySeenQuestions),
  ]

  return ordered
    .slice(0, Math.min(config.questionCount, ordered.length))
    .map(randomizeQuestionOptions)
}

// Practice uses the complete bank too. The realistic and higher-quality scenario
// banks are placed first so equal-priority topics surface exam-like distractors
// before older short-form drills. Answer positions are randomized once per page load.
const randomizedPracticeBank = fullQuestionBank(sharedPracticeQuestions).map(randomizeQuestionOptions)
sharedPracticeQuestions.splice(0, sharedPracticeQuestions.length, ...randomizedPracticeBank)