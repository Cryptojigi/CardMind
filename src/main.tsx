import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GlobalStateProvider } from './context/GlobalStateContext'
import { LanguageProvider } from './context/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
