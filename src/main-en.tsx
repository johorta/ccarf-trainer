import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './content-extension'
import AppEnglish from './AppEnglish'
import { StoredProgressTransfer } from './progress-transfer'
import './styles.css'
import './course.css'
import './exams.css'
import './transfer.css'

registerSW({ immediate: true })

function EnglishRoot() {
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/') window.location.href = '/ccarf-trainer/'
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <>
      <AppEnglish />
      <StoredProgressTransfer locale="en" storageKey="ccarf-trainer-progress-en-v1" />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnglishRoot />
  </React.StrictMode>,
)
