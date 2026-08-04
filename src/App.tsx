import { useMemo, useState } from 'react'
import { questions, topics, type Question } from './data'

type Progress = {
  answered: number
  correct: number
  byTopic: Record<string, { answered: number; correct: number }>
}

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

  const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0

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

  function startPractice() {
    setCurrent(weightedQuestions[0])
    setSelected(null)
    setChecked(false)
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

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <span className="eyebrow">CCAR-F TRAINER</span>
          <h1>Estudia todos los objetivos, priorizando tus brechas.</h1>
          <p>Preguntas en inglés, explicaciones en español y progreso guardado en este dispositivo.</p>
        </div>
        <button className="primary" onClick={startPractice}>Comenzar práctica adaptativa</button>
      </header>

      <section className="stats">
        <article><strong>{progress.answered}</strong><span>Respondidas</span></article>
        <article><strong>{accuracy}%</strong><span>Precisión</span></article>
        <article><strong>{topics.filter((topic) => topic.priority === 'high').length}</strong><span>Temas prioritarios</span></article>
      </section>

      {current && (
        <section className="quiz-card">
          <div className="topic-label">{topics.find((topic) => topic.id === current.topicId)?.name}</div>
          <h2>{current.prompt}</h2>
          <div className="options">
            {current.options.map((option, index) => (
              <button
                key={option}
                className={`option ${selected === index ? 'selected' : ''} ${checked && index === current.answer ? 'correct' : ''} ${checked && selected === index && index !== current.answer ? 'wrong' : ''}`}
                onClick={() => !checked && setSelected(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>
          {!checked ? (
            <button className="primary" disabled={selected === null} onClick={submit}>Confirmar respuesta</button>
          ) : (
            <div className="feedback">
              <h3>{selected === current.answer ? 'Correcta' : 'Incorrecta'}</h3>
              <p>{current.explanationEs}</p>
              <div className="vocabulary">
                {Object.entries(current.vocabulary).map(([word, meaning]) => <span key={word}><b>{word}</b>: {meaning}</span>)}
              </div>
              <button className="primary" onClick={nextQuestion}>Siguiente pregunta</button>
            </div>
          )}
        </section>
      )}

      <section>
        <div className="section-title">
          <div><span className="eyebrow">MAPA DE ESTUDIO</span><h2>Objetivos iniciales</h2></div>
          <button className="secondary" onClick={exportProgress}>Exportar progreso</button>
        </div>
        <div className="topic-grid">
          {topics.map((topic) => {
            const result = progress.byTopic[topic.id]
            const score = result?.answered ? Math.round((result.correct / result.answered) * 100) : topic.reportScore
            return (
              <article className="topic-card" key={topic.id}>
                <div className={`priority ${topic.priority}`}>{topic.priority === 'high' ? 'Alta prioridad' : topic.priority === 'medium' ? 'Prioridad media' : 'Refuerzo'}</div>
                <h3>{topic.name}</h3>
                <p>{topic.lesson}</p>
                <div className="score-row"><span>Dominio estimado</span><strong>{score}%</strong></div>
                <div className="progress"><div style={{ width: `${score}%` }} /></div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
