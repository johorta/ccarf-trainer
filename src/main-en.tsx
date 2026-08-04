import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './content-extension'
import AppEnglish from './AppEnglish'
import './styles.css'
import './course.css'
import './exams.css'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppEnglish />
  </React.StrictMode>,
)
