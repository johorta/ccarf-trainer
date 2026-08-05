import type { Question } from './data'
import { extraExamQuestions } from './extraExamQuestions'
import { finalExamQuestions } from './finalExamQuestions'

export type ExamConfig = {
  id: string
  title: string
  description: string
  questionCount: number
  durationMinutes: number
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Final'
}

export const examConfigs: ExamConfig[] = [
  { id: 'foundation', title: 'Mock Exam 1 — Foundation', description: 'Repaso completo con énfasis en conceptos fundamentales.', questionCount: 60, durationMinutes: 90, difficulty: 'Foundation' },
  { id: 'intermediate', title: 'Mock Exam 2 — Intermediate', description: 'Escenarios mixtos con distractores más cercanos al examen.', questionCount: 60, durationMinutes: 90, difficulty: 'Intermediate' },
  { id: 'advanced', title: 'Mock Exam 3 — Advanced', description: 'Preguntas de aplicación, arquitectura y selección de la mejor alternativa.', questionCount: 60, durationMinutes: 90, difficulty: 'Advanced' },
  { id: 'final', title: 'Mock Exam 4 — Final Readiness', description: 'Simulador final con todos los dominios y prioridad en temas débiles.', questionCount: 60, durationMinutes: 90, difficulty: 'Final' },
]

function uniqueQuestionsById(questionSources: Question[][]): Question[] {
  const uniqueQuestions = new Map<string, Question>()

  questionSources.flat().forEach((question) => {
    if (!uniqueQuestions.has(question.id)) uniqueQuestions.set(question.id, question)
  })

  return [...uniqueQuestions.values()]
}

export function buildExam(config: ExamConfig, questions: Question[]): Question[] {
  // Several question modules historically reused IDs such as q16–q60.
  // Exam answers are stored by question ID, so duplicates prevented the
  // answered-question count from ever reaching 60 and kept Finish disabled.
  const questionBank = uniqueQuestionsById([questions, extraExamQuestions, finalExamQuestions])
  const byTopic = new Map<string, Question[]>()
  questionBank.forEach((question) => {
    const list = byTopic.get(question.topicId) ?? []
    list.push(question)
    byTopic.set(question.topicId, list)
  })

  const interleaved: Question[] = []
  let index = 0
  const topicLists = [...byTopic.values()]
  while (interleaved.length < questionBank.length) {
    topicLists.forEach((list) => {
      if (list[index]) interleaved.push(list[index])
    })
    index += 1
  }

  const offset = examConfigs.findIndex((exam) => exam.id === config.id)
  const rotated = [...interleaved.slice(offset), ...interleaved.slice(0, offset)]
  return rotated.slice(0, Math.min(config.questionCount, rotated.length))
}
