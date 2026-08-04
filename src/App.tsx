import { useMemo, useState } from 'react'
import { questions, topics, type Question, type Topic } from './data'
import { lessons, type LessonContent } from './lessons'

type Progress = {
  answered: number
  correct: number
  byTopic: Record<string, { answered: number; correct: number }>
  completedLessons?: string[]
  lastTopicId?: string
}

type View = 'dashboard' | 'course' | 'practice' | 'progress'

const STORAGE_KEY = 'ccarf-trainer-progress-v1'

function emptyProgress(): Progress {
  return { answered: 0, correct: 0, byTopic: {}, completedLessons: [] }
}

function loadProgress(): Progress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as Progress
    return { ...emptyProgress(), ...stored, completedLessons: stored.completedLessons ?? [] }
  } catch {
    return emptyProgress()
  }
}

function genericLesson(topic: Topic): LessonContent {
  return {
    topicId: topic.id,
    readingMinutes: 8,
    difficulty: topic.priority === 'high' ? 4 : topic.priority === 'medium' ? 3 : 2,
    objectives: topic.keyPoints,
    sections: [
      {
        title: 'Concepto central',
        paragraphs: [topic.lesson, 'Esta lección está incorporada al mapa completo del curso. Su contenido profundo se irá ampliando manteniendo el mismo formato de lectura, ejemplos, trampas y práctica vinculada.'],
      },
      { title: 'Puntos que debes dominar', bullets: topic.keyPoints },
      { title: 'Trampas frecuentes del examen', bullets: topic.traps },
      { title: 'Escenario práctico', paragraphs: [topic.example] },
    ],
    checklist: topic.keyPoints.map((point) => `¿Puedes explicar por qué: ${point}`),
    summary: [topic.lesson, ...topic.keyPoints],
  }
}

function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [current, setCurrent] = useState<Question | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [view, setView] = useState<View>('dashboard')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [domainFilter, setDomainFilter] = useState('Todos')

  const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0
  const domains = ['Todos', ...Array.from(new Set(topics.map((topic) => topic.domain)))]
  const completedLessons = progress.completedLessons ?? []

  const weightedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      const ta = topics.find((topic) => topic.id === a.topicId)!
      const tb = topics.find((topic) => topic.id === b.topicId)!
      const sa = progress.byTopic[a.topicId]
      const sb = progress.byTopic[b.topicId]
      const pa = ta.priority === 'high' ? 3 : ta.priority === 'medium' ? 2 : 1
      const pb = tb.priority === 'high' ? 3 : tb.priority === 'medium' ? 2 : 1
      const aa = sa?.answered ? sa.correct / sa.answered : ta.reportScore / 100
      const ab = sb?.answered ? sb.correct / sb.answered : tb.reportScore / 100
      return pb * (1 - ab) - pa * (1 - aa)
    })
  }, [progress])

  function persist(next: Progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setProgress(next)
  }

  function openTopic(topic: Topic) {
    setSelectedTopic(topic)
    const next = { ...progress, lastTopicId: topic.id }
    persist(next)
    setView('course')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startPractice(topicId?: string) {
    const pool = topicId ? weightedQuestions.filter((question) => question.topicId === topicId) : weightedQuestions
    setCurrent(pool[0] ?? weightedQuestions[0])
    setSelected(null)
    setChecked(false)
    setView('practice')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submit() {
    if (!current || selected === null || checked) return
    const isCorrect = selected === current.answer
    const next: Progress = {
      ...progress,
      answered: progress.answered + 1,
      correct: progress.correct + (isCorrect ? 1 : 0),
      byTopic: {
        ...progress.byTopic,
        [current.topicId]: {
          answered: (progress.byTopic[current.topicId]?.answered ?? 0) + 1,
          correct: (progress.byTopic[current.topicId]?.correct ?? 0) + (isCorrect ? 1 : 0),
        },
      },
    }
    persist(next)
    setChecked(true)
  }

  function nextQuestion() {
    if (!current) return
    const index = weightedQuestions.findIndex((question) => question.id === current.id)
    setCurrent(weightedQuestions[(index + 1) % weightedQuestions.length])
    setSelected(null)
    setChecked(false)
  }

  function toggleLessonComplete(topicId: string) {
    const currentCompleted = progress.completedLessons ?? []
    const completed = currentCompleted.includes(topicId)
      ? currentCompleted.filter((id) => id !== topicId)
      : [...currentCompleted, topicId]
    persist({ ...progress, completedLessons: completed })
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ccarf-trainer-progress.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function scoreFor(topic: Topic) {
    const result = progress.byTopic[topic.id]
    return result?.answered ? Math.round((result.correct / result.answered) * 100) : topic.reportScore
  }

  const filteredTopics = domainFilter === 'Todos' ? topics : topics.filter((topic) => topic.domain === domainFilter)
  const lastTopic = topics.find((topic) => topic.id === progress.lastTopicId) ?? topics.find((topic) => topic.priority === 'high') ?? topics[0]
  const coursePercent = Math.round((completedLessons.length / topics.length) * 100)

  return (
    <main className="shell">
      <nav className="top-nav">
        <button className="brand" onClick={() => setView('dashboard')}>CCAR-F Trainer</button>
        <div>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>Inicio</button>
          <button className={view === 'course' ? 'active' : ''} onClick={() => { setSelectedTopic(null); setView('course') }}>Curso</button>
          <button className={view === 'practice' ? 'active' : ''} onClick={() => startPractice()}>Práctica</button>
          <button className={view === 'progress' ? 'active' : ''} onClick={() => setView('progress')}>Progreso</button>
        </div>
      </nav>

      {view === 'dashboard' && (
        <>
          <header className="hero">
            <div>
              <span className="eyebrow">CURSO INTERACTIVO CCAR-F</span>
              <h1>Aprende los conceptos antes de practicar.</h1>
              <p>Lecciones extensas en español, preguntas tipo examen en inglés y refuerzo adaptativo de tus áreas débiles.</p>
            </div>
            <div className="hero-actions">
              <button className="primary" onClick={() => openTopic(lastTopic)}>Continuar curso</button>
              <button className="primary" onClick={() => startPractice()}>Práctica adaptativa</button>
            </div>
          </header>

          <section className="stats">
            <article><strong>{coursePercent}%</strong><span>Curso completado</span></article>
            <article><strong>{progress.answered}</strong><span>Preguntas respondidas</span></article>
            <article><strong>{accuracy}%</strong><span>Precisión</span></article>
          </section>

          <section className="dashboard-grid">
            <article className="panel featured-panel">
              <span className="eyebrow">CONTINUAR APRENDIENDO</span>
              <h2>{lastTopic.name}</h2>
              <p>{lastTopic.lesson}</p>
              <button className="primary" onClick={() => openTopic(lastTopic)}>Abrir lección</button>
            </article>
            <article className="panel">
              <span className="eyebrow">ESTRATEGIA DE RECUPERACIÓN</span>
              <h2>{topics.filter((topic) => topic.priority === 'high').length} temas prioritarios</h2>
              <p>El curso incluye todos los objetivos, pero privilegia los resultados más bajos de tu score report.</p>
              <button className="secondary" onClick={() => { setSelectedTopic(null); setView('course') }}>Ver mapa completo</button>
            </article>
          </section>
        </>
      )}

      {view === 'course' && !selectedTopic && (
        <section>
          <div className="section-title">
            <div><span className="eyebrow">CURSO COMPLETO</span><h1>Dominios y lecciones</h1><p>Abre una lección para estudiar teoría, ejemplos, trampas y checklist de examen.</p></div>
            <button className="secondary" onClick={exportProgress}>Exportar progreso</button>
          </div>
          <div className="course-overview">
            <div><strong>{completedLessons.length}/{topics.length}</strong><span>lecciones completadas</span></div>
            <div className="progress large-progress"><div style={{ width: `${coursePercent}%` }} /></div>
          </div>
          <div className="filter-row">
            {domains.map((domain) => <button key={domain} className={domainFilter === domain ? 'filter active' : 'filter'} onClick={() => setDomainFilter(domain)}>{domain}</button>)}
          </div>
          <div className="topic-grid">
            {filteredTopics.map((topic) => {
              const score = scoreFor(topic)
              const complete = completedLessons.includes(topic.id)
              const lesson = lessons[topic.id]
              return (
                <article className={`topic-card clickable ${complete ? 'completed' : ''}`} key={topic.id} onClick={() => openTopic(topic)}>
                  <div className="topic-meta"><div className={`priority ${topic.priority}`}>{topic.priority === 'high' ? 'Alta prioridad' : topic.priority === 'medium' ? 'Prioridad media' : 'Refuerzo'}</div><span>{topic.domain}</span></div>
                  <h3>{complete ? '✓ ' : ''}{topic.name}</h3>
                  <p>{topic.lesson}</p>
                  <div className="lesson-card-meta"><span>{lesson ? `${lesson.readingMinutes} min` : '8 min'}</span><span>Dificultad {lesson ? lesson.difficulty : topic.priority === 'high' ? 4 : 2}/5</span></div>
                  <div className="score-row"><span>Dominio estimado</span><strong>{score}%</strong></div>
                  <div className="progress"><div style={{ width: `${score}%` }} /></div>
                  <div className="open-label">{complete ? 'Repasar lección →' : 'Comenzar lección →'}</div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {view === 'course' && selectedTopic && (() => {
        const lesson = lessons[selectedTopic.id] ?? genericLesson(selectedTopic)
        const complete = completedLessons.includes(selectedTopic.id)
        const currentIndex = topics.findIndex((topic) => topic.id === selectedTopic.id)
        const previous = currentIndex > 0 ? topics[currentIndex - 1] : null
        const next = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null
        return (
          <section className="lesson-page">
            <button className="back" onClick={() => setSelectedTopic(null)}>← Volver al índice del curso</button>
            <div className="lesson-header">
              <div>
                <span className="eyebrow">{selectedTopic.domain}</span>
                <h1>{selectedTopic.name}</h1>
                <p>{selectedTopic.lesson}</p>
                <div className="lesson-meta"><span>{lesson.readingMinutes} min de lectura</span><span>Dificultad {'★'.repeat(lesson.difficulty)}{'☆'.repeat(5 - lesson.difficulty)}</span></div>
              </div>
              <div className={`priority ${selectedTopic.priority}`}>{selectedTopic.priority === 'high' ? 'Alta prioridad' : selectedTopic.priority === 'medium' ? 'Prioridad media' : 'Refuerzo'}</div>
            </div>

            <div className="lesson-content">
              <aside className="lesson-sidebar">
                <strong>En esta lección</strong>
                {lesson.sections.map((section) => <a key={section.title} href={`#${section.title.replace(/[^a-zA-Z0-9]/g, '-')}`}>{section.title}</a>)}
              </aside>
              <article className="lesson-article">
                <section className="learning-objectives">
                  <h2>Qué aprenderás</h2>
                  <ul>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
                </section>
                {lesson.sections.map((section) => (
                  <section className="content-section" id={section.title.replace(/[^a-zA-Z0-9]/g, '-')} key={section.title}>
                    <h2>{section.title}</h2>
                    {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                    {section.diagram && <div className="diagram">{section.diagram.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}</div>}
                    {section.goodExample && <div className="example good"><strong>Ejemplo recomendado</strong><pre>{section.goodExample}</pre></div>}
                    {section.badExample && <div className="example bad"><strong>Ejemplo problemático</strong><pre>{section.badExample}</pre></div>}
                  </section>
                ))}
                <section className="content-section checklist">
                  <h2>Checklist antes del examen</h2>
                  {lesson.checklist.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
                </section>
                <section className="content-section summary-box">
                  <h2>Resumen que debes recordar</h2>
                  <ul>{lesson.summary.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <div className="lesson-actions">
                  <button className={complete ? 'secondary' : 'primary'} onClick={() => toggleLessonComplete(selectedTopic.id)}>{complete ? 'Marcar como pendiente' : '✓ Marcar como completada'}</button>
                  <button className="primary" onClick={() => startPractice(selectedTopic.id)}>Practicar este tema</button>
                </div>
                <div className="lesson-navigation">
                  {previous ? <button className="secondary" onClick={() => openTopic(previous)}>← {previous.name}</button> : <span />}
                  {next ? <button className="secondary" onClick={() => openTopic(next)}>{next.name} →</button> : <span />}
                </div>
              </article>
            </div>
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
          {!checked ? <button className="primary" disabled={selected === null} onClick={submit}>Confirmar respuesta</button> : (
            <div className="feedback">
              <h3>{selected === current.answer ? 'Correcta' : 'Incorrecta'}</h3>
              <p>{current.explanationEs}</p>
              <div className="feedback-actions">
                <button className="secondary" onClick={() => { const topic = topics.find((item) => item.id === current.topicId); if (topic) openTopic(topic) }}>Repasar la lección</button>
                <button className="primary" onClick={nextQuestion}>Siguiente pregunta</button>
              </div>
            </div>
          )}
        </section>
      )}

      {view === 'progress' && (
        <section>
          <div className="section-title"><div><span className="eyebrow">TU AVANCE</span><h1>Progreso del curso</h1><p>Lecciones completadas y desempeño de práctica por objetivo.</p></div><button className="secondary" onClick={exportProgress}>Exportar JSON</button></div>
          <section className="stats">
            <article><strong>{completedLessons.length}</strong><span>Lecciones completadas</span></article>
            <article><strong>{progress.answered}</strong><span>Preguntas respondidas</span></article>
            <article><strong>{accuracy}%</strong><span>Precisión total</span></article>
          </section>
          <div className="progress-list">
            {topics.map((topic) => <article key={topic.id}><div><strong>{topic.name}</strong><span>{completedLessons.includes(topic.id) ? 'Lección completada' : 'Pendiente'}</span></div><strong>{scoreFor(topic)}%</strong></article>)}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
