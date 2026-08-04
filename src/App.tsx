import { useMemo, useState } from 'react'
import { questions, topics, type Question, type Topic } from './data'

type Progress = {
  answered: number
  correct: number
  byTopic: Record<string, { answered: number; correct: number }>
}

type View = 'dashboard' | 'study' | 'practice' | 'vocabulary'

const STORAGE_KEY = 'ccarf-trainer-progress-v1'

function loadProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as Progress
  } catch {
    return { answered: 0, correct: 0, byTopic: {} }
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

  const vocabulary = useMemo(() => {
    const entries = new Map<string, string>()
    topics.forEach((topic) => Object.entries(topic.vocabulary).forEach(([word, meaning]) => entries.set(word, meaning)))
    questions.forEach((question) => Object.entries(question.vocabulary).forEach(([word, meaning]) => entries.set(word, meaning)))
    return [...entries.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [])

  function startPractice(topicId?: string) {
    const pool = topicId ? weightedQuestions.filter((question) => question.topicId === topicId) : weightedQuestions
    setCurrent(pool[0] ?? weightedQuestions[0])
    setSelected(null)
    setChecked(false)
    setView('practice')
  }

  function submit() {
    if (!current || selected === null || checked) return
    const isCorrect = selected === current.answer
    const next: Progress = {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setProgress(next)
    setChecked(true)
  }

  function nextQuestion() {
    if (!current) return
    const index = weightedQuestions.findIndex((question) => question.id === current.id)
    setCurrent(weightedQuestions[(index + 1) % weightedQuestions.length])
    setSelected(null)
    setChecked(false)
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

  return (
    <main className="shell">
      <nav className="top-nav">
        <button className="brand" onClick={() => setView('dashboard')}>CCAR-F Trainer</button>
        <div>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>Inicio</button>
          <button className={view === 'study' ? 'active' : ''} onClick={() => setView('study')}>Estudiar</button>
          <button className={view === 'practice' ? 'active' : ''} onClick={() => startPractice()}>Practicar</button>
          <button className={view === 'vocabulary' ? 'active' : ''} onClick={() => setView('vocabulary')}>Vocabulario</button>
        </div>
      </nav>

      {view === 'dashboard' && (
        <>
          <header className="hero">
            <div>
              <span className="eyebrow">CCAR-F TRAINER</span>
              <h1>Estudia todos los objetivos, priorizando tus brechas.</h1>
              <p>Clases en español, preguntas en inglés y progreso guardado en este dispositivo.</p>
            </div>
            <div className="hero-actions">
              <button className="primary" onClick={() => setView('study')}>Ver temas de estudio</button>
              <button className="primary" onClick={() => startPractice()}>Práctica adaptativa</button>
            </div>
          </header>

          <section className="stats">
            <article><strong>{progress.answered}</strong><span>Respondidas</span></article>
            <article><strong>{accuracy}%</strong><span>Precisión</span></article>
            <article><strong>{topics.filter((topic) => topic.priority === 'high').length}</strong><span>Temas prioritarios</span></article>
          </section>

          <section className="dashboard-grid">
            <article className="panel">
              <span className="eyebrow">SIGUIENTE PASO</span>
              <h2>{weightedQuestions[0] ? topics.find((topic) => topic.id === weightedQuestions[0].topicId)?.name : 'Comenzar'}</h2>
              <p>La práctica adaptativa prioriza los objetivos con menor puntaje y los temas que falles dentro de la aplicación.</p>
              <button className="primary" onClick={() => startPractice()}>Comenzar ahora</button>
            </article>
            <article className="panel">
              <span className="eyebrow">MAPA COMPLETO</span>
              <h2>{topics.length} objetivos</h2>
              <p>Agentic Architecture, Claude Code, Claude API, MCP y Tool Use.</p>
              <button className="secondary" onClick={() => setView('study')}>Abrir clases</button>
            </article>
          </section>
        </>
      )}

      {view === 'study' && !selectedTopic && (
        <section>
          <div className="section-title">
            <div><span className="eyebrow">CURSO COMPLETO</span><h1>Temas de estudio</h1><p>Explicaciones en español basadas en los objetivos de tu score report.</p></div>
            <button className="secondary" onClick={exportProgress}>Exportar progreso</button>
          </div>
          <div className="filter-row">
            {domains.map((domain) => <button key={domain} className={domainFilter === domain ? 'filter active' : 'filter'} onClick={() => setDomainFilter(domain)}>{domain}</button>)}
          </div>
          <div className="topic-grid">
            {filteredTopics.map((topic) => {
              const score = scoreFor(topic)
              return (
                <article className="topic-card clickable" key={topic.id} onClick={() => setSelectedTopic(topic)}>
                  <div className="topic-meta"><div className={`priority ${topic.priority}`}>{topic.priority === 'high' ? 'Alta prioridad' : topic.priority === 'medium' ? 'Prioridad media' : 'Refuerzo'}</div><span>{topic.domain}</span></div>
                  <h3>{topic.name}</h3>
                  <p>{topic.lesson}</p>
                  <div className="score-row"><span>Dominio estimado</span><strong>{score}%</strong></div>
                  <div className="progress"><div style={{ width: `${score}%` }} /></div>
                  <div className="open-label">Abrir clase →</div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {view === 'study' && selectedTopic && (
        <section className="lesson-page">
          <button className="back" onClick={() => setSelectedTopic(null)}>← Volver a todos los temas</button>
          <div className="lesson-header">
            <div><span className="eyebrow">{selectedTopic.domain}</span><h1>{selectedTopic.name}</h1><p>{selectedTopic.lesson}</p></div>
            <div className={`priority ${selectedTopic.priority}`}>{selectedTopic.priority === 'high' ? 'Alta prioridad' : selectedTopic.priority === 'medium' ? 'Prioridad media' : 'Refuerzo'}</div>
          </div>
          <div className="lesson-layout">
            <article className="lesson-block"><h2>Qué debes aprender</h2><ul>{selectedTopic.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></article>
            <article className="lesson-block warning"><h2>Trampas del examen</h2><ul>{selectedTopic.traps.map((trap) => <li key={trap}>{trap}</li>)}</ul></article>
            <article className="lesson-block full"><h2>Ejemplo práctico</h2><p>{selectedTopic.example}</p></article>
            <article className="lesson-block full"><h2>Vocabulario clave</h2><div className="vocabulary large">{Object.entries(selectedTopic.vocabulary).map(([word, meaning]) => <span key={word}><b>{word}</b>: {meaning}</span>)}</div></article>
          </div>
          <button className="primary" onClick={() => startPractice(selectedTopic.id)}>Practicar este tema</button>
        </section>
      )}

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
              <div className="vocabulary">{Object.entries(current.vocabulary).map(([word, meaning]) => <span key={word}><b>{word}</b>: {meaning}</span>)}</div>
              <button className="primary" onClick={nextQuestion}>Siguiente pregunta</button>
            </div>
          )}
        </section>
      )}

      {view === 'vocabulary' && (
        <section>
          <div className="section-title"><div><span className="eyebrow">ENGLISH HINTS</span><h1>Vocabulario del examen</h1><p>Palabras que pueden cambiar por completo el sentido de una pregunta.</p></div></div>
          <div className="vocab-grid">{vocabulary.map(([word, meaning]) => <article key={word}><strong>{word}</strong><span>{meaning}</span></article>)}</div>
        </section>
      )}
    </main>
  )
}

export default App
