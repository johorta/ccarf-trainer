import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './content-extension'
import App from './App'
import AppEnglish from './AppEnglish'
import { StoredProgressTransfer } from './progress-transfer'
import './styles.css'
import './course.css'
import './exams.css'
import './transfer.css'

registerSW({ immediate: true })

function Root() {
  const [hash, setHash] = React.useState(window.location.hash)

  React.useEffect(() => {
    const updateRoute = () => setHash(window.location.hash)
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  const englishRoute = hash.startsWith('#/en')
  return (
    <>
      {englishRoute ? <AppEnglish /> : <App />}
      {!englishRoute && <StoredProgressTransfer locale="es" storageKey="ccarf-trainer-progress-v2" />}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
