import { useMemo, useState } from 'react'
import { topics } from './data'
import type { BlueprintDomainScore } from './scoring'

type ReviewFilter = 'all' | 'correct' | 'incorrect'

export type StoredExamReviewItem = {
  questionId: string
  topicId: string
  prompt: string
  options: string[]
  selectedAnswer: number
  correctAnswer: number
  explanation: string
  isCorrect: boolean
}

export type StoredExamAttempt = {
  examId: string
  title: string
  score: number
  total: number
  percentage: number
  estimatedPoints?: number
  rawPercentage?: number
  domainScores?: BlueprintDomainScore[]
  questionIds?: string[]
  review?: StoredExamReviewItem[]
  finishedAt: string
}

type Props = {
  attempts: StoredExamAttempt[]
  locale: 'es' | 'en'
}

type StoredProps = {
  storageKey: string
  locale: 'es' | 'en'
}

function scorePoints(attempt: StoredExamAttempt) {
  return attempt.estimatedPoints ?? Math.round(attempt.percentage * 10)
}

function answerText(item: StoredExamReviewItem, answer: number) {
  const fallback = '—'
  return `${String.fromCharCode(65 + answer)}. ${item.options[answer] ?? fallback}`
}

export default function SimulatorHistory({ attempts, locale }: Props) {
  const [selectedAttempt, setSelectedAttempt] = useState<StoredExamAttempt | null>(null)
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const spanish = locale === 'es'

  const review = selectedAttempt?.review ?? []
  const filteredReview = useMemo(() => review.filter((item) => {
    if (filter === 'correct') return item.isCorrect
    if (filter === 'incorrect') return !item.isCorrect
    return true
  }), [review, filter])
  const correctCount = review.filter((item) => item.isCorrect).length
  const incorrectCount = review.length - correctCount

  if (!attempts.length) return null

  return <section className="simulator-history">
    <div className="section-title">
      <div>
        <span className="eyebrow">{spanish ? 'HISTORIAL DE RESPUESTAS' : 'ANSWER HISTORY'}</span>
        <h2>{spanish ? 'Revisar simuladores anteriores' : 'Review previous mock exams'}</h2>
        <p>{spanish ? 'Abre un intento para ver tus respuestas, la alternativa correcta y la explicación.' : 'Open an attempt to see your answers, the correct choice, and the explanation.'}</p>
      </div>
    </div>

    <div className="attempt-list">{attempts.slice().reverse().map((attempt) => <button
      className={`attempt-entry ${selectedAttempt?.finishedAt === attempt.finishedAt ? 'active' : ''}`}
      key={`${attempt.examId}-${attempt.finishedAt}`}
      onClick={() => { setSelectedAttempt(attempt); setFilter('all') }}
    >
      <div>
        <strong>{attempt.title}</strong>
        <span>{new Date(attempt.finishedAt).toLocaleString(spanish ? 'es-CL' : 'en-US')} · {attempt.score}/{attempt.total} {spanish ? 'correctas' : 'correct'}</span>
      </div>
      <b>{scorePoints(attempt)}/1000</b>
    </button>)}</div>

    {selectedAttempt && <section className="history-detail">
      <div className="section-title">
        <div>
          <span className="eyebrow">{spanish ? 'DETALLE DEL INTENTO' : 'ATTEMPT DETAILS'}</span>
          <h2>{selectedAttempt.title}</h2>
          <p>{new Date(selectedAttempt.finishedAt).toLocaleString(spanish ? 'es-CL' : 'en-US')} · {scorePoints(selectedAttempt)}/1000</p>
        </div>
        <button className="secondary" onClick={() => setSelectedAttempt(null)}>{spanish ? 'Cerrar detalle' : 'Close details'}</button>
      </div>

      {!review.length ? <p className="empty-review">{spanish
        ? 'Este intento se guardó antes de que existiera el detalle por pregunta.'
        : 'This attempt was saved before question-level review was available.'}</p>
        : <>
          <div className="review-filter" role="group" aria-label={spanish ? 'Filtrar respuestas' : 'Filter answers'}>
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{spanish ? `Todas (${review.length})` : `All (${review.length})`}</button>
            <button className={filter === 'incorrect' ? 'active' : ''} onClick={() => setFilter('incorrect')}>{spanish ? `Incorrectas (${incorrectCount})` : `Incorrect (${incorrectCount})`}</button>
            <button className={filter === 'correct' ? 'active' : ''} onClick={() => setFilter('correct')}>{spanish ? `Correctas (${correctCount})` : `Correct (${correctCount})`}</button>
          </div>
          <div className="exam-review-list">{filteredReview.map((item) => {
            const originalIndex = review.findIndex((candidate) => candidate.questionId === item.questionId)
            return <article className={`exam-review-item ${item.isCorrect ? 'correct' : 'incorrect'}`} key={`${selectedAttempt.finishedAt}-${item.questionId}`}>
              <div className="review-heading">
                <strong>{spanish ? 'Pregunta' : 'Question'} {originalIndex + 1}: {item.isCorrect ? (spanish ? 'Correcta' : 'Correct') : (spanish ? 'Incorrecta' : 'Incorrect')}</strong>
                <span>{topics.find((topic) => topic.id === item.topicId)?.name ?? item.topicId}</span>
              </div>
              <p className="review-prompt">{item.prompt}</p>
              <p><b>{spanish ? 'Tu respuesta:' : 'Your answer:'}</b> {answerText(item, item.selectedAnswer)}</p>
              <p><b>{spanish ? 'Respuesta correcta:' : 'Correct answer:'}</b> {answerText(item, item.correctAnswer)}</p>
              <p><b>{spanish ? 'Por qué:' : 'Why:'}</b> {item.explanation}</p>
            </article>
          })}</div>
        </>}
    </section>}
  </section>
}

export function StoredSimulatorHistory({ storageKey, locale }: StoredProps) {
  const [open, setOpen] = useState(false)
  const [attempts, setAttempts] = useState<StoredExamAttempt[]>([])
  const spanish = locale === 'es'

  function openHistory() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as { examAttempts?: StoredExamAttempt[] }
      setAttempts(Array.isArray(stored.examAttempts) ? stored.examAttempts : [])
    } catch {
      setAttempts([])
    }
    setOpen(true)
  }

  return <>
    <button className="history-floating-button" onClick={openHistory} aria-label={spanish ? 'Abrir historial de simuladores' : 'Open mock-exam history'}>
      <span aria-hidden="true">▤</span>
      {spanish ? 'Historial simuladores' : 'Mock history'}
    </button>
    {open && <div className="history-overlay" role="dialog" aria-modal="true" aria-label={spanish ? 'Historial de simuladores' : 'Mock-exam history'} onClick={() => setOpen(false)}>
      <aside className="history-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="history-drawer-header">
          <div>
            <span className="eyebrow">{spanish ? 'SIMULADORES' : 'MOCK EXAMS'}</span>
            <h2>{spanish ? 'Historial de respuestas' : 'Answer history'}</h2>
          </div>
          <button className="secondary" onClick={() => setOpen(false)}>{spanish ? 'Cerrar' : 'Close'}</button>
        </div>
        {attempts.length
          ? <SimulatorHistory attempts={attempts} locale={locale} />
          : <p className="empty-review">{spanish ? 'Todavía no hay simuladores completados en este dispositivo.' : 'No completed mock exams are stored on this device yet.'}</p>}
      </aside>
    </div>}
  </>
}
