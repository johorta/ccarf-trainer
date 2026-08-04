import { useMemo, useState } from 'react'
import { questions, topics, type Question, type Topic } from './data'
import { buildExam, examConfigs, type ExamConfig } from './exams'
import { englishLessons } from './english-content'

type View = 'home' | 'course' | 'practice' | 'exams'
type ExamResult = { score: number; total: number; percentage: number }

const examDescriptions: Record<string, string> = {
  foundation: 'A complete review focused on foundational concepts across all domains.',
  intermediate: 'Mixed scenarios with closer distractors and applied reasoning.',
  advanced: 'Architecture, tool selection, and best-answer scenarios.',
  final: 'A final readiness check covering the complete question bank.'
}

function explanationFor(question: Question) {
  const lesson = englishLessons[question.topicId]
  const answer = question.options[question.answer]
  return `Correct answer: ${String.fromCharCode(65 + question.answer)}. ${answer} ${lesson?.summary ?? ''}`
}

function AppEnglish() {
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
  const [examResult, setExamResult] = useState<ExamResult | null>(null)

  const domains = useMemo(() => ['All', ...Array.from(new Set(topics.map((topic) => topic.domain)))], [])
  const filteredTopics = domainFilter === 'All' ? topics : topics.filter((topic) => topic.domain === domainFilter)
  const examQuestion = examQuestions[examIndex]

  function openTopic(topic: Topic) {
    setSelectedTopic(topic)
    setView('course')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  function nextPractice() {
    if (!current) return
    const pool = questions.filter((question) => question.id !== current.id)
    setCurrent(pool[Math.floor(Math.random() * pool.length)] ?? questions[0])
    setSelected(null)
    setChecked(false)
  }

  function startExam(config: ExamConfig) {
    setActiveExam(config)
    setExamQuestions(buildExam(config, questions))
    setExamIndex(0)
    setExamAnswers({})
    setExamResult(null)
    setView('exams')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function finishExam() {
    const score = examQuestions.filter((question) => examAnswers[question.id] === question.answer).length
    setExamResult({ score, total: examQuestions.length, percentage: Math.round(score / examQuestions.length * 100) })
  }

  function switchToSpanish() {
    window.location.hash = '#/'
  }

  return (
    <main className="shell">
      <nav className="top-nav">
        <button className="brand" onClick={() => setView('home')}>CCAR-F Trainer — English</button>
        <div>
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button>
          <button className={view === 'course' ? 'active' : ''} onClick={() => { setSelectedTopic(null); setView('course') }}>Course</button>
          <button className={view === 'practice' ? 'active' : ''} onClick={() => startPractice()}>Practice</button>
          <button className={view === 'exams' ? 'active' : ''} onClick={() => { setActiveExam(null); setExamResult(null); setView('exams') }}>Mock exams</button>
          <button onClick={switchToSpanish}>Español</button>
        </div>
      </nav>

      {view === 'home' && (
        <>
          <header className="hero">
            <div>
              <span className="eyebrow">PUBLIC ENGLISH VERSION</span>
              <h1>Study the complete CCAR-F topic map.</h1>
              <p>English lessons, English practice questions, and mock exams. This version does not store progress or exam history.</p>
            </div>
            <div className="hero-actions">
              <button className="primary" onClick={() => { setSelectedTopic(null); setView('course') }}>Open course</button>
              <button className="primary" onClick={() => setView('exams')}>Open mock exams</button>
            </div>
          </header>

          <section className="stats">
            <article><strong>{topics.length}</strong><span>Course objectives</span></article>
            <article><strong>{questions.length}</strong><span>Practice questions</span></article>
            <article><strong>0</strong><span>Stored exam attempts</span></article>
          </section>

          <section className="dashboard-grid">
            <article className="panel">
              <span className="eyebrow">PRIVACY-FRIENDLY PRACTICE</span>
              <h2>No personal exam history</h2>
              <p>Answers and scores exist only in the current browser session. Reloading the page clears the current result.</p>
              <button className="primary" onClick={() => startPractice()}>Start practice</button>
            </article>
            <article className="panel">
              <span className="eyebrow">FULL COVERAGE</span>
              <h2>Four domains</h2>
              <p>Agentic Architecture, Claude Code, Claude API, and MCP & Tool Use.</p>
              <button className="secondary" onClick={() => { setSelectedTopic(null); setView('course') }}>Browse topics</button>
            </article>
          </section>
        </>
      )}

      {view === 'course' && !selectedTopic && (
        <section>
          <div className="section-title">
            <div>
              <span className="eyebrow">COMPLETE COURSE</span>
              <h1>Domains and lessons</h1>
              <p>This public version uses neutral coverage and does not expose personalized scores or priorities.</p>
            </div>
          </div>
          <div className="filter-row">
            {domains.map((domain) => (
              <button key={domain} className={domainFilter === domain ? 'filter active' : 'filter'} onClick={() => setDomainFilter(domain)}>{domain}</button>
            ))}
          </div>
          <div className="topic-grid">
            {filteredTopics.map((topic) => {
              const lesson = englishLessons[topic.id]
              return (
                <article className="topic-card clickable" key={topic.id} onClick={() => openTopic(topic)}>
                  <div className="topic-meta"><div className="priority low">Course topic</div><span>{topic.domain}</span></div>
                  <h3>{topic.name}</h3>
                  <p>{lesson?.summary ?? topic.name}</p>
                  <div className="lesson-card-meta"><span>Concepts</span><span>Exam guidance</span></div>
                  <div className="open-label">Open lesson →</div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {view === 'course' && selectedTopic && (() => {
        const lesson = englishLessons[selectedTopic.id]
        return (
          <section className="lesson-page">
            <button className="back" onClick={() => setSelectedTopic(null)}>← Back to course</button>
            <div className="lesson-header">
              <div>
                <span className="eyebrow">{selectedTopic.domain}</span>
                <h1>{selectedTopic.name}</h1>
                <p>{lesson?.summary}</p>
              </div>
            </div>
            <article className="lesson-article">
              <section className="content-section">
                <h2>Core idea</h2>
                <p>{lesson?.summary}</p>
              </section>
              <section className="content-section">
                <h2>What you must understand</h2>
                <ul>{lesson?.principles.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section className="content-section checklist">
                <h2>Exam traps and decision rules</h2>
                {lesson?.examTips.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
              </section>
              <section className="content-section summary-box">
                <h2>Practical example</h2>
                <p>{lesson?.example}</p>
              </section>
              <div className="lesson-actions">
                <button className="primary" onClick={() => startPractice(selectedTopic.id)}>Practice this topic</button>
                <button className="secondary" onClick={() => setSelectedTopic(null)}>Back to all topics</button>
              </div>
            </article>
          </section>
        )
      })()}

      {view === 'practice' && current && (
        <section className="quiz-card">
          <div className="topic-label">{topics.find((topic) => topic.id === current.topicId)?.name}</div>
          <h2>{current.prompt}</h2>
          <div className="options">
            {current.options.map((option, index) => (
              <button key={option} className={`option ${selected === index ? 'selected' : ''} ${checked && index === current.answer ? 'correct' : ''} ${checked && selected === index && index !== current.answer ? 'wrong' : ''}`} onClick={() => !checked && setSelected(index)}>
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>
          {!checked ? (
            <button className="primary" disabled={selected === null} onClick={() => setChecked(true)}>Check answer</button>
          ) : (
            <div className="feedback">
              <h3>{selected === current.answer ? 'Correct' : 'Incorrect'}</h3>
              <p>{explanationFor(current)}</p>
              <div className="feedback-actions">
                <button className="secondary" onClick={() => openTopic(topics.find((topic) => topic.id === current.topicId)!)}>Review lesson</button>
                <button className="primary" onClick={nextPractice}>Next question</button>
              </div>
            </div>
          )}
        </section>
      )}

      {view === 'exams' && !activeExam && (
        <section>
          <div className="section-title">
            <div>
              <span className="eyebrow">MOCK EXAMS</span>
              <h1>Session-only exam practice</h1>
              <p>No attempts, answers, percentages, or timestamps are written to local storage.</p>
            </div>
          </div>
          <div className="exam-grid">
            {examConfigs.map((exam) => (
              <article className="exam-card" key={exam.id}>
                <span className="exam-level">{exam.difficulty}</span>
                <h2>{exam.title}</h2>
                <p>{examDescriptions[exam.id]}</p>
                <div className="exam-meta"><span>{Math.min(exam.questionCount, questions.length)} questions</span><span>{exam.durationMinutes} suggested minutes</span></div>
                <button className="primary" onClick={() => startExam(exam)}>Start exam</button>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === 'exams' && activeExam && !examResult && examQuestion && (
        <section className="quiz-card exam-session">
          <div className="exam-header">
            <div><span className="eyebrow">{activeExam.title}</span><h2>Question {examIndex + 1} of {examQuestions.length}</h2></div>
            <span>{Object.keys(examAnswers).length}/{examQuestions.length} answered</span>
          </div>
          <div className="progress"><div style={{ width: `${(examIndex + 1) / examQuestions.length * 100}%` }} /></div>
          <h2>{examQuestion.prompt}</h2>
          <div className="options">
            {examQuestion.options.map((option, index) => (
              <button key={option} className={`option ${examAnswers[examQuestion.id] === index ? 'selected' : ''}`} onClick={() => setExamAnswers({ ...examAnswers, [examQuestion.id]: index })}>
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>
          <div className="exam-nav">
            <button className="secondary" disabled={examIndex === 0} onClick={() => setExamIndex(examIndex - 1)}>Previous</button>
            {examIndex < examQuestions.length - 1 ? (
              <button className="primary" disabled={examAnswers[examQuestion.id] === undefined} onClick={() => setExamIndex(examIndex + 1)}>Next</button>
            ) : (
              <button className="primary" disabled={Object.keys(examAnswers).length < examQuestions.length} onClick={finishExam}>Finish exam</button>
            )}
          </div>
        </section>
      )}

      {view === 'exams' && examResult && (
        <section className="result-card">
          <span className="eyebrow">CURRENT SESSION RESULT</span>
          <h1>{examResult.percentage}%</h1>
          <h2>{examResult.score}/{examResult.total} correct answers</h2>
          <p>This result is not saved. Reloading or leaving this version clears it.</p>
          <div className="result-review">
            {examQuestions.map((question, index) => (
              <article key={question.id}>
                <strong>Question {index + 1}: {examAnswers[question.id] === question.answer ? 'Correct' : 'Incorrect'}</strong>
                <p>{explanationFor(question)}</p>
              </article>
            ))}
          </div>
          <button className="primary" onClick={() => { setActiveExam(null); setExamResult(null) }}>Back to mock exams</button>
        </section>
      )}
    </main>
  )
}

export default AppEnglish
