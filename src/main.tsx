import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './content-extension'
import App from './App'
import AppEnglish from './AppEnglish'
import './styles.css'
import './course.css'
import './exams.css'

registerSW({ immediate: true })

function Root() {
  const [hash, setHash] = React.useState(window.location.hash)

  React.useEffect(() => {
    const updateRoute = () => setHash(window.location.hash)
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return hash.startsWith('#/en') ? <AppEnglish /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
