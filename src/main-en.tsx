import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './content-extension'
import AppEnglish from './AppEnglish'
import './styles.css'
import './course.css'
import './exams.css'

registerSW({ immediate: true })

function EnglishRoot() {
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/') window.location.href = '/ccarf-trainer/'
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return <AppEnglish />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnglishRoot />
  </React.StrictMode>,
)
