import { useMemo, useState } from 'react'
import { questions, topics, type Question, type Topic } from './data'
import { buildExam, examConfigs, getExamQuestionPoolSize, type ExamConfig } from './exams'
import { englishLessons } from './english-content'
import ProgressTransfer, { type TransferProgress } from './progress-transfer'
import { calculateWeightedExamScore, type BlueprintDomainScore } from './scoring'

type View = 'home' | 'course' | 'practice' | 'exams' | 'progress'
type TopicScore = { answered: number; correct: number }
type ExamQuestionCount = 15 | 30 | 60
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
type EnglishProgress = TransferProgress & { examAttempts: ExamAttempt[] }

const STORAGE_KEY = 'ccarf-trainer-progress-en-v1'
const EXAM_MODES: Array<{ questionCount: ExamQuestionCount; durationMinutes: number }> = [
  { questionCount: 15, durationMinutes: 23 },
  { questionCount: 30, durationMinutes: 45 },
  { questionCount: 60, durationMinutes: 90 },
]
const emptyProgress = (): EnglishProgress => ({ answered: 0, correct: 0, byTopic: {}, completedLessons: [], examAttempts: [] })

function loadProgress(): EnglishProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as Partial<EnglishProgress>
    return {
      ...emptyProgress(),
      ...stored,
      byTopic: stored.byTopic ?? {},
      completedLessons: stored.completedLessons ?? [],
      examAttempts: stored.examAttempts ?? [],
    }
  } catch { return emptyProgress() }
}

const examDescriptions: Record<string, string> = {
  foundation: 'A complete review focused on foundational concepts across all domains.',
  intermediate: 'Mixed scenarios with closer distractors and applied reasoning.',
  advanced: 'Architecture, tool selection, and best-answer scenarios.',
  final: 'A final readiness check covering the complete question bank.',
}

function explanationFor(question: Question) {
  const lesson = englishLessons[question.topicId]
  const answer = question.options[question.answer]
  return `Correct answer: ${String.fromCharCode(65 + question.answer)}. ${answer}. ${lesson?.summary ?? ''}`
}

function scorePoints(attempt: ExamAttempt) {
  return attempt.estimatedPoints ?? Math.round(attempt.percentage * 10)
}

function answerText(item: ExamReviewItem, answer: number) {
  return `${String.fromCharCode(65 + answer)}. ${item.options[answer] ?? 'Answer unavailable'}`
}

function ExamReview({ attempt }: { attempt: ExamAttempt }) {
  if (!attempt.review?.length) return <p className="empty-review">This attempt was saved before question-level review was available.</p>
  return <div className="exam-review-list">{attempt.review.map((item, index) => <article className={`exam-review-item ${item.isCorrect ? 'correct' : 'incorrect'}`} key={`${attempt.finishedAt}-${item.questionId}`}>
    <div className="review-heading"><strong>Question {index + 1}: {item.isCorrect ? 'Correct' : 'Incorrect'}</strong><span>{topics.find((topic) => topic.id === item.topicId)?.name ?? item.topicId}</span></div>
    <p className="review-prompt">{item.prompt}</p>
    <p><b>Your answer:</b> {answerText(item, item.selectedAnswer)}</p>
    {!item.isCorrect && <p><b>Correct answer:</b> {answerText(item, item.correctAnswer)}</p>}
    <p><b>Why:</b> {item.explanation}</p>
  </article>)}</div>
}

function AppEnglish() {
  const [progress, setProgress] = useState<EnglishProgress>(loadProgress)
  const [view, setView] = useState<View>('home')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [domainFilter, setDomainFilter] = useState('All')
  const [current, setCurrent] = useState<Question | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [activeExam, setActiveExam] = useState<ExamConfig | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [examIndex, setExamIndex] = useState(0)
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({})
  const [examResult, setExamResult] = useState<ExamAttempt | null>(null)
  const [selectedHistoryAttempt, setSelectedHistoryAttempt] = useState<ExamAttempt | null>(null)

  const domains = useMemo(() => ['All', ...Array.from(new Set(topics.map((topic) => topic.domain)))], [])
  const filteredTopics = domainFilter === 'All' ? topics : topics.filter((topic) => topic.domain === domainFilter)
  const examQuestion = examQuestions[examIndex]
  const coursePercent = Math.round(progress.completedLessons.length / topics.length * 100)
  const accuracy = progress.answered ? Math.round(progress.correct / progress.answered * 100) : 0
  const examPoolSize = useMemo(() => getExamQuestionPoolSize(questions), [])
  const attemptPoints = progress.examAttempts.map(scorePoints)
  const examAverage = attemptPoints.length ? Math.round(attemptPoints.reduce((sum, value) => sum + value, 0) / attemptPoints.length) : 0
  const bestExam = attemptPoints.length ? Math.max(...attemptPoints) : 0
  const examAnsweredCount = examQuestions.filter((question) => examAnswers[question.id] !== undefined).length
  const examComplete = examQuestions.length > 0 && examAnsweredCount === examQuestions.length

  function persist(next: EnglishProgress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setProgress(next)
  }

  function openTopic(topic: Topic) {
    setSelectedTopic(topic)
    persist({ ...progress, lastTopicId: topic.id })
    setView('course')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleComplete(topicId: string) {
    const completedLessons = progress.completedLessons.includes(topicId)
      ? progress.completedLessons.filter((id) => id !== topicId)
      : [...progress.completedLessons, topicId]
    persist({ ...progress, completedLessons })
  }

  function startPractice(topicId?: string) {
    const pool = topicId ? questions.filter((question) => question.topicId === topicId) : questions
    const next = pool[Math.floor(Math.random() * pool.length)] ?? questions[0]
    setCurrent(next)
    setSelected(null)
    setChecked(false)
    setView('practice')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submitPractice() {
    if (!current || selected === null || checked) return
    const isCorrect = selected === current.answer
    const old = progress.byTopic[current.topicId] ?? { answered: 0, correct: 0 }
    persist({
      ...progress,
      answered: progress.answered + 1,
      correct: progress.correct + (isCorrect ? 1 : 0),
      byTopic: {
        ...progress.byTopic,
        [current.topicId]: {
          answered: old.answered + 1,
          correct: old.correct + (isCorrect ? 1 : 0),
        } satisfies TopicScore,
      },
    })
    setChecked(true)
  }

  function nextPractice() {
    if (!current) return
    const pool = questions.filter((question) => question.id !== current.id)
    setCurrent(pool[Math.floor(Math.random() * pool.length)] ?? questions[0])
    setSelected(null)
    setChecked(false)
  }

  function startExam(config: ExamConfig, questionCount: ExamQuestionCount, durationMinutes: number) {
    const configuredExam: ExamConfig = { ...config, questionCount, durationMinutes }
    const usedQuestionIds = progress.examAttempts
      .filter((attempt) => attempt.examId === config.id)
      .flatMap((attempt) => attempt.questionIds ?? attempt.review?.map((item) => item.questionId) ?? [])
    setActiveExam(configuredExam)
    setExamQuestions(buildExam(configuredExam, questions, usedQuestionIds))
    setExamIndex(0)
    setExamAnswers({})
    setExamResult(null)
    setSelectedHistoryAttempt(null)
    setView('exams')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      explanation: explanationFor(question),
      isCorrect: examAnswers[question.id] === question.answer,
    }))
    const result: ExamAttempt = {
      examId: activeExam.id,
      title: `${activeExam.title} · ${activeExam.questionCount} questions`,
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
    persist({
      ...progress,
      answered: progress.answered + examQuestions.length,
      correct: progress.correct + weightedScore.rawCorrect,
      byTopic,
      examAttempts: [...progress.examAttempts, result],
    })
    setExamResult(result)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function importProgress(incoming: TransferProgress) {
    const validTopicIds = new Set(topics.map((topic) => topic.id))
    persist({
      answered: incoming.answered,
      correct: Math.min(incoming.correct, incoming.answered),
      byTopic: Object.fromEntries(Object.entries(incoming.byTopic).filter(([id]) => validTopicIds.has(id))),
      completedLessons: incoming.completedLessons.filter((id) => validTopicIds.has(id)),
      lastTopicId: incoming.lastTopicId && validTopicIds.has(incoming.lastTopicId) ? incoming.lastTopicId : undefined,
      examAttempts: progress.examAttempts,
    })
  }

  function switchToSpanish() { window.location.hash = '#/' }

  return <main className="shell">
    <nav className="top-nav"><button className="brand" onClick={() => setView('home')}>CCAR-F Trainer — English</button><div><button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button><button className={view === 'course' ? 'active' : ''} onClick={() => { setSelectedTopic(null); setView('course') }}>Course</button><button className={view === 'practice' ? 'active' : ''} onClick={() => startPractice()}>Practice</button><button className={view === 'exams' ? 'active' : ''} onClick={() => { setActiveExam(null); setExamResult(null); setView('exams') }}>Mock exams</button><button className={view === 'progress' ? 'active' : ''} onClick={() => setView('progress')}>Progress</button><button onClick={switchToSpanish}>Español</button></div></nav>

    {view === 'home' && <><header className="hero"><div><span className="eyebrow">PUBLIC ENGLISH VERSION</span><h1>Study the complete CCAR-F topic map.</h1><p>Course, practice, and mock-exam history stay on this device. Lesson and practice progress can be transferred by QR.</p></div><div className="hero-actions"><button className="primary" onClick={() => { setSelectedTopic(null); setView('course') }}>Open course</button><button className="primary" onClick={() => setView('exams')}>Open mock exams</button></div></header><section className="stats"><article><strong>{coursePercent}%</strong><span>Course completed</span></article><article><strong>{progress.answered}</strong><span>Questions answered</span></article><article><strong>{examAverage}/1000</strong><span>Mock-exam average</span></article></section><section className="dashboard-grid"><article className="panel"><span className="eyebrow">LOCAL LEARNING PROGRESS</span><h2>Continue on this device</h2><p>Completed lessons, practice accuracy, and exam history are stored locally.</p><button className="primary" onClick={() => startPractice()}>Start practice</button></article><article className="panel"><span className="eyebrow">LARGE QUESTION BANK</span><h2>{examPoolSize} available questions</h2><p>Choose 15, 30, or 60 questions at any difficulty level.</p><button className="secondary" onClick={() => setView('exams')}>Open mock exams</button></article></section></>}

    {view === 'course' && !selectedTopic && <section><div className="section-title"><div><span className="eyebrow">COMPLETE COURSE</span><h1>Domains and lessons</h1><p>Lesson completion is stored locally and can be transferred by QR.</p></div></div><div className="filter-row">{domains.map((domain) => <button key={domain} className={domainFilter === domain ? 'filter active' : 'filter'} onClick={() => setDomainFilter(domain)}>{domain}</button>)}</div><div className="topic-grid">{filteredTopics.map((topic) => { const lesson = englishLessons[topic.id]; const completed = progress.completedLessons.includes(topic.id); return <article className={`topic-card clickable ${completed ? 'completed' : ''}`} key={topic.id} onClick={() => openTopic(topic)}><div className="topic-meta"><div className="priority low">Course topic</div><span>{topic.domain}</span></div><h3>{completed ? '✓ ' : ''}{topic.name}</h3><p>{lesson?.summary ?? topic.name}</p><div className="lesson-card-meta"><span>{completed ? 'Completed' : 'Not completed'}</span><span>Exam guidance</span></div><div className="open-label">Open lesson →</div></article> })}</div></section>}

    {view === 'course' && selectedTopic && (() => { const lesson = englishLessons[selectedTopic.id]; const completed = progress.completedLessons.includes(selectedTopic.id); return <section className="lesson-page"><button className="back" onClick={() => setSelectedTopic(null)}>← Back to course</button><div className="lesson-header"><div><span className="eyebrow">{selectedTopic.domain}</span><h1>{selectedTopic.name}</h1><p>{lesson?.summary}</p></div></div><article className="lesson-article"><section className="content-section"><h2>Core idea</h2><p>{lesson?.summary}</p></section><section className="content-section"><h2>What you must understand</h2><ul>{lesson?.principles.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="content-section checklist"><h2>Exam traps and decision rules</h2>{lesson?.examTips.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}</section><section className="content-section summary-box"><h2>Practical example</h2><p>{lesson?.example}</p></section><div className="lesson-actions"><button className="primary" onClick={() => toggleComplete(selectedTopic.id)}>{completed ? 'Mark as pending' : '✓ Complete lesson'}</button><button className="primary" onClick={() => startPractice(selectedTopic.id)}>Practice this topic</button><button className="secondary" onClick={() => setSelectedTopic(null)}>Back to all topics</button></div></article></section> })()}

    {view === 'practice' && current && <section className="quiz-card"><div className="topic-label">{topics.find((topic) => topic.id === current.topicId)?.name}</div><h2>{current.prompt}</h2><div className="options">{current.options.map((option, index) => <button key={option} className={`option ${selected === index ? 'selected' : ''} ${checked && index === current.answer ? 'correct' : ''} ${checked && selected === index && index !== current.answer ? 'wrong' : ''}`} onClick={() => !checked && setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{!checked ? <button className="primary" disabled={selected === null} onClick={submitPractice}>Check answer</button> : <div className="feedback"><h3>{selected === current.answer ? 'Correct' : 'Incorrect'}</h3><p>{explanationFor(current)}</p><div className="feedback-actions"><button className="secondary" onClick={() => openTopic(topics.find((topic) => topic.id === current.topicId)!)}>Review lesson</button><button className="primary" onClick={nextPractice}>Next question</button></div></div>}</section>}

    {view === 'exams' && !activeExam && <section><div className="section-title"><div><span className="eyebrow">MOCK EXAMS</span><h1>Randomized exam practice</h1><p>Choose 15, 30, or 60 questions at any level. Suggested times are 23, 45, and 90 minutes.</p><p>{examPoolSize} questions are available. Each level consumes unseen questions first, so consecutive attempts do not repeat the same set.</p><p>Scores use the same weighted blueprint shown in the Spanish version.</p></div></div><div className="exam-grid">{examConfigs.map((exam) => <article className="exam-card" key={exam.id}><span className="exam-level">{exam.difficulty}</span><h2>{exam.title}</h2><p>{examDescriptions[exam.id]}</p><div className="exam-size-options" aria-label={`Question count for ${exam.title}`}>{EXAM_MODES.map((mode) => <button className="primary" key={mode.questionCount} onClick={() => startExam(exam, mode.questionCount, mode.durationMinutes)}><strong>{mode.questionCount}</strong><span>questions · {mode.durationMinutes} min</span></button>)}</div></article>)}</div></section>}

    {view === 'exams' && activeExam && !examResult && examQuestion && <section className="quiz-card exam-session"><div className="exam-header"><div><span className="eyebrow">{activeExam.title}</span><h2>Question {examIndex + 1} of {examQuestions.length}</h2></div><span>{examAnsweredCount}/{examQuestions.length} answered · {activeExam.durationMinutes} suggested min</span></div><div className="progress"><div style={{ width: `${(examIndex + 1) / examQuestions.length * 100}%` }} /></div><h2>{examQuestion.prompt}</h2><div className="options">{examQuestion.options.map((option, index) => <button key={option} className={`option ${examAnswers[examQuestion.id] === index ? 'selected' : ''}`} onClick={() => setExamAnswers({ ...examAnswers, [examQuestion.id]: index })}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div><div className="exam-nav"><button className="secondary" disabled={examIndex === 0} onClick={() => setExamIndex(examIndex - 1)}>Previous</button>{examIndex < examQuestions.length - 1 ? <button className="primary" disabled={examAnswers[examQuestion.id] === undefined} onClick={() => setExamIndex(examIndex + 1)}>Next</button> : <button className="primary" disabled={!examComplete} onClick={finishExam}>Finish exam</button>}</div></section>}

    {view === 'exams' && examResult && <section className="result-card"><span className="eyebrow">WEIGHTED RESULT</span><h1>{scorePoints(examResult)}/1000</h1><h2>{examResult.percentage}% weighted · {examResult.score}/{examResult.total} correct</h2><p>Unweighted accuracy: {examResult.rawPercentage ?? Math.round(examResult.score / examResult.total * 100)}%</p><p>{scorePoints(examResult) >= 720 ? 'Practice result above the reference threshold.' : 'Review the domains with the lowest weighted contribution.'}</p>{examResult.domainScores && <div className="result-review domain-review">{examResult.domainScores.map((domain) => <article key={domain.id}><strong>{domain.title} — {domain.weight}% weight</strong><p>{domain.correct}/{domain.total} correct · {domain.accuracy}% domain accuracy · {domain.weightedContribution} weighted points</p></article>)}</div>}<h2>Answer review</h2><ExamReview attempt={examResult} /><button className="primary" onClick={() => { setActiveExam(null); setExamResult(null) }}>Back to mock exams</button></section>}

    {view === 'progress' && <section><div className="section-title"><div><span className="eyebrow">PROGRESS</span><h1>History and performance</h1><p>Mock-exam history is stored only in this browser and is not transferred by QR.</p></div></div><section className="stats"><article><strong>{progress.examAttempts.length}</strong><span>Completed exams</span></article><article><strong>{examAverage}/1000</strong><span>Average score</span></article><article><strong>{bestExam}/1000</strong><span>Best score</span></article></section><div className="attempt-list">{progress.examAttempts.length === 0 ? <p>No mock exams completed yet.</p> : progress.examAttempts.slice().reverse().map((attempt) => <button className={`attempt-entry ${selectedHistoryAttempt?.finishedAt === attempt.finishedAt ? 'active' : ''}`} key={`${attempt.examId}-${attempt.finishedAt}`} onClick={() => setSelectedHistoryAttempt(attempt)}><div><strong>{attempt.title}</strong><span>{new Date(attempt.finishedAt).toLocaleString()} · {attempt.score}/{attempt.total} correct</span></div><b>{scorePoints(attempt)}/1000</b></button>)}</div>{selectedHistoryAttempt && <section className="history-detail"><div className="section-title"><div><span className="eyebrow">ATTEMPT DETAILS</span><h2>{selectedHistoryAttempt.title}</h2><p>{new Date(selectedHistoryAttempt.finishedAt).toLocaleString()} · {scorePoints(selectedHistoryAttempt)}/1000</p></div><button className="secondary" onClick={() => setSelectedHistoryAttempt(null)}>Close details</button></div><ExamReview attempt={selectedHistoryAttempt} /></section>}<ProgressTransfer locale="en" progress={progress} onImport={importProgress} /></section>}
  </main>
}

export default AppEnglish
