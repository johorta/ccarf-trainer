import { useMemo, useState } from 'react'
import { questions, topics, type Question, type Topic } from './data'
import { lessons, type LessonContent } from './lessons'
import { buildExam, examConfigs, getExamQuestionPoolSize, type ExamConfig } from './exams'
import { calculateWeightedExamScore, type BlueprintDomainScore } from './scoring'

type TopicScore = { answered: number; correct: number }
type ExamReviewItem = {
  questionId: string
  topicId: string
  prompt: string
  options: string[]
  selectedAnswer: number
  correctAnswer: number
  explanation: string
  isCorrect: boolean
}
type ExamAttempt = {
  examId: string
  title: string
  score: number
  total: number
  percentage: number
  estimatedPoints?: number
  rawPercentage?: number
  domainScores?: BlueprintDomainScore[]
  questionIds?: string[]
  review?: ExamReviewItem[]
  finishedAt: string
}
type Progress = {
  answered: number
  correct: number
  byTopic: Record<string, TopicScore>
  completedLessons: string[]
  lastTopicId?: string
  examAttempts: ExamAttempt[]
}
type View = 'dashboard' | 'course' | 'practice' | 'exams' | 'progress'

const STORAGE_KEY = 'ccarf-trainer-progress-v2'
const emptyProgress = (): Progress => ({ answered: 0, correct: 0, byTopic: {}, completedLessons: [], examAttempts: [] })

function loadProgress(): Progress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as Partial<Progress>
    return { ...emptyProgress(), ...stored, completedLessons: stored.completedLessons ?? [], examAttempts: stored.examAttempts ?? [] }
  } catch { return emptyProgress() }
}

function genericLesson(topic: Topic): LessonContent {
  return {
    topicId: topic.id,
    readingMinutes: topic.priority === 'high' ? 14 : 9,
    difficulty: topic.priority === 'high' ? 4 : topic.priority === 'medium' ? 3 : 2,
    objectives: topic.keyPoints,
    sections: [
      { title: 'Concepto central', paragraphs: [topic.lesson, 'Estudia este objetivo entendiendo por qué una alternativa es mejor que las demás, no solo memorizando una definición.'] },
      { title: 'Puntos que debes dominar', bullets: topic.keyPoints },
      { title: 'Trampas frecuentes del examen', bullets: topic.traps },
      { title: 'Escenario práctico', paragraphs: [topic.example] },
    ],
    checklist: topic.keyPoints.map((point) => `Puedo explicar: ${point}`),
    summary: [topic.lesson, ...topic.keyPoints],
  }
}

function scorePoints(attempt: ExamAttempt) {
  return attempt.estimatedPoints ?? Math.round(attempt.percentage * 10)
}

function answerText(item: ExamReviewItem, answer: number) {
  return `${String.fromCharCode(65 + answer)}. ${item.options[answer] ?? 'Respuesta no disponible'}`
}

function ExamReview({ attempt }: { attempt: ExamAttempt }) {
  if (!attempt.review?.length) return <p className="empty-review">Este intento fue guardado antes de que existiera el detalle por pregunta.</p>
  return <div className="exam-review-list">{attempt.review.map((item, index) => <article className={`exam-review-item ${item.isCorrect ? 'correct' : 'incorrect'}`} key={`${attempt.finishedAt}-${item.questionId}`}>
    <div className="review-heading"><strong>Pregunta {index + 1}: {item.isCorrect ? 'Correcta' : 'Incorrecta'}</strong><span>{topics.find((topic) => topic.id === item.topicId)?.name ?? item.topicId}</span></div>
    <p className="review-prompt">{item.prompt}</p>
    <p><b>Tu respuesta:</b> {answerText(item, item.selectedAnswer)}</p>
    {!item.isCorrect && <p><b>Respuesta correcta:</b> {answerText(item, item.correctAnswer)}</p>}
    <p><b>Por qué:</b> {item.explanation}</p>
  </article>)}</div>
}

function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [view, setView] = useState<View>('dashboard')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [domainFilter, setDomainFilter] = useState('Todos')
  const [current, setCurrent] = useState<Question | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [activeExam, setActiveExam] = useState<ExamConfig | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [examIndex, setExamIndex] = useState(0)
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({})
  const [examResult, setExamResult] = useState<ExamAttempt | null>(null)
  const [selectedHistoryAttempt, setSelectedHistoryAttempt] = useState<ExamAttempt | null>(null)

  const domains = ['Todos', ...Array.from(new Set(topics.map((topic) => topic.domain)))]
  const accuracy = progress.answered ? Math.round(progress.correct / progress.answered * 100) : 0
  const coursePercent = Math.round(progress.completedLessons.length / topics.length * 100)
  const examPoolSize = useMemo(() => getExamQuestionPoolSize(questions), [])
  const attemptPoints = progress.examAttempts.map(scorePoints)
  const examAverage = attemptPoints.length ? Math.round(attemptPoints.reduce((sum, value) => sum + value, 0) / attemptPoints.length) : 0
  const bestExam = attemptPoints.length ? Math.max(...attemptPoints) : 0
  const weightedQuestions = useMemo(() => [...questions].sort((a, b) => {
    const ta = topics.find((topic) => topic.id === a.topicId)!
    const tb = topics.find((topic) => topic.id === b.topicId)!
    const sa = progress.byTopic[a.topicId]
    const sb = progress.byTopic[b.topicId]
    const aa = sa?.answered ? sa.correct / sa.answered : ta.reportScore / 100
    const ab = sb?.answered ? sb.correct / sb.answered : tb.reportScore / 100
    return (1 - ab) - (1 - aa)
  }), [progress])

  function persist(next: Progress) { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setProgress(next) }
  function scoreFor(topic: Topic) { const s = progress.byTopic[topic.id]; return s?.answered ? Math.round(s.correct / s.answered * 100) : topic.reportScore }
  function openTopic(topic: Topic) { setSelectedTopic(topic); persist({ ...progress, lastTopicId: topic.id }); setView('course'); window.scrollTo({ top: 0 }) }
  function toggleComplete(id: string) {
    const list = progress.completedLessons.includes(id) ? progress.completedLessons.filter((item) => item !== id) : [...progress.completedLessons, id]
    persist({ ...progress, completedLessons: list })
  }
  function nextPendingAfter(id: string) {
    const index = topics.findIndex((topic) => topic.id === id)
    const orderedTopics = [...topics.slice(index + 1), ...topics.slice(0, index)]
    return orderedTopics.find((topic) => !progress.completedLessons.includes(topic.id))
  }

  function startPractice(topicId?: string) {
    const pool = topicId ? weightedQuestions.filter((q) => q.topicId === topicId) : weightedQuestions
    setCurrent(pool[0] ?? weightedQuestions[0]); setSelected(null); setChecked(false); setView('practice'); window.scrollTo({ top: 0 })
  }
  function submitPractice() {
    if (!current || selected === null || checked) return
    const correct = selected === current.answer
    const old = progress.byTopic[current.topicId] ?? { answered: 0, correct: 0 }
    persist({ ...progress, answered: progress.answered + 1, correct: progress.correct + (correct ? 1 : 0), byTopic: { ...progress.byTopic, [current.topicId]: { answered: old.answered + 1, correct: old.correct + (correct ? 1 : 0) } } })
    setChecked(true)
  }
  function nextPractice() {
    if (!current) return
    const index = weightedQuestions.findIndex((q) => q.id === current.id)
    setCurrent(weightedQuestions[(index + 1) % weightedQuestions.length]); setSelected(null); setChecked(false)
  }

  function startExam(config: ExamConfig) {
    const usedQuestionIds = progress.examAttempts
      .filter((attempt) => attempt.examId === config.id)
      .flatMap((attempt) => attempt.questionIds ?? attempt.review?.map((item) => item.questionId) ?? [])
    setActiveExam(config)
    setExamQuestions(buildExam(config, questions, usedQuestionIds))
    setExamIndex(0)
    setExamAnswers({})
    setExamResult(null)
    setSelectedHistoryAttempt(null)
    setView('exams')
    window.scrollTo({ top: 0 })
  }
  function finishExam() {
    if (!activeExam || !examQuestions.every((question) => examAnswers[question.id] !== undefined)) return
    const weightedScore = calculateWeightedExamScore(examQuestions, examAnswers)
    const review: ExamReviewItem[] = examQuestions.map((question) => ({
      questionId: question.id,
      topicId: question.topicId,
      prompt: question.prompt,
      options: question.options,
      selectedAnswer: examAnswers[question.id],
      correctAnswer: question.answer,
      explanation: question.explanationEs,
      isCorrect: examAnswers[question.id] === question.answer,
    }))
    const result: ExamAttempt = {
      examId: activeExam.id,
      title: activeExam.title,
      score: weightedScore.rawCorrect,
      total: weightedScore.total,
      percentage: weightedScore.weightedPercentage,
      estimatedPoints: weightedScore.estimatedPoints,
      rawPercentage: weightedScore.rawPercentage,
      domainScores: weightedScore.domains,
      questionIds: examQuestions.map((question) => question.id),
      review,
      finishedAt: new Date().toISOString(),
    }
    const byTopic = { ...progress.byTopic }
    examQuestions.forEach((question) => {
      const old = byTopic[question.topicId] ?? { answered: 0, correct: 0 }
      byTopic[question.topicId] = { answered: old.answered + 1, correct: old.correct + (examAnswers[question.id] === question.answer ? 1 : 0) }
    })
    persist({ ...progress, answered: progress.answered + examQuestions.length, correct: progress.correct + weightedScore.rawCorrect, byTopic, examAttempts: [...progress.examAttempts, result] })
    setExamResult(result)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'ccarf-trainer-progress.json'; link.click(); URL.revokeObjectURL(link.href)
  }

  const lastVisitedTopic = topics.find((topic) => topic.id === progress.lastTopicId)
  const nextPendingTopic = topics.find((topic) => !progress.completedLessons.includes(topic.id))
  const continueTopic = lastVisitedTopic && !progress.completedLessons.includes(lastVisitedTopic.id) ? lastVisitedTopic : nextPendingTopic ?? lastVisitedTopic ?? topics[0]
  const courseComplete = progress.completedLessons.length === topics.length
  const filteredTopics = domainFilter === 'Todos' ? topics : topics.filter((topic) => topic.domain === domainFilter)
  const examQuestion = examQuestions[examIndex]
  const examAnsweredCount = examQuestions.filter((question) => examAnswers[question.id] !== undefined).length
  const examComplete = examQuestions.length > 0 && examAnsweredCount === examQuestions.length

  function continueCourse() {
    if (courseComplete) { setSelectedTopic(null); setView('course'); window.scrollTo({ top: 0 }); return }
    openTopic(continueTopic)
  }

  return <main className="shell">
    <nav className="top-nav"><button className="brand" onClick={() => setView('dashboard')}>CCAR-F Trainer</button><div><button onClick={() => setView('dashboard')}>Inicio</button><button onClick={() => { setSelectedTopic(null); setView('course') }}>Curso</button><button onClick={() => startPractice()}>Práctica</button><button onClick={() => { setActiveExam(null); setExamResult(null); setView('exams') }}>Simuladores</button><button onClick={() => setView('progress')}>Progreso</button></div></nav>

    {view === 'dashboard' && <><header className="hero"><div><span className="eyebrow">CURSO INTERACTIVO CCAR-F</span><h1>Estudia, practica y valida tu preparación.</h1><p>Contenido en español, preguntas en inglés y simuladores completos con todos los dominios.</p></div><div className="hero-actions"><button className="primary" onClick={continueCourse}>{courseComplete ? 'Ver curso completo' : 'Continuar curso'}</button><button className="primary" onClick={() => setView('exams')}>Abrir simuladores</button></div></header><section className="stats"><article><strong>{coursePercent}%</strong><span>Curso completado</span></article><article><strong>{progress.answered}</strong><span>Preguntas respondidas</span></article><article><strong>{accuracy}%</strong><span>Precisión</span></article></section><section className="dashboard-grid"><article className="panel"><span className="eyebrow">{courseComplete ? 'CURSO COMPLETADO' : 'SIGUIENTE LECCIÓN'}</span><h2>{courseComplete ? 'Todas las lecciones están completadas' : continueTopic.name}</h2><p>{courseComplete ? 'Puedes volver al curso para repasar cualquier tema o reforzar los dominios con menor desempeño.' : continueTopic.lesson}</p><button className="primary" onClick={continueCourse}>{courseComplete ? 'Repasar curso' : 'Abrir lección'}</button></article><article className="panel"><span className="eyebrow">EVALUACIÓN FINAL</span><h2>{examConfigs.length} simuladores</h2><p>Banco de {examPoolSize} preguntas con intentos aleatorios y revisión completa.</p><button className="secondary" onClick={() => setView('exams')}>Ver exámenes</button></article></section></>}

    {view === 'course' && !selectedTopic && <section><div className="section-title"><div><span className="eyebrow">CURSO COMPLETO</span><h1>Dominios y lecciones</h1></div><button className="secondary" onClick={exportProgress}>Exportar progreso</button></div><div className="filter-row">{domains.map((domain) => <button key={domain} className={domainFilter === domain ? 'filter active' : 'filter'} onClick={() => setDomainFilter(domain)}>{domain}</button>)}</div><div className="topic-grid">{filteredTopics.map((topic) => <article className={`topic-card clickable ${progress.completedLessons.includes(topic.id) ? 'completed' : ''}`} key={topic.id} onClick={() => openTopic(topic)}><div className="topic-meta"><div className={`priority ${topic.priority}`}>{topic.priority === 'high' ? 'Alta prioridad' : topic.priority === 'medium' ? 'Prioridad media' : 'Refuerzo'}</div><span>{topic.domain}</span></div><h3>{progress.completedLessons.includes(topic.id) ? '✓ ' : ''}{topic.name}</h3><p>{topic.lesson}</p><div className="score-row"><span>Dominio estimado</span><strong>{scoreFor(topic)}%</strong></div><div className="progress"><div style={{ width: `${scoreFor(topic)}%` }} /></div><div className="open-label">Abrir lección →</div></article>)}</div></section>}

    {view === 'course' && selectedTopic && (() => { const lesson = lessons[selectedTopic.id] ?? genericLesson(selectedTopic); const nextLesson = nextPendingAfter(selectedTopic.id); const lessonComplete = progress.completedLessons.includes(selectedTopic.id); return <section className="lesson-page"><button className="back" onClick={() => setSelectedTopic(null)}>← Volver al curso</button><div className="lesson-header"><div><span className="eyebrow">{selectedTopic.domain}</span><h1>{selectedTopic.name}</h1><p>{selectedTopic.lesson}</p></div></div><article className="lesson-article"><section className="learning-objectives"><h2>Qué aprenderás</h2><ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul></section>{lesson.sections.map((section) => <section className="content-section" key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{section.diagram && <div className="diagram">{section.diagram.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}</div>}{section.goodExample && <div className="example good"><strong>Ejemplo recomendado</strong><pre>{section.goodExample}</pre></div>}{section.badExample && <div className="example bad"><strong>Ejemplo problemático</strong><pre>{section.badExample}</pre></div>}</section>)}<section className="content-section summary-box"><h2>Resumen</h2><ul>{lesson.summary.map((item) => <li key={item}>{item}</li>)}</ul></section><div className="lesson-actions"><button className="primary" onClick={() => toggleComplete(selectedTopic.id)}>{lessonComplete ? 'Marcar pendiente' : '✓ Completar lección'}</button>{lessonComplete && (nextLesson ? <button className="primary" onClick={() => openTopic(nextLesson)}>Siguiente lección →</button> : <button className="primary" onClick={() => { setSelectedTopic(null); window.scrollTo({ top: 0 }) }}>Ver curso completo</button>)}<button className="primary" onClick={() => startPractice(selectedTopic.id)}>Practicar tema</button></div></article></section> })()}

    {view === 'practice' && current && <section className="quiz-card"><div className="topic-label">{topics.find((topic) => topic.id === current.topicId)?.name}</div><h2>{current.prompt}</h2><div className="options">{current.options.map((option, index) => <button key={option} className={`option ${selected === index ? 'selected' : ''} ${checked && index === current.answer ? 'correct' : ''} ${checked && selected === index && index !== current.answer ? 'wrong' : ''}`} onClick={() => !checked && setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{!checked ? <button className="primary" disabled={selected === null} onClick={submitPractice}>Confirmar respuesta</button> : <div className="feedback"><h3>{selected === current.answer ? 'Correcta' : 'Incorrecta'}</h3><p>{current.explanationEs}</p>{selected !== current.answer && <button className="secondary" onClick={() => openTopic(topics.find((topic) => topic.id === current.topicId)!)}>Repasar lección</button>}<button className="primary" onClick={nextPractice}>Siguiente pregunta</button></div>}</section>}

    {view === 'exams' && !activeExam && <section><div className="section-title"><div><span className="eyebrow">SIMULADORES</span><h1>Exámenes de prueba</h1><p>Hay {examPoolSize} preguntas disponibles. Cada nivel evita repetir preguntas ya usadas hasta agotar su banco y luego prioriza las menos recientes.</p><p>El resultado pondera Agentic Architecture 27%, Claude Code 20%, Prompt Engineering 20%, Tool Design & MCP 18% y Context Management 15%.</p></div></div><div className="exam-grid">{examConfigs.map((exam) => <article className="exam-card" key={exam.id}><span className="exam-level">{exam.difficulty}</span><h2>{exam.title}</h2><p>{exam.description}</p><div className="exam-meta"><span>{exam.questionCount} preguntas</span><span>{exam.durationMinutes} min</span></div><button className="primary" onClick={() => startExam(exam)}>Comenzar examen</button></article>)}</div></section>}

    {view === 'exams' && activeExam && !examResult && examQuestion && <section className="quiz-card exam-session"><div className="exam-header"><div><span className="eyebrow">{activeExam.title}</span><h2>Pregunta {examIndex + 1} de {examQuestions.length}</h2></div><span>{examAnsweredCount}/{examQuestions.length} respondidas</span></div><div className="progress"><div style={{ width: `${(examIndex + 1) / examQuestions.length * 100}%` }} /></div><h2>{examQuestion.prompt}</h2><div className="options">{examQuestion.options.map((option, index) => <button key={option} className={`option ${examAnswers[examQuestion.id] === index ? 'selected' : ''}`} onClick={() => setExamAnswers({ ...examAnswers, [examQuestion.id]: index })}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div><div className="exam-nav"><button className="secondary" disabled={examIndex === 0} onClick={() => setExamIndex(examIndex - 1)}>Anterior</button>{examIndex < examQuestions.length - 1 ? <button className="primary" disabled={examAnswers[examQuestion.id] === undefined} onClick={() => setExamIndex(examIndex + 1)}>Siguiente</button> : <button className="primary" disabled={!examComplete} onClick={finishExam}>Finalizar examen</button>}</div></section>}

    {view === 'exams' && examResult && <section className="result-card"><span className="eyebrow">RESULTADO PONDERADO</span><h1>{scorePoints(examResult)}/1000</h1><h2>{examResult.percentage}% ponderado · {examResult.score}/{examResult.total} respuestas correctas</h2><p>Precisión sin ponderar: {examResult.rawPercentage ?? Math.round(examResult.score / examResult.total * 100)}%</p><p>{scorePoints(examResult) >= 720 ? 'Resultado de práctica sobre el umbral de referencia.' : 'Conviene reforzar los dominios con menor aporte ponderado.'}</p>{examResult.domainScores && <div className="result-review domain-review">{examResult.domainScores.map((domain) => <article key={domain.id}><strong>{domain.title} — peso {domain.weight}%</strong><p>{domain.correct}/{domain.total} correctas · {domain.accuracy}% en el dominio · aporta {domain.weightedContribution} puntos porcentuales</p></article>)}</div>}<h2>Revisión de respuestas</h2><ExamReview attempt={examResult} /><button className="primary" onClick={() => { setActiveExam(null); setExamResult(null) }}>Volver a simuladores</button></section>}

    {view === 'progress' && <section><div className="section-title"><div><span className="eyebrow">PROGRESO</span><h1>Historial y desempeño</h1></div><button className="secondary" onClick={exportProgress}>Exportar JSON</button></div><section className="stats"><article><strong>{progress.examAttempts.length}</strong><span>Exámenes rendidos</span></article><article><strong>{examAverage}/1000</strong><span>Promedio de simuladores</span></article><article><strong>{bestExam}/1000</strong><span>Mejor resultado</span></article></section><div className="attempt-list">{progress.examAttempts.length === 0 ? <p>Aún no has completado simuladores.</p> : progress.examAttempts.slice().reverse().map((attempt) => <button className={`attempt-entry ${selectedHistoryAttempt?.finishedAt === attempt.finishedAt ? 'active' : ''}`} key={`${attempt.examId}-${attempt.finishedAt}`} onClick={() => setSelectedHistoryAttempt(attempt)}><div><strong>{attempt.title}</strong><span>{new Date(attempt.finishedAt).toLocaleString()} · {attempt.score}/{attempt.total} correctas</span></div><b>{scorePoints(attempt)}/1000</b></button>)}</div>{selectedHistoryAttempt && <section className="history-detail"><div className="section-title"><div><span className="eyebrow">DETALLE DEL INTENTO</span><h2>{selectedHistoryAttempt.title}</h2><p>{new Date(selectedHistoryAttempt.finishedAt).toLocaleString()} · {scorePoints(selectedHistoryAttempt)}/1000</p></div><button className="secondary" onClick={() => setSelectedHistoryAttempt(null)}>Cerrar detalle</button></div><ExamReview attempt={selectedHistoryAttempt} /></section>}</section>}
  </main>
}

export default App
